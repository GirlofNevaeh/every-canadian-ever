import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const LANGS = [
  { id: "en", label: "English", html: "en-GB" },
  { id: "en-US", label: "American English", html: "en-US" },
  { id: "gd", label: "Gàidhlig", html: "gd" },
  { id: "cy", label: "Cymraeg", html: "cy" },
  { id: "ga", label: "Gaeilge", html: "ga" },
  { id: "fr", label: "Français", html: "fr" },
  { id: "it", label: "Italiano", html: "it" },
  { id: "es", label: "Español", html: "es" },
  { id: "de", label: "Deutsch", html: "de" },
  { id: "ru", label: "Русский", html: "ru" },
] as const;

export type LangId = (typeof LANGS)[number]["id"];
export type TextLang = Exclude<LangId, "en-US">;

const STORAGE_KEY = "ece-lang";

const STEM: [RegExp, string][] = [
  [/favourites/gi, "favorites"],
  [/favourite/gi, "favorite"],
  [/honourable/gi, "honorable"],
  [/honours/gi, "honors"],
  [/honour/gi, "honor"],
  [/colours/gi, "colors"],
  [/colourful/gi, "colorful"],
  [/colour/gi, "color"],
  [/neighbours/gi, "neighbors"],
  [/neighbour/gi, "neighbor"],
  [/centimetres/gi, "centimeters"],
  [/centimetre/gi, "centimeter"],
  [/metres/gi, "meters"],
  [/metre/gi, "meter"],
  [/theatres/gi, "theaters"],
  [/theatre/gi, "theater"],
  [/labelling/gi, "labeling"],
  [/labelled/gi, "labeled"],
  [/greys/gi, "grays"],
  [/grey/gi, "gray"],
  [/maths/gi, "math"],
  [/practising/gi, "practicing"],
  [/practised/gi, "practiced"],
  [/practise/gi, "practice"],
  [/centres/gi, "centers"],
  [/centre/gi, "center"],
];

function matchCase(sample: string, next: string) {
  if (sample === sample.toUpperCase()) return next.toUpperCase();
  if (sample[0] === sample[0]?.toUpperCase()) return next[0]!.toUpperCase() + next.slice(1);
  return next;
}

export function americanize(input: string) {
  let text = input;
  for (const [re, to] of STEM) {
    text = text.replace(re, (found) => matchCase(found, to.length === found.length ? to : to));
  }
  return text;
}

export type Row = { en: string } & Partial<Record<TextLang, string>>;

export function pick(lang: LangId, row: Row | undefined, fallback = "") {
  if (!row) return fallback;
  if (lang === "en-US") return americanize(row.en);
  if (lang === "en") return row.en;
  return row[lang] || row.en;
}

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? "" : String(vars[key]),
  );
}

type LangContextValue = {
  lang: LangId;
  setLang: (lang: LangId) => void;
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangId>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGS.some((item) => item.id === saved)) setLangState(saved as LangId);
  }, []);

  useEffect(() => {
    const html = LANGS.find((item) => item.id === lang)?.html ?? "en-GB";
    document.documentElement.lang = html;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: (next: LangId) => {
        setLangState(next);
        localStorage.setItem(STORAGE_KEY, next);
      },
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
