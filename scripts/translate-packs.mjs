import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const en = JSON.parse(readFileSync(new URL("../src/i18n/en.json", import.meta.url), "utf8"));
const keys = Object.keys(en);
const LANGS = [
  ["fr", "French"],
  ["es", "Spanish"],
  ["de", "German"],
  ["it", "Italian"],
  ["ru", "Russian"],
  ["ga", "Irish (Gaeilge)"],
  ["gd", "Scottish Gaelic (Gàidhlig)"],
  ["cy", "Welsh (Cymraeg)"],
];

const system = `You translate a children's website (ages 5 to 12) about Canada.
Return ONLY a JSON object with the same keys as the input.
Rules:
- Keep every placeholder exactly: {place} {name} {year} {capital} {famous} {region} {other} {n} {score} {total} {range}
- Do NOT translate proper names of people, places, provinces, territories, capitals, or Indigenous nations. Keep them exactly as written (Alberta, Ottawa, Quebec City, Nunavut, John A. Macdonald, Kim Campbell, Mark Carney, Haudenosaunee, Mi'kmaq, Métis, Inuit, Niagara Falls, and any other name).
- Short sentences a seven-year-old can understand.
- Kim Campbell is a woman. Use feminine grammar when the English is about her.
- No emojis. Do not add facts. Do not describe violence.
- Nav labels and the SEARCH button must stay short.
- Russian month names, if translating month keys, must be genitive.
- If you cannot translate a string, still include the key with your best short translation. Never omit a key.`;

function chunks(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

async function callModel(langName, slice) {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Translate every value into ${langName}. JSON input:\n${JSON.stringify(slice)}`,
        },
      ],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text.slice(0, 400)}`);
  }
  const body = await res.json();
  const content = body.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(content);
  return parsed;
}

mkdirSync(new URL("../src/i18n/packs", import.meta.url), { recursive: true });

const size = 145;
const parts = chunks(keys, size);

async function oneLang([code, name]) {
  const outPath = new URL(`../src/i18n/packs/${code}.json`, import.meta.url);
  let pack = {};
  if (existsSync(outPath)) {
    try {
      pack = JSON.parse(readFileSync(outPath, "utf8"));
    } catch {
      pack = {};
    }
  }
  for (let i = 0; i < parts.length; i++) {
    const missing = parts[i].filter((key) => !pack[key]);
    if (missing.length === 0) continue;
    const slice = Object.fromEntries(missing.map((key) => [key, en[key]]));
    process.stdout.write(`${code} chunk ${i + 1}/${parts.length} (${missing.length})\n`);
    let parsed;
    try {
      parsed = await callModel(name, slice);
    } catch (error) {
      process.stdout.write(`${code} chunk ${i + 1} failed: ${error.message}\n`);
      await new Promise((r) => setTimeout(r, 2000));
      parsed = await callModel(name, slice);
    }
    for (const key of missing) {
      if (typeof parsed[key] === "string" && parsed[key].trim()) pack[key] = parsed[key];
    }
    writeFileSync(outPath, JSON.stringify(pack));
  }
  const have = keys.filter((key) => typeof pack[key] === "string").length;
  process.stdout.write(`${code} done ${have}/${keys.length}\n`);
}

const queue = [...LANGS];
const workers = Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const next = queue.shift();
    if (!next) break;
    await oneLang(next);
  }
});
await Promise.all(workers);
process.stdout.write("all done\n");
