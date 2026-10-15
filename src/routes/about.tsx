import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "@/components/shell";
import { useT } from "@/i18n/text";

export const Route = createFileRoute("/about")({ component: AboutPage });

const KEYS = ["about.1", "about.2", "about.3", "about.4", "about.5", "about.6", "about.7"] as const;

function AboutPage() {
  const { t } = useT();
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <Leaf className="h-14 w-14" />
        <h1 className="font-display text-5xl">{t("nav.about")}</h1>
      </div>
      <div className="grid gap-3">
        {KEYS.map((key, index) => (
          <p
            key={key}
            className={`rounded-3xl border-4 p-5 font-display text-3xl ${index % 2 === 0 ? "border-ink bg-card" : "border-flag bg-paper"}`}
          >
            {t(key)}
          </p>
        ))}
      </div>
    </div>
  );
}
