import { LEADERS } from "@/data/leaders";
import { NATIONS } from "@/data/nations";
import { PLACES, type Place } from "@/data/places";

export type Choice = { key?: string; literal?: string; vars?: Record<string, string> };

export type Question = {
  id: string;
  promptKey: string;
  promptVars?: Record<string, string>;
  choices: Choice[];
  answer: number;
  whyKey: string;
  whyVars?: Record<string, string>;
};

function hash(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return h >>> 0;
}

function shuffle<T>(items: T[], seed: string) {
  const next = [...items];
  let h = hash(seed);
  for (let i = next.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    const j = h % (i + 1);
    const a = next[i]!;
    next[i] = next[j]!;
    next[j] = a;
  }
  return next;
}

function others<T>(all: T[], correct: T, seed: string, same: (a: T, b: T) => boolean) {
  return shuffle(
    all.filter((item) => !same(item, correct)),
    seed,
  ).slice(0, 3);
}

function ask(
  id: string,
  promptKey: string,
  promptVars: Record<string, string> | undefined,
  correct: Choice,
  wrongs: Choice[],
  whyKey: string,
  whyVars?: Record<string, string>,
): Question {
  const mixed = shuffle(
    [{ ...correct, ok: true }, ...wrongs.map((item) => ({ ...item, ok: false }))],
    id,
  );
  return {
    id,
    promptKey,
    promptVars,
    choices: mixed.map(({ ok: _ok, ...choice }) => choice),
    answer: mixed.findIndex((choice) => choice.ok),
    whyKey,
    whyVars,
  };
}

const regionKey = {
  atlantic: "region.atlantic",
  central: "region.central",
  prairies: "region.prairies",
  west: "region.west",
  north: "region.north",
} as const;

function placeQuestions(place: Place, index: number): Question[] {
  const name = place.name;
  const vars = { place: name, capital: place.capital, year: String(place.year), famous: place.famous, region: "" };
  const capitals = PLACES.map((item) => item.capital);
  const years = [...new Set(PLACES.map((item) => String(item.year)))];
  const famous = PLACES.map((item) => item.famous);
  const besidePool = place.neighbours.length ? place.neighbours : place.water ?? [];
  const beside = besidePool[0] ? PLACES.find((item) => item.slug === besidePool[0]) : undefined;
  const notBeside = PLACES.filter(
    (item) => item.slug !== place.slug && !besidePool.includes(item.slug),
  ).map((item) => item.name);

  const list: Question[] = [
    ask(
      `${place.slug}-capital`,
      "q.capital",
      { place: name },
      { literal: place.capital },
      others(capitals, place.capital, place.slug + "cap", (a, b) => a === b).map((literal) => ({ literal })),
      "w.capital",
      { place: name, capital: place.capital },
    ),
    ask(
      `${place.slug}-year`,
      "q.year",
      { place: name },
      { literal: String(place.year) },
      others(years, String(place.year), place.slug + "year", (a, b) => a === b).map((literal) => ({ literal })),
      "w.year",
      { place: name, year: String(place.year) },
    ),
    ask(
      `${place.slug}-region`,
      "q.region",
      { place: name },
      { key: regionKey[place.region] },
      others(
        Object.values(regionKey),
        regionKey[place.region],
        place.slug + "reg",
        (a, b) => a === b,
      ).map((key) => ({ key })),
      "w.region",
      { place: name, region: `{${regionKey[place.region]}}` },
    ),
    ask(
      `${place.slug}-famous`,
      "q.famous",
      { place: name },
      { literal: place.famous },
      others(famous, place.famous, place.slug + "fam", (a, b) => a === b).map((literal) => ({ literal })),
      "w.famous",
      { famous: place.famous, place: name },
    ),
    ask(
      `${place.slug}-symbol`,
      "q.symbol",
      { place: name },
      { key: `place.${place.slug}.symbol` },
      others(
        PLACES.map((item) => `place.${item.slug}.symbol`),
        `place.${place.slug}.symbol`,
        place.slug + "sym",
        (a, b) => a === b,
      ).map((key) => ({ key })),
      `place.${place.slug}.symbol`,
    ),
  ];

  if (beside) {
    const water = place.neighbours.length === 0;
    list.push(
      ask(
        `${place.slug}-side`,
        water ? "q.water" : "q.beside",
        { place: name },
        { literal: beside.name },
        shuffle(notBeside, place.slug + "side")
          .slice(0, 3)
          .map((literal) => ({ literal })),
        water ? "w.water" : "w.beside",
        { other: beside.name, place: name },
      ),
    );
  }

  list.push(
    ask(
      `${place.slug}-kind`,
      "q.kind",
      { place: name },
      { key: place.kind === "province" ? "choice.province" : "choice.territory" },
      [
        { key: place.kind === "province" ? "choice.territory" : "choice.province" },
        { key: "choice.country" },
        { key: "choice.city" },
      ],
      place.kind === "province" ? "w.kind.province" : "w.kind.territory",
      { place: name },
    ),
  );

  void index;
  void vars;
  return list;
}

function nationQuestions(): Question[] {
  return NATIONS.flatMap((nation) => {
    const name = nation.name;
    return [
      ask(
        `${nation.slug}-used`,
        "q.used",
        { english: nation.english },
        { literal: name },
        others(
          NATIONS.map((item) => item.name),
          name,
          nation.slug + "used",
          (a, b) => a === b,
        ).map((literal) => ({ literal })),
        "w.used",
        { name },
      ),
      ask(
        `${nation.slug}-home`,
        "q.home",
        { name },
        { key: `nation.${nation.slug}.home` },
        others(
          NATIONS.map((item) => `nation.${item.slug}.home`),
          `nation.${nation.slug}.home`,
          nation.slug + "home",
          (a, b) => a === b,
        ).map((key) => ({ key })),
        `nation.${nation.slug}.home`,
      ),
      ask(
        `${nation.slug}-fact`,
        "q.remember",
        { name },
        { key: `nation.${nation.slug}.fact` },
        others(
          NATIONS.map((item) => `nation.${item.slug}.fact`),
          `nation.${nation.slug}.fact`,
          nation.slug + "fact",
          (a, b) => a === b,
        ).map((key) => ({ key })),
        `nation.${nation.slug}.fact`,
      ),
      ask(
        `${nation.slug}-today`,
        "q.today",
        { name },
        { key: "c.today" },
        [{ key: "c.city" }, { key: "c.pm" }, { key: "c.province" }],
        "w.today",
        { name },
      ),
    ];
  });
}

function leaderQuestions(): Question[] {
  const births = [...new Set(LEADERS.map((leader) => leader.born.slice(0, 4)))];
  const starts = [...new Set(LEADERS.map((leader) => String(leader.terms[0]!.start)))];
  const deathYears = ["1891", "1894", "1950", "1972", "2000", "2020", "2024"];
  return LEADERS.flatMap((leader) => {
    const name = leader.name;
    const born = leader.born.slice(0, 4);
    const start = String(leader.terms[0]!.start);
    const living = leader.died === null;
    const died = leader.died?.slice(0, 4) ?? "";
    const statusCorrect: Choice = living
      ? { key: "still.living" }
      : { key: "c.diedIn", vars: { year: died } };
    const statusWrong: Choice[] = living
      ? deathYears.slice(0, 3).map((year) => ({ key: "c.diedIn", vars: { year } }))
      : [
          { key: "still.living" },
          ...others(deathYears, died, leader.slug + "dy", (a, b) => a === b)
            .slice(0, 2)
            .map((year) => ({ key: "c.diedIn", vars: { year } })),
        ];
    return [
      ask(
        `${leader.slug}-born`,
        leader.woman ? "q.bornF" : "q.born",
        { name },
        { literal: born },
        others(births, born, leader.slug + "born", (a, b) => a === b).map((literal) => ({ literal })),
        leader.woman ? "w.bornF" : "w.born",
        { name, year: born },
      ),
      ask(
        `${leader.slug}-first`,
        leader.woman ? "q.firstF" : "q.first",
        { name },
        { literal: start },
        others(starts, start, leader.slug + "first", (a, b) => a === b).map((literal) => ({ literal })),
        leader.woman ? "w.firstF" : "w.first",
        { name, year: start },
      ),
      ask(
        `${leader.slug}-status`,
        "q.living",
        { name },
        statusCorrect,
        statusWrong,
        living ? "w.living" : leader.diedInOffice ? "w.diedOffice" : "w.died",
        { name, year: died },
      ),
    ];
  });
}

function literalAsk(
  id: string,
  promptKey: string,
  correct: string,
  wrongs: string[],
  whyKey: string,
): Question {
  return ask(
    id,
    promptKey,
    undefined,
    { literal: correct },
    wrongs.map((literal) => ({ literal })),
    whyKey,
  );
}

function generalQuestions(): Question[] {
  return [
    ask("g-provinces", "g.provinces", undefined, { literal: "10" }, [{ literal: "8" }, { literal: "12" }, { literal: "13" }], "g.provinces.why"),
    ask("g-territories", "g.territories", undefined, { literal: "3" }, [{ literal: "2" }, { literal: "5" }, { literal: "10" }], "g.territories.why"),
    ask("g-together", "g.together", undefined, { literal: "13" }, [{ literal: "10" }, { literal: "12" }, { literal: "15" }], "g.together.why"),
    literalAsk("g-capital", "g.capital", "Ottawa", ["Toronto", "Montreal", "Vancouver"], "g.capital.why"),
    literalAsk("g-ottawa-in", "g.ottawaIn", "Ontario", ["Quebec", "Alberta", "Nunavut"], "g.ottawaIn.why"),
    ask(
      "g-ottawa-not",
      "g.ottawaNot",
      undefined,
      { key: "g.ottawaNot.a" },
      [{ key: "g.ottawaNot.b" }, { key: "g.ottawaNot.c" }, { key: "g.ottawaNot.d" }],
      "g.ottawaNot.why",
    ),
    ask(
      "g-langs",
      "g.langs",
      undefined,
      { key: "g.langs.a" },
      [{ key: "g.langs.b" }, { key: "g.langs.c" }, { key: "g.langs.d" }],
      "g.langs.why",
    ),
    ask(
      "g-quebec",
      "g.quebec",
      undefined,
      { key: "c.french" },
      [{ key: "c.english" }, { key: "c.both" }, { literal: "Spanish" }],
      "g.quebec.why",
    ),
    literalAsk("g-nb", "g.nb", "New Brunswick", ["Quebec", "Ontario", "Alberta"], "g.nb.why"),
    literalAsk("g-first", "g.first", "John A. Macdonald", ["Wilfrid Laurier", "Kim Campbell", "Mark Carney"], "g.first.why"),
    literalAsk("g-woman", "g.woman", "Kim Campbell", ["Justin Trudeau", "Joe Clark", "Mark Carney"], "g.woman.why"),
    literalAsk("g-nunavut", "g.nunavut", "Nunavut", ["Yukon", "Ontario", "Alberta"], "g.nunavut.why"),
    ask("g-nl", "g.nl", undefined, { literal: "1949" }, [{ literal: "1867" }, { literal: "1905" }, { literal: "1999" }], "g.nl.why"),
    literalAsk("g-now", "g.now", "Mark Carney", ["Justin Trudeau", "Stephen Harper", "Kim Campbell"], "g.now.why"),
    ask(
      "g-not-one",
      "g.notOne",
      undefined,
      { key: "g.notOne.a" },
      [{ key: "g.notOne.b" }, { key: "g.notOne.c" }, { key: "g.notOne.d" }],
      "g.notOne.why",
    ),
    ask(
      "g-hundreds",
      "g.hundreds",
      undefined,
      { key: "g.hundreds.a" },
      [{ key: "g.hundreds.b" }, { key: "g.hundreds.c" }, { key: "g.hundreds.d" }],
      "g.hundreds.why",
    ),
    ask(
      "g-term",
      "g.term",
      undefined,
      { key: "g.term.a" },
      [{ key: "g.term.b" }, { key: "g.term.c" }, { key: "g.term.d" }],
      "g.term.why",
    ),
    literalAsk("g-1891", "g.died1891", "John A. Macdonald", ["John Thompson", "Wilfrid Laurier", "Joe Clark"], "g.died1891.why"),
    literalAsk("g-1894", "g.died1894", "John Thompson", ["John A. Macdonald", "Charles Tupper", "Kim Campbell"], "g.died1894.why"),
    ask("g-king", "g.king", undefined, { key: "c.three" }, [{ key: "c.one" }, { key: "c.two" }, { key: "c.ten" }], "g.king.why"),
    ask(
      "g-before",
      "g.before",
      undefined,
      { key: "g.before.a" },
      [{ key: "g.before.b" }, { key: "g.before.c" }, { key: "g.before.d" }],
      "g.before.why",
    ),
    literalAsk("g-campbell-from", "g.campbellFrom", "British Columbia", ["Quebec", "Ontario", "Nunavut"], "g.campbellFrom.why"),
    literalAsk("g-carney-born", "g.carneyBorn", "Northwest Territories", ["Yukon", "Ontario", "Quebec"], "g.carneyBorn.why"),
    literalAsk("g-father", "g.father", "Justin Trudeau", ["Pierre Trudeau", "Mark Carney", "Joe Clark"], "g.father.why"),
    literalAsk("g-bow", "g.bow", "Lester B. Pearson", "John Diefenbaker,Pierre Trudeau,Kim Campbell".split(","), "g.bow.why"),
    literalAsk("g-rose", "g.rose", "Pierre Trudeau", ["Justin Trudeau", "Lester B. Pearson", "Mark Carney"], "g.rose.why"),
  ];
}

function reverseCapitals(): Question[] {
  return PLACES.map((place) =>
    ask(
      `${place.slug}-reverse`,
      "q.reverse",
      { capital: place.capital },
      { literal: place.name },
      others(
        PLACES.map((item) => item.name),
        place.name,
        place.slug + "rev",
        (a, b) => a === b,
      ).map((literal) => ({ literal })),
      "w.reverse",
      { capital: place.capital, place: place.name },
    ),
  );
}

export const QUESTIONS: Question[] = [
  ...PLACES.flatMap((place, index) => placeQuestions(place, index)),
  ...nationQuestions(),
  ...leaderQuestions(),
  ...reverseCapitals(),
  ...generalQuestions(),
].slice(0, 250);

export function drawQuestions(count: number, seed: string, avoid: string[] = []) {
  const pool = QUESTIONS.filter((question) => !avoid.includes(question.id));
  const picked = shuffle(pool.length ? pool : QUESTIONS, seed).slice(0, count);
  return picked;
}
