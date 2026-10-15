import { createFileRoute, Link } from "@tanstack/react-router";
import { nationBySlug } from "@/data/nations";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/nations/$slug")({ component: NationPage });

function NationPage() {
  const { slug } = Route.useParams();
  const nation = nationBySlug(slug);
  const { t } = useT();
  if (!nation) {
    return (
      <div>
        <h1 className="font-display text-4xl">{t("notFound.title")}</h1>
        <Link to="/nations" className="mt-4 inline-block font-extrabold underline">{t("nav.nations")}</Link>
      </div>
    );
  }
  const personKey = `nation.${nation.slug}.person`;
  const person = t(personKey);
  return (
    <article className="grid gap-5">
      <header className="rounded-[2rem] border-4 border-ink bg-card p-6">
        <p className="text-sm font-extrabold">{t("name.used")}</p>
        <h1 className="font-display text-5xl">{nation.name}</h1>
        <p className="mt-4 text-lg font-bold">{t(`nation.${nation.slug}.englishLine`)}</p>
      </header>
      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-3xl border-4 border-ink bg-card p-5">
          <h2 className="text-sm font-extrabold">{t("homelands")}</h2>
          <p className="mt-2 text-lg">{t(`nation.${nation.slug}.home`)}</p>
        </div>
        <div className="rounded-3xl border-4 border-flag bg-card p-5">
          <h2 className="text-sm font-extrabold">{t("remember")}</h2>
          <p className="mt-2 font-display text-3xl">{t(`nation.${nation.slug}.fact`)}</p>
        </div>
      </section>
      <p className="text-xl font-bold">{t(`nation.${nation.slug}.now`)}</p>
      {person !== personKey ? <p className="rounded-2xl border-2 border-ink bg-card p-4 text-lg">{person}</p> : null}
      <Link to="/nations" className="font-extrabold underline">{t("nav.nations")}</Link>
    </article>
  );
}
