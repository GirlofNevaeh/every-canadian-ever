import type { LeaderLook } from "@/components/portrait";

export type Term = { start: number; end: number | null };

export type Leader = {
  slug: string;
  name: string;
  born: string;
  died: string | null;
  diedInOffice?: boolean;
  woman?: boolean;
  terms: Term[];
  look: LeaderLook;
  aliases: string[];
};

export const LEADERS: Leader[] = [
  {
    slug: "john-a-macdonald",
    name: "John A. Macdonald",
    born: "1815-01-11",
    died: "1891-06-06",
    diedInOffice: true,
    terms: [
      { start: 1867, end: 1873 },
      { start: 1878, end: 1891 },
    ],
    look: { skin: "light", hair: "dark", style: "wavy", face: "oval", older: true },
    aliases: ["macdonald", "john a", "sir john"],
  },
  {
    slug: "alexander-mackenzie",
    name: "Alexander Mackenzie",
    born: "1822-01-28",
    died: "1892-04-17",
    terms: [{ start: 1873, end: 1878 }],
    look: { skin: "light", hair: "grey", style: "wavy", face: "round", facial: "beard", older: true },
    aliases: ["mackenzie"],
  },
  {
    slug: "john-abbott",
    name: "John Abbott",
    born: "1821-03-12",
    died: "1893-10-30",
    terms: [{ start: 1891, end: 1892 }],
    look: { skin: "rosy", hair: "white", style: "balding", face: "round", facial: "beard", older: true },
    aliases: ["abbott"],
  },
  {
    slug: "john-thompson",
    name: "John Thompson",
    born: "1845-11-10",
    died: "1894-12-12",
    diedInOffice: true,
    terms: [{ start: 1892, end: 1894 }],
    look: { skin: "light", hair: "dark", style: "wavy", face: "oval", facial: "beard" },
    aliases: ["thompson", "john sparrow"],
  },
  {
    slug: "mackenzie-bowell",
    name: "Mackenzie Bowell",
    born: "1823-12-27",
    died: "1917-12-10",
    terms: [{ start: 1894, end: 1896 }],
    look: { skin: "fair", hair: "white", style: "wavy", face: "long", facial: "beard-full", older: true },
    aliases: ["bowell"],
  },
  {
    slug: "charles-tupper",
    name: "Charles Tupper",
    born: "1821-07-02",
    died: "1915-10-30",
    terms: [{ start: 1896, end: 1896 }],
    look: { skin: "rosy", hair: "white", style: "balding", face: "square", facial: "sideburns", older: true },
    aliases: ["tupper"],
  },
  {
    slug: "wilfrid-laurier",
    name: "Wilfrid Laurier",
    born: "1841-11-20",
    died: "1919-02-17",
    terms: [{ start: 1896, end: 1911 }],
    look: { skin: "fair", hair: "silver", style: "silver-waves", face: "long", older: true },
    aliases: ["laurier", "wilfred"],
  },
  {
    slug: "robert-borden",
    name: "Robert Borden",
    born: "1854-06-26",
    died: "1937-06-10",
    terms: [{ start: 1911, end: 1920 }],
    look: { skin: "light", hair: "grey", style: "side", face: "square", facial: "mustache", older: true },
    aliases: ["borden"],
  },
  {
    slug: "arthur-meighen",
    name: "Arthur Meighen",
    born: "1874-06-16",
    died: "1960-08-05",
    terms: [
      { start: 1920, end: 1921 },
      { start: 1926, end: 1926 },
    ],
    look: { skin: "light", hair: "dark", style: "receding", face: "long" },
    aliases: ["meighen"],
  },
  {
    slug: "william-lyon-mackenzie-king",
    name: "William Lyon Mackenzie King",
    born: "1874-12-17",
    died: "1950-07-22",
    terms: [
      { start: 1921, end: 1926 },
      { start: 1926, end: 1930 },
      { start: 1935, end: 1948 },
    ],
    look: { skin: "fair", hair: "grey", style: "combover", face: "round", older: true },
    aliases: ["mackenzie king", "king", "wlm king"],
  },
  {
    slug: "rb-bennett",
    name: "R. B. Bennett",
    born: "1870-07-03",
    died: "1947-06-26",
    terms: [{ start: 1930, end: 1935 }],
    look: { skin: "light", hair: "dark", style: "slick", face: "round" },
    aliases: ["bennett", "r.b. bennett", "richard bennett"],
  },
  {
    slug: "louis-st-laurent",
    name: "Louis St. Laurent",
    born: "1882-02-01",
    died: "1973-07-25",
    terms: [{ start: 1948, end: 1957 }],
    look: { skin: "fair", hair: "white", style: "short", face: "oval", facial: "mustache-small", older: true },
    aliases: ["st laurent", "st. laurent", "saint laurent"],
  },
  {
    slug: "john-diefenbaker",
    name: "John Diefenbaker",
    born: "1895-09-18",
    died: "1979-08-16",
    terms: [{ start: 1957, end: 1963 }],
    look: { skin: "fair", hair: "white", style: "thick", face: "long", older: true },
    aliases: ["diefenbaker", "dief"],
  },
  {
    slug: "lester-b-pearson",
    name: "Lester B. Pearson",
    born: "1897-04-23",
    died: "1972-12-27",
    terms: [{ start: 1963, end: 1968 }],
    look: { skin: "fair", hair: "grey", style: "balding", face: "round", bowtie: true, older: true },
    aliases: ["pearson", "lester pearson"],
  },
  {
    slug: "pierre-trudeau",
    name: "Pierre Trudeau",
    born: "1919-10-18",
    died: "2000-09-28",
    terms: [
      { start: 1968, end: 1979 },
      { start: 1980, end: 1984 },
    ],
    look: { skin: "light", hair: "dark", style: "side", face: "oval", rose: true },
    aliases: ["pierre", "pierre elliott"],
  },
  {
    slug: "joe-clark",
    name: "Joe Clark",
    born: "1939-06-05",
    died: null,
    terms: [{ start: 1979, end: 1980 }],
    look: { skin: "light", hair: "sandy", style: "wavy", face: "long" },
    aliases: ["clark", "joseph clark"],
  },
  {
    slug: "john-turner",
    name: "John Turner",
    born: "1929-06-07",
    died: "2020-09-19",
    terms: [{ start: 1984, end: 1984 }],
    look: { skin: "light", hair: "salt", style: "wavy", face: "square" },
    aliases: ["turner"],
  },
  {
    slug: "brian-mulroney",
    name: "Brian Mulroney",
    born: "1939-03-20",
    died: "2024-02-29",
    terms: [{ start: 1984, end: 1993 }],
    look: { skin: "light", hair: "dark", style: "thick", face: "square" },
    aliases: ["mulroney"],
  },
  {
    slug: "kim-campbell",
    name: "Kim Campbell",
    born: "1947-03-10",
    died: null,
    woman: true,
    terms: [{ start: 1993, end: 1993 }],
    look: { skin: "fair", hair: "blonde", style: "bob", face: "oval", woman: true },
    aliases: ["campbell", "kim"],
  },
  {
    slug: "jean-chretien",
    name: "Jean Chrétien",
    born: "1934-01-11",
    died: null,
    terms: [{ start: 1993, end: 2003 }],
    look: { skin: "light", hair: "grey", style: "wavy", face: "oval" },
    aliases: ["chretien", "chrétien", "jean chretien"],
  },
  {
    slug: "paul-martin",
    name: "Paul Martin",
    born: "1938-08-28",
    died: null,
    terms: [{ start: 2003, end: 2006 }],
    look: { skin: "fair", hair: "grey", style: "short", face: "oval", glasses: true },
    aliases: ["martin", "paul martin"],
  },
  {
    slug: "stephen-harper",
    name: "Stephen Harper",
    born: "1959-04-30",
    died: null,
    terms: [{ start: 2006, end: 2015 }],
    look: { skin: "light", hair: "salt", style: "short", face: "square" },
    aliases: ["harper"],
  },
  {
    slug: "justin-trudeau",
    name: "Justin Trudeau",
    born: "1971-12-25",
    died: null,
    terms: [{ start: 2015, end: 2025 }],
    look: { skin: "light", hair: "brown", style: "curly", face: "oval" },
    aliases: ["justin"],
  },
  {
    slug: "mark-carney",
    name: "Mark Carney",
    born: "1965-03-16",
    died: null,
    terms: [{ start: 2025, end: null }],
    look: { skin: "fair", hair: "silver", style: "short", face: "oval" },
    aliases: ["carney"],
  },
];

export function leaderBySlug(slug: string) {
  return LEADERS.find((leader) => leader.slug === slug);
}
