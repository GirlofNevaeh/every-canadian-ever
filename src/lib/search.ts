import { LEADERS } from "@/data/leaders";
import { NATIONS } from "@/data/nations";
import { PLACES } from "@/data/places";

export type Hit = {
  kind: "place" | "nation" | "leader";
  slug: string;
  label: string;
  score: number;
};

function norm(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function scoreOf(query: string, fields: string[]) {
  let best = 0;
  for (const field of fields.map(norm)) {
    if (!field) continue;
    if (field === query) best = Math.max(best, 100);
    else if (field.startsWith(query)) best = Math.max(best, 80);
    else if (field.includes(query)) best = Math.max(best, 60);
  }
  return best;
}

export function searchAll(raw: string): Hit[] {
  const query = norm(raw);
  if (query.length < 2) return [];
  const hits: Hit[] = [];
  for (const place of PLACES) {
    const score = scoreOf(query, [place.name, place.capital, ...place.aliases]);
    if (score) hits.push({ kind: "place", slug: place.slug, label: place.name, score });
  }
  for (const nation of NATIONS) {
    const score = scoreOf(query, [nation.name, nation.english, ...nation.aliases]);
    if (score) hits.push({ kind: "nation", slug: nation.slug, label: nation.name, score });
  }
  for (const leader of LEADERS) {
    const score = scoreOf(query, [leader.name, leader.slug.replaceAll("-", " "), ...leader.aliases]);
    if (score) hits.push({ kind: "leader", slug: leader.slug, label: leader.name, score });
  }
  hits.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  const top = hits[0]?.score ?? 0;
  return hits.filter((hit) => hit.score === top || hit.score >= 80).slice(0, 8);
}
