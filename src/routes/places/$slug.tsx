import { createFileRoute, Link } from "@tanstack/react-router";
import { CanadaMap, PlaceOutline } from "@/components/maps";
import { placeBySlug, PLACES } from "@/data/places";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/places/$slug")({ component: PlacePage });

function PlacePage() {
  const { slug } = Route.useParams();
  const place = placeBySlug(slug);
  const { t } = useT();
  if (!place) {
    return (
      <div>
        <h1 className="font-display text-4xl">{t("notFound.title")}</h1>
        <Link to="/" className="mt-4 inline-block font-extrabold underline">{t("notFound.home")}</Link>
      </div>
    );
  }
  const neighbours = place.neighbours.map((id) => PLACES.find((item) => item.slug === id)!).filter(Boolean);
  const water = (place.water ?? []).map((id) => PLACES.find((item) => item.slug === id)!).filter(Boolean);
  const facts = [
    ["fact.land", `place.${place.slug}.weather`],
    ["fact.place", `place.${place.slug}.famous`],
    ["fact.symbol", `place.${place.slug}.symbol`],
    ["fact.peoples", `place.${place.slug}.peoples`],
  ] as const;
  return (
    <article className="grid gap-6">
      <header className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div>
          <p className="font-extrabold text-flag">{t(place.kind === "province" ? "kind.province" : "kind.territory")}</p>
          <h1 className="font-display text-5xl">{place.name}</h1>
          <p className="mt-3 max-w-xl text-lg font-bold">
            {t(place.kind === "province" ? "part.province" : "part.territory", { name: place.name })}
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2">
          {[
            [t("capital"), place.capital],
            [t("joined"), String(place.year)],
            [t("region"), t(`region.${place.region}`)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-flag px-2 py-3 text-center text-card">
              <dt className="text-xs font-extrabold">{label}</dt>
              <dd className="font-display text-lg leading-tight">{value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr]">
        <div className="min-h-64 rounded-3xl border-4 border-ink bg-card p-4">
          <PlaceOutline slug={place.slug} caption={place.name} />
        </div>
        <div className="rounded-3xl border-4 border-ink bg-card p-3">
          <p className="px-1 text-sm font-extrabold">{t("where.country")}</p>
          <CanadaMap
            active={place.slug}
            insetLabel={t("inset.north")}
            labelFor={(id) => PLACES.find((item) => item.slug === id)?.name ?? id}
          />
        </div>
      </div>
      <section className="grid gap-3 sm:grid-cols-2">
        {facts.map(([label, key]) => (
          <div key={key} className="rounded-3xl border-2 border-ink bg-card p-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wide">{t(label)}</h2>
            <p className="mt-2 text-lg">{t(key)}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="font-display text-3xl">{t("neighbours")}</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {neighbours.map((item) => (
            <li key={item.slug}>
              <Link to="/places/$slug" params={{ slug: item.slug }} className="inline-flex min-h-11 items-center rounded-full border-2 border-ink bg-card px-4 font-extrabold">
                {item.name}
              </Link>
            </li>
          ))}
          {neighbours.length === 0 && water.length === 0 ? <li className="font-bold">{t("across.water")}</li> : null}
        </ul>
        {water.length ? (
          <p className="mt-3 font-bold">
            {t("across.water")}
            {t("across.colon")}
            {water.map((item, index) => (
              <span key={item.slug}>
                {index ? ", " : ""}
                <Link to="/places/$slug" params={{ slug: item.slug }} className="underline">{item.name}</Link>
              </span>
            ))}
          </p>
        ) : null}
      </section>
    </article>
  );
}
