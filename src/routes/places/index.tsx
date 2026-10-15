import { createFileRoute, Link } from "@tanstack/react-router";
import { CanadaMap } from "@/components/maps";
import { PLACES } from "@/data/places";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/places/")({ component: PlacesPage });

function PlacesPage() {
  const { t } = useT();
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-5xl">{t("nav.places")}</h1>
        <p className="mt-2 max-w-xl text-lg font-bold">{t("door.places")}</p>
      </header>
      <div className="rounded-3xl border-4 border-ink bg-card p-3">
        <p className="px-2 font-extrabold">{t("map.hint")}</p>
        <CanadaMap insetLabel={t("inset.north")} labelFor={(slug) => PLACES.find((place) => place.slug === slug)?.name ?? slug} />
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {PLACES.map((place) => (
          <li key={place.slug}>
            <Link to="/places/$slug" params={{ slug: place.slug }} className="flex items-baseline justify-between gap-3 rounded-2xl border-2 border-ink bg-card px-4 py-3">
              <span className="font-extrabold">{place.name}</span>
              <span className="text-sm font-bold">{place.capital}</span>
            </Link>
          </li>
        ))}
      </ul>
      <aside className="stamp-red rounded-3xl border-4 border-flag bg-card p-5">
        <h2 className="font-display text-3xl">{t("ottawa.title")}</h2>
        <p className="mt-2 text-lg font-bold">{t("ottawa.body")}</p>
      </aside>
    </div>
  );
}
