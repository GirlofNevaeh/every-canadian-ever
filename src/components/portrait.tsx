export type LeaderLook = {
  skin: "fair" | "light" | "rosy";
  hair: "dark" | "brown" | "sandy" | "blonde" | "grey" | "silver" | "white" | "salt";
  style:
    | "wavy"
    | "curly"
    | "slick"
    | "side"
    | "short"
    | "bob"
    | "receding"
    | "balding"
    | "combover"
    | "thick"
    | "silver-waves";
  face: "oval" | "round" | "long" | "square";
  facial?: "none" | "beard" | "beard-full" | "sideburns" | "mustache" | "mustache-small";
  glasses?: boolean;
  bowtie?: boolean;
  rose?: boolean;
  woman?: boolean;
  older?: boolean;
};

const SKIN = {
  fair: "#F6D4C0",
  light: "#F0C2A4",
  rosy: "#F4C8B4",
} as const;

const HAIR = {
  dark: "#241C16",
  brown: "#5C3B24",
  sandy: "#C6A15A",
  blonde: "#F3D56A",
  grey: "#8E8A84",
  silver: "#D5D2CC",
  white: "#F3F1ED",
  salt: "#8A8178",
} as const;

function FaceShape({ look, skin }: { look: LeaderLook; skin: string }) {
  const stroke = "#121212";
  if (look.woman) {
    return (
      <ellipse cx="100" cy="112" rx="42" ry="50" fill={skin} stroke={stroke} strokeWidth="2.5" />
    );
  }
  if (look.face === "round") {
    return (
      <ellipse cx="100" cy="116" rx="50" ry="50" fill={skin} stroke={stroke} strokeWidth="2.5" />
    );
  }
  if (look.face === "long") {
    return (
      <ellipse cx="100" cy="112" rx="42" ry="60" fill={skin} stroke={stroke} strokeWidth="2.5" />
    );
  }
  if (look.face === "square") {
    return (
      <path
        d="M60 104 Q56 72 100 66 Q144 72 140 104 Q146 142 100 164 Q54 142 60 104 Z"
        fill={skin}
        stroke={stroke}
        strokeWidth="2.5"
      />
    );
  }
  return <ellipse cx="100" cy="114" rx="46" ry="56" fill={skin} stroke={stroke} strokeWidth="2.5" />;
}

function HairBack({ look, color }: { look: LeaderLook; color: string }) {
  const edge = "#121212";
  if (look.style === "bob") {
    return (
      <path
        d="M46 102 Q32 154 68 182 Q100 200 132 182 Q168 154 154 102 Q166 52 100 36 Q34 52 46 102 Z"
        fill={color}
        stroke={edge}
        strokeWidth="2"
      />
    );
  }
  if (look.style === "balding" || look.style === "combover") {
    return (
      <g>
        <path
          d="M52 124 Q46 156 68 168 L64 118 Q56 108 74 112 Z"
          fill={color}
          stroke={edge}
          strokeWidth="2"
        />
        <path
          d="M148 124 Q154 156 132 168 L136 118 Q144 108 126 112 Z"
          fill={color}
          stroke={edge}
          strokeWidth="2"
        />
        <path
          d="M68 150 Q100 176 132 150 L128 164 Q100 180 72 164 Z"
          fill={color}
          stroke={edge}
          strokeWidth="2"
        />
      </g>
    );
  }
  if (look.style === "receding" || look.style === "silver-waves") {
    const long = look.style === "silver-waves";
    return (
      <path
        d={
          long
            ? "M42 108 C28 48 62 18 100 22 C138 18 172 48 158 108 C150 46 128 28 100 34 C72 28 50 46 42 108 Z"
            : "M50 104 C40 52 68 28 100 32 C132 28 160 52 150 104 C144 58 124 42 100 46 C76 42 56 58 50 104 Z"
        }
        fill={color}
        stroke={edge}
        strokeWidth="2"
      />
    );
  }
  if (look.style === "short") {
    return (
      <path
        d="M54 108 C46 58 70 34 100 30 C130 34 154 58 146 108 C140 62 122 46 100 44 C78 46 60 62 54 108 Z"
        fill={color}
        stroke={edge}
        strokeWidth="2"
      />
    );
  }
  if (look.style === "curly") {
    return (
      <g fill={color} stroke={edge} strokeWidth="2">
        <ellipse cx="70" cy="78" rx="18" ry="16" />
        <ellipse cx="100" cy="64" rx="22" ry="16" />
        <ellipse cx="132" cy="78" rx="18" ry="16" />
        <ellipse cx="56" cy="104" rx="14" ry="18" />
        <ellipse cx="146" cy="104" rx="14" ry="18" />
        <ellipse cx="78" cy="70" rx="14" ry="12" />
        <ellipse cx="122" cy="70" rx="14" ry="12" />
      </g>
    );
  }
  if (look.style === "thick") {
    return (
      <path
        d="M46 112 Q36 64 78 46 Q100 36 122 46 Q164 64 154 112 Q166 70 128 48 Q100 40 72 48 Q34 70 46 112 Z"
        fill={color}
        stroke={edge}
        strokeWidth="2"
      />
    );
  }
  if (look.style === "slick") {
    return (
      <path
        d="M56 108 Q50 68 100 56 Q150 68 144 108 Q154 72 100 60 Q46 72 56 108 Z"
        fill={color}
        stroke={edge}
        strokeWidth="2"
      />
    );
  }
  if (look.style === "side") {
    return (
      <path
        d="M54 112 Q46 70 96 52 Q148 64 146 108 Q156 74 110 56 Q52 70 54 112 Z"
        fill={color}
        stroke={edge}
        strokeWidth="2"
      />
    );
  }
  return (
    <path
      d="M50 114 Q40 68 78 48 Q100 38 124 50 Q162 70 150 114 Q160 72 120 50 Q100 42 78 52 Q42 74 50 114 Z"
      fill={color}
      stroke={edge}
      strokeWidth="2"
    />
  );
}

function HairFront({ look, color, skin }: { look: LeaderLook; color: string; skin: string }) {
  if (look.style === "bob") {
    return (
      <path
        d="M62 108 Q78 78 100 74 Q122 78 138 108 Q124 96 100 92 Q76 96 62 108 Z"
        fill={color}
        stroke="#121212"
        strokeWidth="2"
      />
    );
  }
  if (look.style === "combover") {
    return (
      <g fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round">
        <path d="M72 78 Q100 68 132 86" />
        <path d="M74 86 Q102 74 130 94" />
        <path d="M78 94 Q104 84 126 100" />
      </g>
    );
  }
  if (look.style === "side") {
    return (
      <path
        d="M92 58 Q100 86 96 104"
        fill="none"
        stroke={skin}
        strokeWidth="3"
        strokeLinecap="round"
      />
    );
  }
  if (look.style === "silver-waves") {
    return (
      <g fill="none" stroke="#121212" strokeWidth="1.4" opacity="0.35">
        <path d="M70 96 Q78 80 92 90" />
        <path d="M112 88 Q124 76 136 92" />
      </g>
    );
  }
  if (look.style === "wavy" || look.style === "curly" || look.style === "thick") {
    return (
      <g fill="none" stroke="#121212" strokeWidth="1.3" opacity="0.28">
        <path d="M72 84 Q86 74 98 86" />
        <path d="M108 78 Q122 70 134 86" />
      </g>
    );
  }
  return null;
}

function FacialHair({ look, color }: { look: LeaderLook; color: string }) {
  const kind = look.facial ?? "none";
  if (kind === "none") return null;
  const edge = "#121212";
  if (kind === "mustache") {
    return (
      <path
        d="M78 132 Q90 142 100 134 Q110 142 122 132 Q112 138 100 136 Q88 138 78 132 Z"
        fill={color}
        stroke={edge}
        strokeWidth="1.6"
      />
    );
  }
  if (kind === "mustache-small") {
    return (
      <path
        d="M90 131 Q100 137 110 131"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    );
  }
  if (kind === "sideburns") {
    return (
      <g fill={color} stroke={edge} strokeWidth="1.6">
        <path d="M58 116 Q46 146 62 170 Q76 156 72 122 Z" />
        <path d="M142 116 Q154 146 138 170 Q124 156 128 122 Z" />
      </g>
    );
  }
  const wide = kind === "beard-full";
  return (
    <path
      d={
        wide
          ? "M58 136 Q48 178 100 198 Q152 178 142 136 Q124 156 100 158 Q76 156 58 136 Z"
          : "M68 140 Q60 174 100 188 Q140 174 132 140 Q116 156 100 156 Q84 156 68 140 Z"
      }
      fill={color}
      stroke={edge}
      strokeWidth="1.8"
    />
  );
}

export function LeaderPortrait({ look, label }: { look: LeaderLook; label: string }) {
  const skin = SKIN[look.skin];
  const hair = HAIR[look.hair];
  const eyeY = look.face === "round" ? 112 : look.face === "long" ? 108 : 110;
  return (
    <svg viewBox="0 0 200 236" role="img" aria-label={label} className="h-full w-full">
      <path
        d={
          look.woman
            ? "M28 236 C48 176 72 162 100 162 C128 162 152 176 172 236 Z"
            : "M16 236 C40 172 68 156 100 156 C132 156 160 172 184 236 Z"
        }
        fill="#1A1A1A"
      />
      {look.woman ? (
        <path d="M78 168 Q100 198 122 168 L114 210 L86 210 Z" fill="#F7F5F2" />
      ) : look.bowtie ? (
        <g>
          <path d="M86 168 L100 214 L114 168 Z" fill="#F7F5F2" />
          <path d="M70 196 L100 206 L70 216 Z" fill="#FF0000" />
          <path d="M130 196 L100 206 L130 216 Z" fill="#FF0000" />
          <circle cx="100" cy="206" r="4" fill="#121212" />
        </g>
      ) : (
        <path d="M86 164 L100 214 L114 164 Z" fill="#F7F5F2" />
      )}
      {!look.woman && !look.bowtie ? <path d="M96 176 L100 208 L104 176 Z" fill="#FF0000" /> : null}
      {look.rose ? (
        <g>
          <circle cx="136" cy="196" r="8" fill="#FF0000" />
          <circle cx="136" cy="196" r="3" fill="#F7F5F2" />
        </g>
      ) : null}
      <rect x="88" y="146" width="24" height="28" rx="8" fill={skin} />
      <HairBack look={look} color={hair} />
      <ellipse cx="50" cy="120" rx="9" ry="13" fill={skin} stroke="#121212" strokeWidth="2" />
      <ellipse cx="150" cy="120" rx="9" ry="13" fill={skin} stroke="#121212" strokeWidth="2" />
      <FaceShape look={look} skin={skin} />
      <HairFront look={look} color={hair} skin={skin} />
      <FacialHair look={look} color={hair} />
      <g>
        <path
          d={`M70 ${eyeY - 12} Q80 ${eyeY - 16} 90 ${eyeY - 11}`}
          fill="none"
          stroke="#241C16"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d={`M110 ${eyeY - 11} Q120 ${eyeY - 16} 130 ${eyeY - 12}`}
          fill="none"
          stroke="#241C16"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <ellipse cx="80" cy={eyeY} rx="5" ry="5.4" fill="#241C16" />
        <ellipse cx="120" cy={eyeY} rx="5" ry="5.4" fill="#241C16" />
        <circle cx="82" cy={eyeY - 2} r="1.3" fill="#F7F5F2" />
        <circle cx="122" cy={eyeY - 2} r="1.3" fill="#F7F5F2" />
        {look.woman ? (
          <g stroke="#241C16" strokeWidth="1.4" strokeLinecap="round">
            <path d={`M74 ${eyeY - 2} L77 ${eyeY - 6}`} />
            <path d={`M80 ${eyeY - 3} L81 ${eyeY - 7}`} />
            <path d={`M114 ${eyeY - 3} L115 ${eyeY - 7}`} />
            <path d={`M120 ${eyeY - 2} L123 ${eyeY - 6}`} />
          </g>
        ) : null}
        <path
          d={`M100 ${eyeY + 4} Q106 ${eyeY + 16} 100 ${eyeY + 18}`}
          fill="none"
          stroke="#C48B78"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d={`M86 ${eyeY + 32} Q100 ${eyeY + 40} 114 ${eyeY + 32}`}
          fill="none"
          stroke="#A85A52"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {look.older ? (
          <g fill="none" stroke="#C48B78" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
            <path d={`M66 ${eyeY + 6} Q72 ${eyeY + 8} 78 ${eyeY + 6}`} />
            <path d={`M122 ${eyeY + 6} Q128 ${eyeY + 8} 134 ${eyeY + 6}`} />
          </g>
        ) : null}
      </g>
      {look.glasses ? (
        <g fill="none" stroke="#121212" strokeWidth="2.4">
          <circle cx="80" cy={eyeY} r="14" />
          <circle cx="120" cy={eyeY} r="14" />
          <path d={`M94 ${eyeY} H106`} />
        </g>
      ) : null}
    </svg>
  );
}

type KidSpec = {
  skin: string;
  hair: string;
  girl: boolean;
  style: "braids" | "bob" | "puff" | "long" | "ponytail" | "bun" | "clip" | "short" | "buzz" | "curls" | "fringe";
};

const KIDS: KidSpec[] = [
  { skin: "#5C3317", hair: "#1A1A1A", girl: true, style: "braids" },
  { skin: "#4A2912", hair: "#1A1A1A", girl: true, style: "puff" },
  { skin: "#8D5524", hair: "#1A1A1A", girl: true, style: "long" },
  { skin: "#A86B3C", hair: "#241C16", girl: true, style: "bob" },
  { skin: "#C68642", hair: "#3A2416", girl: true, style: "ponytail" },
  { skin: "#D09458", hair: "#5C3A22", girl: true, style: "braids" },
  { skin: "#F0C2A4", hair: "#E2C56A", girl: true, style: "bob" },
  { skin: "#E8B48A", hair: "#5C3A22", girl: true, style: "ponytail" },
  { skin: "#F6D4C0", hair: "#8A4B2A", girl: true, style: "long" },
  { skin: "#F3C7B0", hair: "#241C16", girl: true, style: "clip" },
  { skin: "#E8B48A", hair: "#1A1A1A", girl: true, style: "bun" },
  { skin: "#8D5524", hair: "#1A1A1A", girl: true, style: "long" },
  { skin: "#4A2912", hair: "#1A1A1A", girl: false, style: "buzz" },
  { skin: "#5C3317", hair: "#1A1A1A", girl: false, style: "short" },
  { skin: "#8D5524", hair: "#241C16", girl: false, style: "curls" },
  { skin: "#A86B3C", hair: "#1A1A1A", girl: false, style: "short" },
  { skin: "#C68642", hair: "#241C16", girl: false, style: "fringe" },
  { skin: "#D09458", hair: "#5C3A22", girl: false, style: "short" },
  { skin: "#F0C2A4", hair: "#E2C56A", girl: false, style: "short" },
  { skin: "#E8B48A", hair: "#5C3A22", girl: false, style: "curls" },
  { skin: "#F6D4C0", hair: "#C6A15A", girl: false, style: "fringe" },
  { skin: "#F3C7B0", hair: "#241C16", girl: false, style: "short" },
  { skin: "#C68642", hair: "#3A2416", girl: false, style: "buzz" },
  { skin: "#8D5524", hair: "#1A1A1A", girl: false, style: "curls" },
];

export const KID_COUNT = KIDS.length;

export function KidFace({ index, label }: { index: number; label?: string }) {
  const kid = KIDS[index % KIDS.length]!;
  const girl = kid.girl;
  return (
    <svg viewBox="0 0 120 132" role="img" aria-label={label ?? (girl ? "Girl" : "Boy")} className="h-full w-full">
      <path d="M14 132 C28 96 42 88 60 88 C78 88 92 96 106 132 Z" fill={girl ? "#FF0000" : "#1A1A1A"} />
      <path d="M50 90 L60 112 L70 90 Z" fill="#F7F5F2" />
      {kid.style === "long" || kid.style === "braids" || kid.style === "ponytail" ? (
        <path d="M28 58 Q22 100 36 118 L48 100 Q40 70 48 52 Z" fill={kid.hair} />
      ) : null}
      {kid.style === "long" || kid.style === "braids" || kid.style === "ponytail" ? (
        <path d="M92 58 Q98 100 84 118 L72 100 Q80 70 72 52 Z" fill={kid.hair} />
      ) : null}
      {kid.style === "puff" ? <ellipse cx="60" cy="42" rx="28" ry="18" fill={kid.hair} /> : null}
      {kid.style === "bun" ? <circle cx="60" cy="30" r="12" fill={kid.hair} /> : null}
      {kid.style === "bob" ? <path d="M30 62 Q26 90 42 98 Q60 106 78 98 Q94 90 90 62 Q92 40 60 36 Q28 40 30 62 Z" fill={kid.hair} /> : null}
      {kid.style === "ponytail" ? <ellipse cx="92" cy="78" rx="10" ry="16" fill={kid.hair} /> : null}
      <ellipse cx="60" cy="68" rx="28" ry="30" fill={kid.skin} stroke="#121212" strokeWidth="2" />
      {(kid.style === "short" || kid.style === "curls" || kid.style === "fringe" || kid.style === "buzz" || kid.style === "clip") && (
        <path
          d={
            kid.style === "buzz"
              ? "M34 60 Q32 40 60 36 Q88 40 86 60 Q88 46 60 42 Q32 46 34 60 Z"
              : kid.style === "curls"
                ? "M32 62 Q30 36 60 32 Q90 36 88 62 Q78 44 60 40 Q42 44 32 62 Z"
                : "M34 58 Q32 38 60 34 Q88 38 86 58 Q90 44 60 40 Q30 44 34 58 Z"
          }
          fill={kid.hair}
          stroke="#121212"
          strokeWidth="1.5"
        />
      )}
      {kid.style === "braids" ? (
        <g fill={kid.hair}>
          <rect x="30" y="96" width="8" height="20" rx="4" />
          <rect x="82" y="96" width="8" height="20" rx="4" />
        </g>
      ) : null}
      {girl && kid.style === "clip" ? <circle cx="86" cy="50" r="4" fill="#FF0000" /> : null}
      {girl && kid.style === "puff" ? <circle cx="60" cy="28" r="4" fill="#FF0000" /> : null}
      <ellipse cx="50" cy="70" rx="3.2" ry="3.4" fill="#241C16" />
      <ellipse cx="70" cy="70" rx="3.2" ry="3.4" fill="#241C16" />
      {girl ? (
        <g stroke="#241C16" strokeWidth="1.2" strokeLinecap="round">
          <path d="M46 66 L48 63" />
          <path d="M66 66 L68 63" />
        </g>
      ) : null}
      <path d="M60 74 Q64 80 60 82" fill="none" stroke="#C48B78" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M52 90 Q60 96 68 90" fill="none" stroke="#A85A52" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
