import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CanadaMap } from "@/components/maps";
import { LeaderPortrait } from "@/components/portrait";
import { LEADERS } from "@/data/leaders";
import { PLACES } from "@/data/places";
import { AGE_IDS, PROJECTS, type AgeId } from "@/data/projects";
import { formatDate, useT } from "@/i18n/text";

export const Route = createFileRoute("/work")({ component: WorkPage });

function WorkPage() {
  const { t, lang } = useT();
  const [age, setAge] = useState<AgeId>("5-6");
  const [leaderSlug, setLeaderSlug] = useState(LEADERS[0]!.slug);
  const [blank, setBlank] = useState(false);
  const leader = LEADERS.find((item) => item.slug === leaderSlug) ?? LEADERS[0]!;
  const cards = useMemo(() => PROJECTS.filter((item) => item.age === age), [age]);
  const date = (iso: string) => formatDate(iso, t, lang === "en-US");

  return (
    <div className="grid gap-8">
      <header>
        <h1 className="font-display text-5xl">{t("nav.work")}</h1>
      </header>

      <section className="print-sheet rounded-3xl border-4 border-ink bg-card p-4">
        <div className="no-print flex justify-end">
          <button type="button" onClick={() => window.print()} className="rounded-xl bg-flag px-4 py-3 font-extrabold text-card">{t("work.print")}</button>
        </div>
        <h2 className="font-display text-3xl">{t("work.map")}</h2>
        <CanadaMap insetLabel={t("inset.north")} labelFor={(slug) => PLACES.find((place) => place.slug === slug)?.name ?? slug} />
        <ul className="mt-3 columns-2 gap-6 text-sm font-bold">
          {PLACES.map((place) => (
            <li key={place.slug} className="mb-2">
              {place.name} ________
            </li>
          ))}
        </ul>
      </section>

      <section className="print-sheet rounded-3xl border-4 border-dashed border-ink bg-card p-4">
        <div className="no-print mb-3 flex flex-wrap gap-2">
          <label className="font-bold">
            {t("work.pickLeader")}
            <select value={leaderSlug} onChange={(event) => setLeaderSlug(event.target.value)} className="ml-2 rounded-xl border-2 border-ink bg-card px-2 py-2">
              {LEADERS.map((item) => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => setBlank((value) => !value)} className="rounded-xl border-2 border-ink px-3 py-2 font-extrabold">
            {t("work.blank")}
          </button>
        </div>
        <h2 className="font-display text-3xl">{t("work.card")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-[9rem_1fr]">
          <div className="h-36">{blank ? null : <LeaderPortrait look={leader.look} label={leader.name} />}</div>
          <div className="grid gap-2 text-lg">
            <p className="font-display text-3xl">{blank ? "______________" : leader.name}</p>
            <p><span className="font-extrabold">{t("born")}: </span>{blank ? "______________" : date(leader.born)}</p>
            <p><span className="font-extrabold">{t("died")}: </span>{blank ? "______________" : leader.died ? date(leader.died) : t("still.living")}</p>
            <p className="font-extrabold">{t("terms")}</p>
            {blank ? <p>______________</p> : leader.terms.map((term) => (
              <p key={`${term.start}-${term.end ?? "x"}`}>{term.start}–{term.end ?? t("still.office")}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="no-print flex flex-wrap gap-2">
        {AGE_IDS.map((id) => (
          <button key={id} type="button" onClick={() => setAge(id)} className={`min-h-11 rounded-full border-2 border-ink px-3 font-extrabold ${age === id ? "bg-flag text-card" : "bg-card"}`}>
            {t("work.ages", { range: id })}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {cards.map((project) => (
          <article key={project.id} className="rounded-3xl border-2 border-ink bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-3xl">{t(`${project.id}.title`)}</h2>
              <span className="rounded-full bg-flag px-3 py-1 text-sm font-extrabold text-card">
                {t(project.mode === "solo" ? "work.solo" : "work.team")}
              </span>
            </div>
            <p className="mt-2 font-bold">{t("work.time")}: {t(`${project.id}.time`)}</p>
            <p className="font-bold">{t("work.need")}: {t(`${project.id}.need`)}</p>
            <h3 className="mt-3 font-extrabold">{t("work.steps")}</h3>
            <ol className="mt-1 list-decimal pl-5">
              <li>{t(`${project.id}.s1`)}</li>
              <li>{t(`${project.id}.s2`)}</li>
              <li>{t(`${project.id}.s3`)}</li>
            </ol>
            <p className="mt-3"><span className="font-extrabold">{t("work.done")}: </span>{t(`${project.id}.done`)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
