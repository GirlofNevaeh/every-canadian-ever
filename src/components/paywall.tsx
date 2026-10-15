import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { confirmPass, hasPass, startCheckout } from "@/lib/paywall";
import { useT } from "@/i18n/text";

const PRICE = "CA$9.99";

export function Gate({ path, children }: { path: string; children: ReactNode }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [justPaid, setJustPaid] = useState(false);

  useEffect(() => {
    let cancel = false;
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    async function check() {
      if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) {
        const paid = await confirmPass({ data: { sessionId } });
        if (cancel) return;
        if (paid) {
          setOpen(true);
          setJustPaid(true);
        }
        const next = new URL(window.location.href);
        next.searchParams.delete("session_id");
        window.history.replaceState({}, "", `${next.pathname}${next.search}${next.hash}`);
        if (paid) return;
      }
      const allowed = await hasPass();
      if (!cancel) setOpen(allowed);
    }
    void check();
    return () => {
      cancel = true;
    };
  }, [path]);

  if (path !== "/" && !open) return <Paywall />;

  return (
    <>
      {justPaid && path === "/" ? <p className="mb-4 rounded-2xl border-4 border-flag bg-card p-4 font-extrabold">{t("pay.done")}</p> : null}
      {children}
    </>
  );
}

function Paywall() {
  const { t } = useT();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function pay() {
    setBusy(true);
    setError(false);
    try {
      const { url } = await startCheckout();
      window.location.assign(url);
    } catch {
      setError(true);
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border-4 border-ink bg-card p-6">
      <h1 className="font-display text-5xl">{t("pay.title")}</h1>
      <p className="mt-3 max-w-xl text-lg font-bold">{t("pay.body")}</p>
      <button
        type="button"
        onClick={() => void pay()}
        disabled={busy}
        className="mt-5 rounded-2xl bg-flag px-4 py-4 text-lg font-extrabold text-card disabled:opacity-70"
      >
        {busy ? t("pay.wait") : t("pay.button", { price: PRICE })}
      </button>
      {error ? <p className="mt-3 font-bold">{t("pay.error")}</p> : null}
      <p className="mt-4">
        <Link to="/" className="font-extrabold underline">
          {t("pay.back")}
        </Link>
      </p>
    </section>
  );
}
