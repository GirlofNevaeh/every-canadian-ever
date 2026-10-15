import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { LANGS, useLang } from "@/i18n/lang";
import { useT } from "@/i18n/text";
import { searchAll, type Hit } from "@/lib/search";
import { Gate } from "@/components/paywall";

const NAV = [
  { to: "/", key: "nav.home" },
  { to: "/places", key: "nav.places" },
  { to: "/nations", key: "nav.nations" },
  { to: "/leaders", key: "nav.leaders" },
  { to: "/time", key: "nav.time" },
  { to: "/quiz", key: "nav.quiz" },
  { to: "/work", key: "nav.work" },
  { to: "/about", key: "nav.about" },
] as const;

export function Leaf({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M32 6 C34 18 44 20 52 18 C46 28 48 34 42 40 C50 42 54 50 48 56 C40 50 36 48 32 58 C28 48 24 50 16 56 C10 50 14 42 22 40 C16 34 18 28 12 18 C20 20 30 18 32 6 Z"
        fill="#FF0000"
      />
      <path d="M32 58 V28" stroke="#F7F5F2" strokeWidth="3" />
    </svg>
  );
}

export function Mountie({ className = "h-44 w-full" }: { className?: string }) {
  const { t } = useT();
  return (
    <svg viewBox="0 0 360 220" className={className} role="img" aria-label={t("home.mountie")}>
      <path d="M24 196 H336" stroke="#121212" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(348 0) scale(-1 1)">
        <path
          d="M64 128 C40 112 36 78 58 72"
          fill="none"
          stroke="#121212"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path d="M78 168 L66 202 H84 L98 172 Z" fill="#121212" />
        <path d="M112 174 L108 204 H126 L132 176 Z" fill="#121212" />
        <path
          d="M72 164 C68 118 118 100 176 104 C214 106 246 92 262 74 L286 90 C268 116 236 136 204 142 C236 156 214 176 168 178 C112 182 78 184 72 164 Z"
          fill="#121212"
        />
        <path d="M188 168 L178 204 H196 L210 170 Z" fill="#121212" />
        <path d="M222 162 L236 204 H254 L238 156 Z" fill="#121212" />
        <path
          d="M248 78 C272 58 318 62 332 82 C340 94 332 108 312 110 C298 122 274 114 262 100 C250 112 236 98 248 78 Z"
          fill="#121212"
        />
        <path d="M270 62 L262 38 L288 58 Z" fill="#121212" />
        <ellipse cx="324" cy="92" rx="16" ry="9" fill="#F7F5F2" />
        <circle cx="292" cy="74" r="3.4" fill="#F7F5F2" />
        <path
          d="M250 78 Q228 96 236 122"
          fill="none"
          stroke="#FF0000"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M118 148 Q86 132 78 156 Q108 150 128 162 Z" fill="#FF0000" />
        <path d="M156 132 Q176 158 206 150 L200 164 Q164 174 144 146 Z" fill="#121212" />
        <path d="M196 150 L228 158 L222 170 L188 162 Z" fill="#121212" />
        <path
          d="M132 78 Q126 122 150 136 L196 126 Q206 92 192 68 Q166 54 132 78 Z"
          fill="#FF0000"
          stroke="#121212"
          strokeWidth="2.5"
        />
        <path d="M146 112 H186" stroke="#F7F5F2" strokeWidth="5" strokeLinecap="round" />
        <path d="M152 84 L178 122" stroke="#F7F5F2" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M154 88 Q122 72 108 46"
          fill="none"
          stroke="#FF0000"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="104" cy="40" r="9" fill="#F7F5F2" stroke="#121212" strokeWidth="2.2" />
        <circle cx="162" cy="58" r="17" fill="#F7F5F2" stroke="#121212" strokeWidth="2.5" />
        <circle cx="156" cy="56" r="1.7" fill="#121212" />
        <circle cx="166" cy="56" r="1.7" fill="#121212" />
        <path d="M155 64 Q162 69 169 64" fill="none" stroke="#121212" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="162" cy="44" rx="28" ry="6.5" fill="#121212" />
        <path d="M148 44 Q162 24 178 42 Q164 32 148 44 Z" fill="#121212" />
        <path d="M150 42 Q162 34 176 42" fill="none" stroke="#FF0000" strokeWidth="3.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function SearchForm({ big = false }: { big?: boolean }) {
  const { t } = useT();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [miss, setMiss] = useState(false);

  function open(hit: Hit) {
    if (hit.kind === "place") void navigate({ to: "/places/$slug", params: { slug: hit.slug } });
    else if (hit.kind === "nation") void navigate({ to: "/nations/$slug", params: { slug: hit.slug } });
    else void navigate({ to: "/leaders/$slug", params: { slug: hit.slug } });
  }

  function go(event: FormEvent) {
    event.preventDefault();
    const found = searchAll(query);
    setMiss(found.length === 0);
    if (found.length === 1) {
      setHits(null);
      open(found[0]!);
      return;
    }
    setHits(found.length ? found : null);
  }

  return (
    <form onSubmit={go} className={big ? "grid gap-2" : "grid gap-2"}>
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setMiss(false);
          }}
          placeholder={t("search.placeholder")}
          aria-label={t("search.placeholder")}
          className="min-w-0 flex-1 rounded-xl border-2 border-ink bg-card px-3 py-3 text-ink"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-flag px-3 py-3 font-extrabold text-card"
        >
          {t("search.button")}
        </button>
      </div>
      {miss ? <p className="text-sm font-bold">{t("search.none")}</p> : null}
      {hits && hits.length > 1 ? (
        <ul className="grid gap-2">
          <li className="text-sm font-bold">{t("search.pick")}</li>
          {hits.map((hit) => (
            <li key={hit.label}>
              <Link
                to={hit.kind === "place" ? "/places/$slug" : hit.kind === "nation" ? "/nations/$slug" : "/leaders/$slug"}
                params={{ slug: hit.slug }}
                className="block rounded-xl border-2 border-ink bg-card px-3 py-3 font-bold"
              >
                {hit.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { t } = useT();
  const { lang, setLang } = useLang();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-card focus:px-3 focus:py-2">
        {t("nav.home")}
      </a>
      <header className="no-print border-b-4 border-ink bg-paper">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold leading-none">
            <Leaf />
            <span>Every Canadian Ever</span>
          </Link>
          <label className="min-w-0">
            <span className="sr-only">Language</span>
            <select
              value={lang}
              onChange={(event) => setLang(event.target.value as typeof lang)}
              className="max-w-[11rem] rounded-xl border-2 border-ink bg-card px-2 py-2 font-bold"
            >
              {LANGS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <nav className="mx-auto grid max-w-5xl grid-cols-4 gap-1 px-3 pb-3" aria-label="Pages">
          {NAV.map((item) => {
            const active = item.to === "/" ? path === "/" : path === item.to || path.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex min-h-11 items-center justify-center rounded-lg px-1 text-center text-xs font-extrabold leading-tight ${active ? "bg-flag text-card" : "bg-card text-ink"} border-2 border-ink`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="mx-auto max-w-5xl px-4 pb-4">
          <SearchForm />
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-4 py-6">
        <Gate path={path}>{children}</Gate>
      </main>
      <footer className="no-print border-t-4 border-ink px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="max-w-md font-bold">{t("about.1")}</p>
          <button
            type="button"
            className="rounded-xl border-2 border-ink bg-card px-3 py-3 font-extrabold"
            onClick={() => dialogRef.current?.showModal()}
          >
            {t("install.open")}
          </button>
        </div>
      </footer>
      <dialog
        ref={dialogRef}
        className="w-[min(100%,24rem)] rounded-2xl border-4 border-ink bg-card p-6 text-ink backdrop:bg-ink/40"
      >
        <h2 className="font-display text-3xl">{t("install.title")}</h2>
        <p className="mt-3 text-lg">{t("install.body")}</p>
        <form method="dialog" className="mt-4">
          <button className="rounded-xl bg-flag px-4 py-3 font-extrabold text-card" type="submit">
            {t("install.close")}
          </button>
        </form>
      </dialog>
    </div>
  );
}

export { SearchForm };
