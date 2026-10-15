import { useLang, americanize, fill, type LangId, type TextLang } from "@/i18n/lang";
import { EN_UI } from "@/i18n/en-ui";
import { EN_FACTS } from "@/i18n/en-facts";
import { EN_QUIZ } from "@/i18n/en-quiz";
import { EN_PROJECTS } from "@/i18n/en-projects";
import type { Choice } from "@/data/quiz";
import fr from "./packs/fr.json";
import es from "./packs/es.json";
import de from "./packs/de.json";
import it from "./packs/it.json";
import ru from "./packs/ru.json";
import ga from "./packs/ga.json";
import gd from "./packs/gd.json";
import cy from "./packs/cy.json";

export const EN: Record<string, string> = {
  ...EN_UI,
  ...EN_FACTS,
  ...EN_QUIZ,
  ...EN_PROJECTS,
};

const PACKS = {
  fr,
  es,
  de,
  it,
  ru,
  ga,
  gd,
  cy,
} as Partial<Record<TextLang, Record<string, string>>>;

export function translate(lang: LangId, key: string, vars?: Record<string, string | number>) {
  const english = EN[key] ?? key;
  const raw = lang === "en" || lang === "en-US" ? english : PACKS[lang]?.[key] || english;
  const spelled = lang === "en-US" ? americanize(raw) : raw;
  if (!vars) return spelled;
  const ready: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(vars)) {
    const text = String(value);
    ready[name] =
      text.startsWith("{") && text.endsWith("}") ? translate(lang, text.slice(1, -1)) : text;
  }
  return fill(spelled, ready);
}

export function useT() {
  const { lang } = useLang();
  const t = (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars);
  const choice = (item: Choice) => (item.literal ? item.literal : t(item.key ?? "", item.vars));
  return { t, choice, lang };
}

export function formatDate(iso: string, t: (key: string) => string, american: boolean) {
  const [year, month, day] = iso.split("-");
  const monthName = t(`month.${Number(month)}`);
  const d = String(Number(day));
  if (american) return `${monthName} ${d}, ${year}`;
  return `${d} ${monthName} ${year}`;
}
