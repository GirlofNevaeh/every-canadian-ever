import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Mountie, SearchForm } from "@/components/shell";
import { MiniOutline } from "@/components/maps";
import { LeaderPortrait } from "@/components/portrait";
import { LEADERS } from "@/data/leaders";
import { PLACES } from "@/data/places";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/")({ component: Home });

const DOORS = [
  { to: "/places", key: "nav.places", body: "door.places" },
  { to: "/nations", key: "nav.nations", body: "door.nations" },
  { to: "/leaders", key: "nav.leaders", body: "door.leaders" },
] as const;

function Home() {
  const { t } = useT();
  const navigate = useNavigate();
  const strip = ["british-columbia", "ontario", "quebec", "nunavut", "nova-scotia", "yukon"];
  const faces = ["john-a-macdonald", "wilfrid-laurier", "kim-campbell", "mark-carney"]
    .map((slug) => LEADERS.find((leader) => leader.slug === slug)!)
    .filter(Boolean);

  function surprise() {
    const pool = [
      ...PLACES.map((place) => ({ to: "/places/$slug" as const, slug: place.slug })),
      ...LEADERS.map((leader) => ({ to: "/leaders/$slug" as const, slug: leader.slug })),
    ];
    const pick = pool[Math.floor(Math.random() * pool.length)]!;
    void navigate({ to: pick.to, params: { slug: pick.slug } });
  }

  return (
    <div className="grid gap-8">
      <section className="overflow-hidden rounded-3xl border-4 border-ink">
        <div className="bg-flag px-6 py-8 text-card">
          <p className="text-sm font-extrabold tracking-wide">{t("ages")}</p>
          <h1 className="mt-2 font-display text-5xl font-bold sm:text-6xl">Every Canadian Ever</h1>
        </div>
        <div className="grid items-center gap-4 bg-card px-6 py-6 md:grid-cols-[1fr_16rem]">
          <div className="grid gap-4">
            <Leaf className="h-16 w-16" />
            <p className="max-w-xl text-xl font-bold">{t("welcome")}</p>
            <SearchForm big />
            <button type="button" onClick={surprise} className="w-full rounded-2xl bg-flag px-4 py-4 text-lg font-extrabold text-card sm:w-auto">
              {t("surprise")}
            </button>
          </div>
          <Mountie className="mx-auto h-44 w-full max-w-xs md:h-52" />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {DOORS.map((door) => (
          <Link key={door.to} to={door.to} className="stamp flex min-h-40 flex-col justify-between rounded-3xl border-4 border-ink bg-card p-5">
            <h2 className="font-display text-4xl">{t(door.key)}</h2>
            <p className="font-bold">{t(door.body)}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="font-display text-3xl">{t("home.places")}</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {strip.map((slug) => {
            const place = PLACES.find((item) => item.slug === slug)!;
            return (
              <li key={slug}>
                <Link to="/places/$slug" params={{ slug }} className="block rounded-2xl border-2 border-ink bg-card p-3">
                  <MiniOutline slug={slug} />
                  <span className="mt-1 block text-center text-sm font-extrabold">{place.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-3xl">{t("home.leaders")}</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {faces.map((leader) => (
            <li key={leader.slug}>
              <Link to="/leaders/$slug" params={{ slug: leader.slug }} className="block rounded-2xl border-2 border-ink bg-card p-2">
                <div className="mx-auto h-36 w-28">
                  <LeaderPortrait look={leader.look} label={leader.name} />
                </div>
                <span className="block text-center text-sm font-extrabold">{leader.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border-4 border-flag bg-card p-6">
        <p className="font-display text-3xl">{t("home.fact")}</p>
      </section>
    </div>
  );
}
