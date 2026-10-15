import { Link } from "@tanstack/react-router";
import { PLACE_PATHS, SHAPES } from "@/data/shapes";

const ORDER = [
  "yukon",
  "northwest-territories",
  "nunavut",
  "british-columbia",
  "alberta",
  "saskatchewan",
  "manitoba",
  "ontario",
  "quebec",
  "newfoundland-and-labrador",
  "new-brunswick",
  "nova-scotia",
  "prince-edward-island",
];

export function CanadaMap({
  labelFor,
  active,
  insetLabel,
}: {
  labelFor: (slug: string) => string;
  active?: string;
  insetLabel: string;
}) {
  return (
    <svg viewBox="0 0 1040 620" className="h-auto w-full" role="img">
      <rect x="848" y="8" width="180" height="150" rx="16" fill="#fff" stroke="#121212" strokeWidth="3" />
      <text x="938" y="28" textAnchor="middle" fill="#121212" fontSize="14" fontFamily="Nunito, sans-serif" fontWeight="800">
        {insetLabel}
      </text>
      {ORDER.map((slug) =>
        PLACE_PATHS[slug]!.map((key) => {
          const shape = SHAPES[key]!;
          const on = active === slug;
          return (
            <Link
              key={key}
              to="/places/$slug"
              params={{ slug }}
              aria-label={labelFor(slug)}
              className="outline-none"
            >
              <path
                d={shape.d}
                fill={on ? "#FF0000" : "#fff"}
                stroke="#FF0000"
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </Link>
          );
        }),
      )}
      <Link to="/places/$slug" params={{ slug: "nunavut" }} aria-label={labelFor("nunavut")}>
        <g>
          <path d="M868,48 L900,40 L912,70 L876,78 Z" fill={active === "nunavut" ? "#FF0000" : "#fff"} stroke="#FF0000" strokeWidth="3" />
          <path d="M924,44 L968,36 L980,74 L930,82 Z" fill={active === "nunavut" ? "#FF0000" : "#fff"} stroke="#FF0000" strokeWidth="3" />
          <path d="M900,86 L948,80 L956,116 L904,120 Z" fill={active === "nunavut" ? "#FF0000" : "#fff"} stroke="#FF0000" strokeWidth="3" />
        </g>
      </Link>
    </svg>
  );
}

export function PlaceOutline({ slug, caption }: { slug: string; caption: string }) {
  const keys = PLACE_PATHS[slug] ?? [];
  const boxes = keys.map((key) => SHAPES[key]!.box.split(" ").map(Number));
  const minX = Math.min(...boxes.map((b) => b[0]!)) - 12;
  const minY = Math.min(...boxes.map((b) => b[1]!)) - 12;
  const maxX = Math.max(...boxes.map((b) => b[0]! + b[2]!)) + 12;
  const maxY = Math.max(...boxes.map((b) => b[1]! + b[3]!)) + 12;
  const main = SHAPES[keys[0]!]!.box.split(" ").map(Number);
  const dotX = main[0]! + main[2]! / 2;
  const dotY = main[1]! + main[3]! * 0.62;
  return (
    <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="h-full w-full" role="img" aria-label={caption}>
      {keys.map((key) => (
        <path key={key} d={SHAPES[key]!.d} fill="#fff" stroke="#FF0000" strokeWidth="8" strokeLinejoin="round" />
      ))}
      <circle cx={dotX} cy={dotY} r="10" fill="#FF0000" />
    </svg>
  );
}

export function MiniOutline({ slug }: { slug: string }) {
  return (
    <div className="h-16 w-full">
      <PlaceOutline slug={slug} caption={slug} />
    </div>
  );
}

const BLOBS: { slug: string; cx: number; cy: number; rx: number; ry: number; n: string }[] = [
  { slug: "haida", cx: 78, cy: 400, rx: 26, ry: 20, n: "1" },
  { slug: "kwakwakawakw", cx: 110, cy: 470, rx: 26, ry: 20, n: "2" },
  { slug: "nisgaa", cx: 120, cy: 310, rx: 26, ry: 20, n: "3" },
  { slug: "siksika", cx: 240, cy: 430, rx: 30, ry: 22, n: "4" },
  { slug: "dene", cx: 290, cy: 160, rx: 48, ry: 30, n: "5" },
  { slug: "cree", cx: 520, cy: 340, rx: 78, ry: 34, n: "6" },
  { slug: "metis", cx: 390, cy: 420, rx: 42, ry: 24, n: "7" },
  { slug: "anishinaabe", cx: 620, cy: 430, rx: 46, ry: 26, n: "8" },
  { slug: "haudenosaunee", cx: 700, cy: 500, rx: 36, ry: 22, n: "9" },
  { slug: "innu", cx: 900, cy: 260, rx: 36, ry: 26, n: "10" },
  { slug: "inuit", cx: 620, cy: 130, rx: 70, ry: 32, n: "11" },
  { slug: "mikmaq", cx: 930, cy: 540, rx: 44, ry: 22, n: "12" },
];

export function NationsMap({ labelFor }: { labelFor: (slug: string) => string }) {
  return (
    <svg viewBox="0 0 1040 620" className="h-auto w-full" role="img">
      {Object.entries(SHAPES).map(([key, shape]) => (
        <path key={key} d={shape.d} fill="#fff" stroke="#121212" strokeWidth="3" strokeLinejoin="round" />
      ))}
      {BLOBS.map((blob) => (
        <Link key={blob.slug} to="/nations/$slug" params={{ slug: blob.slug }} aria-label={labelFor(blob.slug)}>
          <ellipse
            cx={blob.cx}
            cy={blob.cy}
            rx={blob.rx}
            ry={blob.ry}
            fill="#FF0000"
            fillOpacity="0.9"
            stroke="#121212"
            strokeWidth="3"
          />
          <text
            x={blob.cx}
            y={blob.cy + 6}
            textAnchor="middle"
            fill="#F7F5F2"
            fontSize="18"
            fontFamily="Nunito, sans-serif"
            fontWeight="800"
          >
            {blob.n}
          </text>
        </Link>
      ))}
    </svg>
  );
}
