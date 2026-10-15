import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LeaderPortrait } from "@/components/portrait";
import { LEADERS } from "@/data/leaders";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/time")({ component: TimePage });

const PLACE_STEPS = [
  "time.nations",
  "time.1867",
  "time.1870",
  "time.1871",
  "time.1873",
  "time.1898",
  "time.1905",
  "time.1949",
  "time.1999",
] as const;

function TimePage() {
  const { t } = useT();
  const steps = PLACE_STEPS.length + 1 + LEADERS.length;
  const [index, setIndex] = useState(0);
  const bridgeAt = PLACE_STEPS.length;
  let kind = t("time.kind.places");
  let title = "";
  let body = "";
  let leader = null as (typeof LEADERS)[number] | null;
  if (index < PLACE_STEPS.length) {
    const key = PLACE_STEPS[index]!;
    kind = index === 0 ? t("time.kind.peoples") : t("time.kind.places");
    title = t(`${key}.title`);
    body = t(`${key}.body`);
  } else if (index === bridgeAt) {
    kind = t("time.kind.leader");
    title = t("nav.leaders");
    body = t("time.bridge");
  } else {
    leader = LEADERS[index - bridgeAt - 1]!;
    kind = t("time.kind.leader");
    title = leader.name;
    const terms = leader.terms
      .map((term) => `${term.start}–${term.end ?? t("still.office")}`)
      .join(", ");
    body = `${terms}. ${t(`leader.${leader.slug}.f1`)}`;
  }

  return (
    <div className="grid gap-4">
      <h1 className="font-display text-5xl">{t("nav.time")}</h1>
      <p className="text-sm font-extrabold">
        {index + 1} / {steps}
      </p>
      <article className="grid min-h-[24rem] content-between gap-6 rounded-[2rem] border-4 border-ink bg-card p-6">
        <div>
          <p className="inline-block rounded-full bg-flag px-3 py-1 text-sm font-extrabold text-card">{kind}</p>
          <h2 className="mt-4 font-display text-5xl">{title}</h2>
          <p className="mt-4 max-w-2xl text-xl">{body}</p>
        </div>
        {leader ? (
          <Link to="/leaders/$slug" params={{ slug: leader.slug }} className="block h-40 w-32">
            <LeaderPortrait look={leader.look} label={leader.name} />
          </Link>
        ) : null}
      </article>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          className="min-h-14 rounded-2xl border-2 border-ink bg-card text-lg font-extrabold disabled:opacity-40"
        >
          {t("earlier")}
        </button>
        <button
          type="button"
          disabled={index === steps - 1}
          onClick={() => setIndex((value) => Math.min(steps - 1, value + 1))}
          className="min-h-14 rounded-2xl bg-flag text-lg font-extrabold text-card disabled:opacity-40"
        >
          {t("later")}
        </button>
      </div>
    </div>
  );
}
