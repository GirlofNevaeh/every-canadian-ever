/** Original schematic outlines. Not a traced atlas. */
export const SHAPES: Record<string, { d: string; box: string }> = {
  yukon: {
    d: "M36,128 L158,108 L172,248 L48,258 Z",
    box: "30 100 150 170",
  },
  "northwest-territories": {
    d: "M158,108 L392,86 L408,236 L172,248 Z",
    box: "150 70 270 190",
  },
  nunavut: {
    d: "M392,86 L628,68 L646,168 L520,214 L408,236 Z",
    box: "380 55 280 190",
  },
  baffin: {
    d: "M668,52 L812,36 L836,168 L700,196 L656,120 Z",
    box: "640 30 210 180",
  },
  "british-columbia": {
    d: "M36,258 L172,248 L186,520 L58,548 L28,380 Z",
    box: "20 240 180 320",
  },
  alberta: {
    d: "M172,248 L286,236 L300,508 L186,520 Z",
    box: "165 230 145 300",
  },
  saskatchewan: {
    d: "M286,236 L398,226 L412,496 L300,508 Z",
    box: "280 220 140 300",
  },
  manitoba: {
    d: "M398,226 L512,240 L524,360 L478,496 L412,496 Z",
    box: "390 220 145 290",
  },
  ontario: {
    d: "M512,268 L668,248 L724,348 L778,430 L708,498 L572,548 L518,478 L486,528 L458,410 L524,360 Z",
    box: "450 240 340 320",
  },
  quebec: {
    d: "M668,168 L868,146 L916,292 L858,468 L778,430 L724,348 L668,248 L640,200 Z",
    box: "620 140 310 340",
  },
  labrador: {
    d: "M868,168 L988,150 L1008,320 L900,352 L868,260 Z",
    box: "850 140 170 220",
  },
  newfoundland: {
    d: "M918,368 L1016,354 L1030,458 L940,488 L888,420 Z",
    box: "880 345 160 155",
  },
  "new-brunswick": {
    d: "M778,498 L868,486 L884,572 L792,584 Z",
    box: "770 480 120 115",
  },
  "nova-scotia": {
    d: "M868,548 L1018,530 L1030,588 L888,606 L848,568 Z",
    box: "840 520 200 100",
  },
  "prince-edward-island": {
    d: "M800,392 L980,380 L992,488 L812,500 Z",
    box: "790 370 210 140",
  },
};

export const PLACE_PATHS: Record<string, string[]> = {
  yukon: ["yukon"],
  "northwest-territories": ["northwest-territories"],
  nunavut: ["nunavut", "baffin"],
  "british-columbia": ["british-columbia"],
  alberta: ["alberta"],
  saskatchewan: ["saskatchewan"],
  manitoba: ["manitoba"],
  ontario: ["ontario"],
  quebec: ["quebec"],
  "newfoundland-and-labrador": ["labrador", "newfoundland"],
  "new-brunswick": ["new-brunswick"],
  "nova-scotia": ["nova-scotia"],
  "prince-edward-island": ["prince-edward-island"],
};
