import { createServerFn } from "@tanstack/react-start";

export const hasPass = createServerFn({ method: "GET" }).handler(async () => {
  const { readPass } = await import("./paywall.server");
  return readPass();
});

export const startCheckout = createServerFn({ method: "POST" }).handler(async () => {
  const { createCheckout } = await import("./paywall.server");
  return createCheckout();
});

export const confirmPass = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const sessionId =
      typeof input === "object" && input && "sessionId" in input ? String((input as { sessionId: unknown }).sessionId) : "";
    if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) throw new Error("bad session");
    return { sessionId };
  })
  .handler(async ({ data }) => {
    const { confirmCheckout } = await import("./paywall.server");
    return confirmCheckout(data.sessionId);
  });
