import { createFileRoute, Link } from "@tanstack/react-router";
import { LeaderPortrait } from "@/components/portrait";
import { leaderBySlug } from "@/data/leaders";
import { formatDate, useT } from "@/i18n/text";

export const Route = createFileRoute("/leaders/$slug")({ component: LeaderPage });

function LeaderPage() {
  const { slug } = Route.useParams();
  const leader = leaderBySlug(slug);
  const { t, lang } = useT();
  if (!leader) {
    return (
      <div>
        <h1 className="font-display text-4xl">{t("notFound.title")}</h1>
        <Link to="/leaders" className="mt-4 inline-block font-extrabold underline">{t("nav.leaders")}</Link>
      </div>
    );
  }
  const date = (iso: string) => formatDate(iso, t, lang === "en-US");
  return (
    <article className="grid gap-5 md:grid-cols-[16rem_1fr]">
      <div className="rounded-3xl border-4 border-ink bg-card p-3">
        <div className="mx-auto h-72 max-w-56">
          <LeaderPortrait look={leader.look} label={leader.name} />
        </div>
        <p className="mt-2 text-center text-sm font-extrabold">{leader.name}</p>
      </div>
      <div className="grid gap-4">
        <h1 className="font-display text-5xl">{leader.name}</h1>
        <dl className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-ink bg-card p-4">
            <dt className="text-sm font-extrabold">{t("born")}</dt>
            <dd className="font-display text-2xl">{date(leader.born)}</dd>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-card p-4">
            <dt className="text-sm font-extrabold">{t("died")}</dt>
            <dd className="font-display text-2xl">{leader.died ? date(leader.died) : t("still.living")}</dd>
          </div>
        </dl>
        {leader.diedInOffice ? <p className="font-bold">{t("died.office", { name: leader.name })}</p> : null}
        <section>
          <h2 className="font-display text-3xl">{t("terms")}</h2>
          <ul className="mt-2 grid gap-2">
            {leader.terms.map((term) => (
              <li key={`${term.start}-${term.end ?? "now"}`} className="rounded-2xl bg-flag px-4 py-3 font-extrabold text-card">
                {term.start}–{term.end ?? t("still.office")}
              </li>
            ))}
          </ul>
        </section>
        <p className="text-lg">{t(`leader.${leader.slug}.f1`)}</p>
        <p className="text-lg">{t(`leader.${leader.slug}.f2`)}</p>
        <Link to="/leaders" className="font-extrabold underline">{t("nav.leaders")}</Link>
      </div>
    </article>
  );
}
