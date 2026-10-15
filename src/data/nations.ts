export type Nation = {
  slug: string;
  name: string;
  english: string;
  aliases: string[];
};

export const NATIONS: Nation[] = [
  {
    slug: "haudenosaunee",
    name: "Haudenosaunee",
    english: "Haudenosaunee",
    aliases: ["six nations", "haudenosaunee"],
  },
  {
    slug: "anishinaabe",
    name: "Anishinaabe",
    english: "Anishinaabe",
    aliases: ["ojibwe", "anishinaabeg"],
  },
  {
    slug: "cree",
    name: "nêhiyawak",
    english: "Cree",
    aliases: ["cree", "nehiyaw", "eeyou"],
  },
  {
    slug: "mikmaq",
    name: "Mi'kmaq",
    english: "Mi'kmaq",
    aliases: ["mikmaq", "mi'kmaq", "lnu"],
  },
  {
    slug: "siksika",
    name: "Siksika",
    english: "Siksika",
    aliases: ["blackfoot", "niitsitapi"],
  },
  {
    slug: "haida",
    name: "Haida",
    english: "Haida",
    aliases: ["xaayda", "haida gwaii"],
  },
  {
    slug: "dene",
    name: "Dene",
    english: "Dene",
    aliases: ["dene"],
  },
  {
    slug: "inuit",
    name: "Inuit",
    english: "Inuit",
    aliases: ["inuk", "inuktut"],
  },
  {
    slug: "metis",
    name: "Métis",
    english: "Métis",
    aliases: ["metis"],
  },
  {
    slug: "kwakwakawakw",
    name: "Kwakwaka'wakw",
    english: "Kwakwaka'wakw",
    aliases: ["kwakwaka'wakw", "kwakiutl"],
  },
  {
    slug: "nisgaa",
    name: "Nisga'a",
    english: "Nisga'a",
    aliases: ["nisga'a", "nisgaa"],
  },
  {
    slug: "innu",
    name: "Innu",
    english: "Innu",
    aliases: ["innu", "nitassinan"],
  },
];

export function nationBySlug(slug: string) {
  return NATIONS.find((nation) => nation.slug === slug);
}
