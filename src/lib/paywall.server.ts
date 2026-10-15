import { createHmac, timingSafeEqual } from "node:crypto";
import { getCookie, getRequestUrl, setCookie } from "@tanstack/react-start/server";
import { env } from "@/lib/env.server";

const COOKIE = "ece_pass";
const PRICE_ID = "price_1UQmITQOJmxJjHnmJ58rx6WJ";

function secret() {
  return env("STRIPE_SECRET_KEY");
}

function priceId() {
  return env("STRIPE_PRICE_ID") || PRICE_ID;
}

function token(key: string) {
  return createHmac("sha256", key).update("ece-pass-v1").digest("hex");
}

function passMatches(value: string | undefined, key: string) {
  if (!value) return false;
  const expected = token(key);
  const left = Buffer.from(value);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function readPass() {
  const key = secret();
  if (!key) return false;
  return passMatches(getCookie(COOKIE), key);
}

function grantPass(key: string) {
  const url = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
  setCookie(COOKIE, token(key), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: url.protocol === "https:",
    maxAge: 60 * 60 * 24 * 400,
  });
}

export async function createCheckout() {
  const key = secret();
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  const url = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("line_items[0][price]", priceId());
  params.set("line_items[0][quantity]", "1");
  params.set("cancel_url", `${url.origin}/`);
  const body = `${params.toString()}&success_url=${encodeURIComponent(`${url.origin}/?session_id=`)}{CHECKOUT_SESSION_ID}`;
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const payload = (await response.json()) as { url?: string; error?: { message?: string } };
  if (!response.ok || !payload.url) {
    throw new Error(payload.error?.message || "Stripe checkout failed");
  }
  return { url: payload.url };
}

export async function confirmCheckout(sessionId: string) {
  const key = secret();
  if (!key || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return false;
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!response.ok) return false;
  const payload = (await response.json()) as { payment_status?: string };
  if (payload.payment_status !== "paid") return false;
  grantPass(key);
  return true;
}
