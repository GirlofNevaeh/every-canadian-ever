export type PlaceKind = "province" | "territory";
export type RegionId = "atlantic" | "central" | "prairies" | "west" | "north";

export type Place = {
  slug: string;
  name: string;
  capital: string;
  year: number;
  kind: PlaceKind;
  region: RegionId;
  neighbours: string[];
  water?: string[];
  famous: string;
  aliases: string[];
};

export const PLACES: Place[] = [
  {
    slug: "alberta",
    name: "Alberta",
    capital: "Edmonton",
    year: 1905,
    kind: "province",
    region: "prairies",
    neighbours: ["british-columbia", "saskatchewan", "northwest-territories"],
    famous: "Banff",
    aliases: ["ab"],
  },
  {
    slug: "british-columbia",
    name: "British Columbia",
    capital: "Victoria",
    year: 1871,
    kind: "province",
    region: "west",
    neighbours: ["yukon", "northwest-territories", "alberta"],
    famous: "Stanley Park",
    aliases: ["bc", "b.c."],
  },
  {
    slug: "manitoba",
    name: "Manitoba",
    capital: "Winnipeg",
    year: 1870,
    kind: "province",
    region: "prairies",
    neighbours: ["saskatchewan", "ontario", "nunavut"],
    famous: "Churchill",
    aliases: ["mb"],
  },
  {
    slug: "new-brunswick",
    name: "New Brunswick",
    capital: "Fredericton",
    year: 1867,
    kind: "province",
    region: "atlantic",
    neighbours: ["quebec", "nova-scotia"],
    famous: "Bay of Fundy",
    aliases: ["nb"],
  },
  {
    slug: "newfoundland-and-labrador",
    name: "Newfoundland and Labrador",
    capital: "St. John's",
    year: 1949,
    kind: "province",
    region: "atlantic",
    neighbours: ["quebec"],
    famous: "Signal Hill",
    aliases: ["newfoundland", "labrador", "nl"],
  },
  {
    slug: "nova-scotia",
    name: "Nova Scotia",
    capital: "Halifax",
    year: 1867,
    kind: "province",
    region: "atlantic",
    neighbours: ["new-brunswick"],
    famous: "Peggy's Cove",
    aliases: ["ns"],
  },
  {
    slug: "ontario",
    name: "Ontario",
    capital: "Toronto",
    year: 1867,
    kind: "province",
    region: "central",
    neighbours: ["manitoba", "quebec"],
    famous: "Niagara Falls",
    aliases: ["on"],
  },
  {
    slug: "prince-edward-island",
    name: "Prince Edward Island",
    capital: "Charlottetown",
    year: 1873,
    kind: "province",
    region: "atlantic",
    neighbours: [],
    water: ["new-brunswick", "nova-scotia"],
    famous: "Cavendish",
    aliases: ["pei", "p.e.i.", "prince edward"],
  },
  {
    slug: "quebec",
    name: "Quebec",
    capital: "Quebec City",
    year: 1867,
    kind: "province",
    region: "central",
    neighbours: ["ontario", "new-brunswick", "newfoundland-and-labrador"],
    famous: "Quebec City",
    aliases: ["qc", "québec"],
  },
  {
    slug: "saskatchewan",
    name: "Saskatchewan",
    capital: "Regina",
    year: 1905,
    kind: "province",
    region: "prairies",
    neighbours: ["alberta", "manitoba", "northwest-territories"],
    famous: "Cypress Hills",
    aliases: ["sk", "sask"],
  },
  {
    slug: "northwest-territories",
    name: "Northwest Territories",
    capital: "Yellowknife",
    year: 1870,
    kind: "territory",
    region: "north",
    neighbours: ["yukon", "british-columbia", "alberta", "saskatchewan", "nunavut"],
    famous: "Great Slave Lake",
    aliases: ["nwt", "northwest territory"],
  },
  {
    slug: "nunavut",
    name: "Nunavut",
    capital: "Iqaluit",
    year: 1999,
    kind: "territory",
    region: "north",
    neighbours: ["northwest-territories", "manitoba"],
    famous: "Iqaluit",
    aliases: ["nu"],
  },
  {
    slug: "yukon",
    name: "Yukon",
    capital: "Whitehorse",
    year: 1898,
    kind: "territory",
    region: "north",
    neighbours: ["northwest-territories", "british-columbia"],
    famous: "Kluane",
    aliases: ["yt"],
  },
];

export function placeBySlug(slug: string) {
  return PLACES.find((place) => place.slug === slug);
}
