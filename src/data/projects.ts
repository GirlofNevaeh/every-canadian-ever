export type ProjectMode = "solo" | "team";
export type AgeId = "5-6" | "6-7" | "7-8" | "8-9" | "9-10" | "10-11" | "11-12";

export type Project = {
  id: string;
  age: AgeId;
  mode: ProjectMode;
};

const AGES: AgeId[] = ["5-6", "6-7", "7-8", "8-9", "9-10", "10-11", "11-12"];

export const PROJECTS: Project[] = AGES.flatMap((age, ageIndex) =>
  Array.from({ length: 9 }, (_, i) => {
    const n = ageIndex * 9 + i + 1;
    const id = `p${String(n).padStart(2, "0")}`;
    const mode: ProjectMode = i % 2 === 1 ? "team" : "solo";
    return { id, age, mode };
  }),
);

export const AGE_IDS = AGES;
