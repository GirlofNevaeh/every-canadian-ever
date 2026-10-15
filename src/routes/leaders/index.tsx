import { createFileRoute, Link } from "@tanstack/react-router";
import { LeaderPortrait } from "@/components/portrait";
import { LEADERS } from "@/data/leaders";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/leaders/")({ component: LeadersPage });

function LeadersPage() {
  const { t } = useT();
  return (
    <div>
      <h1 className="font-display text-5xl">{t("nav.leaders")}</h1>
      <p className="mt-2 max-w-xl font-bold">{t("door.leaders")}</p>
      <ol className="relative mt-6 grid gap-3 border-l-4 border-flag pl-4">
        {LEADERS.map((leader, index) => (
          <li key={leader.slug}>
            <Link to="/leaders/$slug" params={{ slug: leader.slug }} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 rounded-2xl border-2 border-ink bg-card p-2">
              <div className="h-24">
                <LeaderPortrait look={leader.look} label={leader.name} />
              </div>
              <span>
                <span className="block text-xs font-extrabold text-flag">{String(index + 1).padStart(2, "0")}</span>
                <span className="block font-display text-2xl leading-tight">{leader.name}</span>
                <span className="block text-sm font-bold">
                  {leader.terms
                    .map((term) => `${term.start}–${term.end ?? t("still.office")}`)
                    .join(", ")}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
