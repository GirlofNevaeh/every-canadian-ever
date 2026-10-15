import { createFileRoute, Link } from "@tanstack/react-router";
import { NationsMap } from "@/components/maps";
import { NATIONS } from "@/data/nations";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/nations/")({ component: NationsPage });

function NationsPage() {
  const { t } = useT();
  return (
    <div className="grid gap-6">
      <header className="grid gap-3 md:grid-cols-3">
        <h1 className="font-display text-5xl md:col-span-3">{t("nav.nations")}</h1>
        {[t("nations.notOne"), t("nations.hundreds"), t("nations.schools")].map((line) => (
          <p key={line} className="rounded-3xl border-4 border-ink bg-card p-4 text-lg font-bold">
            {line}
          </p>
        ))}
      </header>
      <div className="rounded-3xl border-4 border-flag bg-paper p-3">
        <NationsMap labelFor={(slug) => NATIONS.find((nation) => nation.slug === slug)?.name ?? slug} />
        <p className="px-2 pt-2 font-bold">{t("nations.mapNote")}</p>
      </div>
      <ol className="grid gap-2">
        {NATIONS.map((nation, index) => (
          <li key={nation.slug}>
            <Link
              to="/nations/$slug"
              params={{ slug: nation.slug }}
              className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-card px-3 py-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-flag font-extrabold text-card">
                {index + 1}
              </span>
              <span>
                <span className="block font-extrabold">{nation.name}</span>
                <span className="block text-sm">{t(`nation.${nation.slug}.englishLine`)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
