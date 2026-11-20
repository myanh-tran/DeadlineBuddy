(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // ../../download/atelier-for-cursor-src/atelier-for-cursor/src/lib/atelier/catalog.ts
  var catalog_exports = {};
  __export(catalog_exports, {
    CAP_COLORS: () => CAP_COLORS,
    CASE_MATERIAL_LABEL: () => CASE_MATERIAL_LABEL,
    CATEGORY_LABEL: () => CATEGORY_LABEL,
    FEEL_LABEL: () => FEEL_LABEL,
    ITEMS: () => ITEMS,
    KIND_LABEL: () => KIND_LABEL,
    KITS: () => KITS,
    LAYOUT_LABEL: () => LAYOUT_LABEL,
    LAYOUT_ROWS: () => LAYOUT_ROWS,
    PC_FIELDS: () => PC_FIELDS,
    PLATE_LABEL: () => PLATE_LABEL,
    RARITY_LABEL: () => RARITY_LABEL,
    SOUND_LABEL: () => SOUND_LABEL,
    formatPrice: () => formatPrice,
    getItem: () => getItem,
    itemsIn: () => itemsIn,
    kitParts: () => kitParts,
    layoutKeys: () => layoutKeys
  });
  function formatPrice(vnd) {
    if (vnd >= 1e6) {
      const value = vnd / 1e6;
      const text = value >= 10 ? String(Math.round(value)) : value.toFixed(1).replace(".", ",");
      return `${text}tr`;
    }
    return `${Math.round(vnd / 1e3)}k`;
  }
  function priceTier(price, rareAt, epicAt, legendAt) {
    if (price >= legendAt) return "legendary";
    if (price >= epicAt) return "epic";
    if (price >= rareAt) return "rare";
    return "common";
  }
  var RARITY_LABEL = {
    common: "Th\u01B0\u1EDDng",
    rare: "Hi\u1EBFm",
    epic: "S\u1EED thi",
    legendary: "Huy\u1EC1n tho\u1EA1i"
  };
  var CATEGORY_LABEL = {
    desk: "B\xE0n",
    chair: "Gh\u1EBF",
    pc_case: "Case",
    motherboard: "Mainboard",
    cpu: "CPU",
    gpu: "GPU",
    ram: "RAM",
    storage: "\u1ED4",
    psu: "Ngu\u1ED3n",
    cooler: "T\u1EA3n",
    fan: "Qu\u1EA1t",
    paste: "Keo t\u1EA3n",
    riser: "Riser",
    bracket: "\u0110\u1EE1 GPU",
    hub: "Hub qu\u1EA1t",
    sleeve: "D\xE2y b\u1ECDc",
    sound_card: "Card \xE2m thanh",
    nic: "Card m\u1EA1ng",
    optical: "\u1ED4 quang",
    cpu_block: "Block CPU",
    gpu_block: "Block GPU",
    pump: "B\u01A1m",
    radiator: "K\xE9t n\u01B0\u1EDBc",
    tube: "\u1ED0ng v\xE0 fitting",
    kb_case: "Case ph\xEDm",
    kb_pcb: "M\u1EA1ch",
    plate: "Plate",
    switch: "Switch",
    mouse: "Chu\u1ED9t",
    headphone: "Headphone",
    iem: "IEM",
    dac: "DAC",
    cable: "D\xE2y",
    eartips: "Eartips",
    monitor: "M\xE0n h\xECnh",
    arm: "Arm",
    speaker: "Loa",
    light: "\u0110\xE8n",
    mousepad: "L\xF3t chu\u1ED9t",
    wrist: "K\xEA tay",
    webcam: "Webcam",
    mic: "Mic",
    dock: "Dock",
    stand: "Ch\xE2n tai",
    mecha_part: "M\xF4 h\xECnh"
  };
  var LAYOUT_LABEL = {
    "60": "60%",
    "65": "65%",
    "75": "75%",
    tkl: "TKL",
    full: "Fullsize",
    alice: "Alice",
    alice67: "Alice 67",
    alice_f: "Alice h\xE0ng F",
    split: "Split",
    split_alice: "Split Alice"
  };
  var CAP_COLORS = [
    { id: "ink", hex: "#1c1b19", label: "M\u1EF1c" },
    { id: "cream", hex: "#f0e6d0", label: "Kem" },
    { id: "navy", hex: "#243e5a", label: "Navy" },
    { id: "olive", hex: "#5d6a45", label: "Olive" },
    { id: "clay", hex: "#c4846a", label: "\u0110\u1EA5t" },
    { id: "brass", hex: "#c9a15a", label: "\u0110\u1ED3ng" },
    { id: "fog", hex: "#e7e4de", label: "S\u01B0\u01A1ng" },
    { id: "slate", hex: "#5c6168", label: "Ch\xEC" }
  ];
  var R1 = ["esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "bspc"];
  var R2 = ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"];
  var R3 = ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"];
  var R4 = ["lshift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "rshift"];
  var R5 = ["lctrl", "lalt", "space", "ralt", "fn"];
  var FROW = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"];
  var ARROWS = ["left", "down", "right", "up"];
  var LAYOUT_ROWS = {
    "60": [
      R1,
      ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
      R3,
      R4,
      ["lctrl", "lalt", "space", "ralt"]
    ],
    "65": [R1, R2, R3, R4, R5],
    "75": [R1, R2, R3, R4, R5, ["del", "end", "pgdn", "left", "down", "right"]],
    tkl: [R1, R2, R3, R4, R5, ["ins", "home", "pgup", "del", "end", "pgdn", "left", "down", "right"]],
    full: [
      R1,
      R2,
      R3,
      R4,
      R5,
      ["ins", "home", "pgup", "del", "end", "pgdn", "left", "down", "right"],
      ["n7", "n8", "n9", "n4", "n5", "n6", "n1", "n2", "n3", "n0"]
    ],
    alice: [
      R1,
      ["tab", "q", "w", "e", "r", "t", "gap", "y", "u", "i", "o", "p", "[", "]"],
      ["caps", "a", "s", "d", "f", "g", "gap", "h", "j", "k", "l", ";", "'", "enter"],
      ["lshift", "z", "x", "c", "v", "b", "gap", "n", "m", ",", ".", "/", "rshift"],
      ["lctrl", "lalt", "space", "gap", "ralt", "fn"]
    ],
    alice67: [
      R1,
      ["tab", "q", "w", "e", "r", "t", "gap", "y", "u", "i", "o", "p", "[", "]"],
      ["caps", "a", "s", "d", "f", "g", "gap", "h", "j", "k", "l", ";", "'", "enter"],
      ["lshift", "z", "x", "c", "v", "b", "gap", "n", "m", ",", ".", "/", "rshift", ...ARROWS],
      ["lctrl", "lalt", "space", "gap", "ralt", "fn", "del", "end", "pgdn"]
    ],
    alice_f: [
      FROW,
      R1,
      ["tab", "q", "w", "e", "r", "t", "gap", "y", "u", "i", "o", "p", "[", "]"],
      ["caps", "a", "s", "d", "f", "g", "gap", "h", "j", "k", "l", ";", "'", "enter"],
      ["lshift", "z", "x", "c", "v", "b", "gap", "n", "m", ",", ".", "/", "rshift"],
      ["lctrl", "lalt", "space", "gap", "ralt", "fn"]
    ],
    split: [
      ["esc", "1", "2", "3", "4", "5", "gap", "gap", "6", "7", "8", "9", "0", "-"],
      ["tab", "q", "w", "e", "r", "t", "gap", "gap", "y", "u", "i", "o", "p", "["],
      ["caps", "a", "s", "d", "f", "g", "gap", "gap", "h", "j", "k", "l", ";", "'"],
      ["lshift", "z", "x", "c", "v", "b", "gap", "gap", "n", "m", ",", ".", "/", "rshift"],
      ["lctrl", "lalt", "space", "gap", "gap", "space", "ralt", "fn"]
    ],
    split_alice: [
      ["esc", "1", "2", "3", "4", "5", "gap", "gap", "6", "7", "8", "9", "0", "bspc"],
      ["tab", "q", "w", "e", "r", "t", "gap", "gap", "y", "u", "i", "o", "p", "["],
      ["caps", "a", "s", "d", "f", "g", "gap", "gap", "h", "j", "k", "l", ";", "enter"],
      ["lshift", "z", "x", "c", "v", "b", "gap", "gap", "n", "m", ",", ".", "/", "rshift"],
      ["lctrl", "lalt", "space", "gap", "gap", "space", "ralt", "fn"]
    ]
  };
  function layoutKeys(layout) {
    return LAYOUT_ROWS[layout].flat().filter((key) => key !== "gap");
  }
  var SUIT_NAMES = [
    "White Striker",
    "Blue Lance",
    "Red Crest",
    "Black Wing",
    "Gold Pike",
    "Pale Guard",
    "Wild Saint",
    "Silent Knight",
    "Ember Judge",
    "Nova Halo",
    "Drift Ash",
    "Reed Harbor",
    "Glass Iron",
    "Night Crown",
    "Ivory Abyss",
    "Aurora Kite",
    "Vesper Hollow",
    "Marrow Summit",
    "Paper Cinder",
    "Bloom Frost",
    "Tide Quartz",
    "Flint Gale",
    "Moss Copper",
    "Violet Sable",
    "Amber Pike",
    "Cobalt Wing",
    "Scarlet Frame",
    "Olive Lance",
    "Silver Crest",
    "Rust Saint",
    "Pearl Knight",
    "Indigo Judge",
    "Crimson Halo",
    "Teal Striker",
    "Bronze Guard",
    "Ivory Lance",
    "Onyx Wing",
    "Saffron Crest",
    "Slate Pike",
    "Lilac Saint",
    "Navy Frame",
    "Maroon Halo",
    "Sand Knight",
    "Plum Judge",
    "Mint Striker",
    "Coal Wing",
    "Honey Crest",
    "Storm Pike",
    "Fog Guard",
    "Clay Saint",
    "Dune Knight",
    "Ash Judge"
  ];
  var SUIT_TONES = ["#f4efe6", "#7ea2c4", "#a33b32", "#1c1b19", "#e0a24a", "#d7d2c8", "#3d4a48", "#6e5438", "#c45a2a", "#c9a15a", "#8d8478", "#2f6b45"];
  var SUIT_GRADES = [
    { brand: "1/144 r\xE1p nhanh", base: 28e4, count: 18 },
    { brand: "1/144 chi ti\u1EBFt", base: 95e4, count: 14 },
    { brand: "1/100", base: 24e5, count: 12 },
    { brand: "1/60", base: 12e6, count: 8 }
  ];
  var KITS = SUIT_GRADES.flatMap(
    (grade) => Array.from({ length: grade.count }, (_, index) => {
      const cursor = SUIT_GRADES.slice(0, SUIT_GRADES.indexOf(grade)).reduce((sum, row) => sum + row.count, 0) + index;
      const price = Math.round(grade.base * (1 + index * 0.07));
      return {
        id: `suit_${cursor}`,
        name: SUIT_NAMES[cursor] ?? `Suit ${cursor}`,
        brand: grade.brand,
        rarity: priceTier(price, 8e5, 25e5, 8e6),
        tone: SUIT_TONES[cursor % SUIT_TONES.length],
        price
      };
    })
  );
  var PARTS = [
    { id: "head", label: "\u0110\u1EA7u" },
    { id: "torso", label: "Th\xE2n" },
    { id: "arm_l", label: "Tay tr\xE1i" },
    { id: "arm_r", label: "Tay ph\u1EA3i" },
    { id: "leg_l", label: "Ch\xE2n tr\xE1i" },
    { id: "leg_r", label: "Ch\xE2n ph\u1EA3i" },
    { id: "pack", label: "L\u01B0ng" },
    { id: "weapon", label: "V\u0169 kh\xED" }
  ];
  function item(partial) {
    return {
      blurb: partial.name,
      tone: "#8d8478",
      ...partial
    };
  }
  function branded(brands, variants, spec) {
    const rows = [];
    for (const brand of brands) {
      for (const variant of variants) {
        const price = Math.round(brand.base * variant.factor);
        rows.push(
          item({
            id: `${spec.id}_${rows.length}`,
            name: `${brand.brand} ${variant.label}`,
            category: spec.category,
            rarity: priceTier(price, spec.rareAt, spec.epicAt, spec.legendAt),
            brand: brand.brand,
            price,
            tone: spec.tone,
            blurb: spec.blurb(variant.label)
          })
        );
      }
    }
    return rows.slice(0, 50);
  }
  function lined(brands, variants, spec) {
    const rows = [];
    for (const brand of brands) {
      for (const variant of variants) {
        const { label, factor, ...extra } = variant;
        const price = Math.round(brand.base * factor);
        rows.push(
          item({
            ...extra,
            id: `${spec.id}_${rows.length}`,
            name: `${brand.brand} ${label}`,
            category: spec.category,
            rarity: priceTier(price, spec.rareAt, spec.epicAt, spec.legendAt),
            brand: brand.brand,
            price,
            tone: extra.tone ?? spec.tone,
            blurb: spec.blurb(label)
          })
        );
      }
    }
    return rows.slice(0, 50);
  }
  var FURNITURE = [
    ...lined(
      [
        { brand: "IKEA", base: 12e5 },
        { brand: "Full", base: 18e5 },
        { brand: "Flexispot", base: 32e5 },
        { brand: "Arozzi", base: 4e6 },
        { brand: "Secretlab", base: 8e6 },
        { brand: "Autonomous", base: 95e5 },
        { brand: "Uplift", base: 12e6 },
        { brand: "Branch", base: 14e6 },
        { brand: "Herman Miller", base: 22e6 },
        { brand: "USM", base: 28e6 }
      ],
      [
        { label: "th\u1EB3ng g\u1ED7", factor: 0.8, deskShape: "straight", tone: "#a56b3c" },
        { label: "ch\u1EEF L", factor: 1.2, deskShape: "l", tone: "#8a5a32" },
        { label: "ch\u1EEF U", factor: 1.6, deskShape: "u", tone: "#6e4324" },
        { label: "ch\u1EEF K", factor: 1.8, deskShape: "k", tone: "#4e3424" },
        { label: "n\xE2ng \u0111i\u1EC7n", factor: 1.4, deskShape: "straight", tone: "#c9c2b4" }
      ],
      { id: "desk", category: "desk", rareAt: 4e6, epicAt: 12e6, legendAt: 22e6, tone: "#a56b3c", blurb: (v) => `B\xE0n ${v}.` }
    ),
    ...lined(
      [
        { brand: "IKEA", base: 8e5 },
        { brand: "Sihoo", base: 25e5 },
        { brand: "DxRacer", base: 4e6 },
        { brand: "AndaSeat", base: 55e5 },
        { brand: "Secretlab", base: 12e6 },
        { brand: "Herman Miller", base: 28e6 },
        { brand: "Steelcase", base: 24e6 },
        { brand: "Haworth", base: 2e7 },
        { brand: "Okamura", base: 32e6 },
        { brand: "Interstuhl", base: 18e6 }
      ],
      [
        { label: "nh\u1EF1a", factor: 0.5, chairKind: "plastic", tone: "#d7d2c8" },
        { label: "gaming v\u1EA3i", factor: 1, chairKind: "gaming", tone: "#2c2a28" },
        { label: "gaming da", factor: 1.3, chairKind: "gaming", tone: "#1c1b19" },
        { label: "l\u01B0\u1EDBi", factor: 1.6, chairKind: "ergo", tone: "#3d4a48" },
        { label: "da c\xF4ng th\xE1i", factor: 2, chairKind: "ergo", tone: "#4a3024" }
      ],
      { id: "chair", category: "chair", rareAt: 4e6, epicAt: 12e6, legendAt: 24e6, tone: "#3d4a48", blurb: (v) => `Gh\u1EBF ${v}.` }
    )
  ];
  var PC = [
    ...branded(
      [
        { brand: "Xigmatek", base: 48e4 },
        { brand: "Jetek", base: 56e4 },
        { brand: "Kenoo", base: 65e4 },
        { brand: "Segotep", base: 78e4 },
        { brand: "Montech", base: 105e4 },
        { brand: "Deepcool", base: 145e4 },
        { brand: "Corsair", base: 21e5 },
        { brand: "NZXT", base: 28e5 },
        { brand: "Fractal", base: 36e5 },
        { brand: "Lian Li", base: 48e5 }
      ],
      [
        { label: "ITX", factor: 0.9 },
        { label: "mATX", factor: 0.95 },
        { label: "Mid", factor: 1 },
        { label: "Full", factor: 1.3 },
        { label: "Panorama", factor: 1.55 }
      ],
      { id: "case", category: "pc_case", rareAt: 12e5, epicAt: 28e5, legendAt: 5e6, tone: "#8a8175", blurb: (v) => `Case ${v}.` }
    ),
    ...branded(
      [
        { brand: "Onda", base: 14e5 },
        { brand: "Colorful", base: 17e5 },
        { brand: "Biostar", base: 2e6 },
        { brand: "Maxsun", base: 23e5 },
        { brand: "ASRock", base: 28e5 },
        { brand: "MSI", base: 36e5 },
        { brand: "Gigabyte", base: 44e5 },
        { brand: "ASUS", base: 56e5 },
        { brand: "ASRock Taichi", base: 72e5 },
        { brand: "ASUS ROG", base: 9e6 }
      ],
      [
        { label: "B ITX", factor: 0.85 },
        { label: "B mATX", factor: 0.9 },
        { label: "B ATX", factor: 1 },
        { label: "X ATX", factor: 1.25 },
        { label: "Z E-ATX", factor: 1.45 }
      ],
      { id: "mb", category: "motherboard", rareAt: 28e5, epicAt: 55e5, legendAt: 85e5, tone: "#2f6b45", blurb: () => "Mainboard." }
    ),
    ...branded(
      [
        { brand: "Intel Core 3", base: 22e5 },
        { brand: "AMD Ryzen 3", base: 24e5 },
        { brand: "Intel Core 5", base: 42e5 },
        { brand: "AMD Ryzen 5", base: 46e5 },
        { brand: "Intel Core 7", base: 75e5 },
        { brand: "AMD Ryzen 7", base: 82e5 },
        { brand: "Intel Core 9", base: 13e6 },
        { brand: "AMD Ryzen 9", base: 14e6 },
        { brand: "AMD X3D", base: 165e5 },
        { brand: "Intel KS", base: 18e6 }
      ],
      [
        { label: "6 nh\xE2n", factor: 0.85 },
        { label: "8 nh\xE2n", factor: 1 },
        { label: "12 nh\xE2n", factor: 1.15 },
        { label: "16 nh\xE2n", factor: 1.3 },
        { label: "24 nh\xE2n", factor: 1.5 }
      ],
      { id: "cpu", category: "cpu", rareAt: 45e5, epicAt: 9e6, legendAt: 16e6, tone: "#c9c2b4", blurb: (v) => v }
    ),
    ...branded(
      [
        { brand: "Intel Arc", base: 32e5 },
        { brand: "AMD RX", base: 55e5 },
        { brand: "Intel Arc B", base: 65e5 },
        { brand: "AMD RX XT", base: 9e6 },
        { brand: "NVIDIA 60", base: 85e5 },
        { brand: "NVIDIA 70", base: 16e6 },
        { brand: "AMD RX XTX", base: 18e6 },
        { brand: "NVIDIA 80", base: 28e6 },
        { brand: "NVIDIA 90", base: 48e6 },
        { brand: "NVIDIA Titan", base: 7e7 }
      ],
      [
        { label: "8GB", factor: 0.85 },
        { label: "12GB", factor: 1 },
        { label: "16GB", factor: 1.15 },
        { label: "24GB", factor: 1.35 },
        { label: "32GB", factor: 1.6 }
      ],
      { id: "gpu", category: "gpu", rareAt: 8e6, epicAt: 2e7, legendAt: 4e7, tone: "#3c4654", blurb: (v) => v }
    ),
    ...branded(
      [
        { brand: "Klevv", base: 9e5 },
        { brand: "Kingston", base: 11e5 },
        { brand: "TeamGroup", base: 13e5 },
        { brand: "Patriot", base: 15e5 },
        { brand: "Corsair", base: 19e5 },
        { brand: "G.Skill", base: 24e5 },
        { brand: "Kingston Fury", base: 28e5 },
        { brand: "Corsair Dominator", base: 36e5 },
        { brand: "G.Skill Royal", base: 44e5 },
        { brand: "G.Skill Extreme", base: 55e5 }
      ],
      [
        { label: "16GB", factor: 0.7 },
        { label: "32GB", factor: 1 },
        { label: "48GB", factor: 1.3 },
        { label: "64GB", factor: 1.6 },
        { label: "96GB", factor: 2.1 }
      ],
      { id: "ram", category: "ram", rareAt: 18e5, epicAt: 35e5, legendAt: 6e6, tone: "#243e5a", blurb: () => "DDR5." }
    ),
    ...branded(
      [
        { brand: "Kingston", base: 9e5 },
        { brand: "Crucial", base: 11e5 },
        { brand: "WD", base: 14e5 },
        { brand: "Seagate", base: 16e5 },
        { brand: "Lexar", base: 19e5 },
        { brand: "Samsung", base: 24e5 },
        { brand: "WD Black", base: 32e5 },
        { brand: "Samsung Pro", base: 42e5 },
        { brand: "Sabrent", base: 55e5 },
        { brand: "Solidigm", base: 7e6 }
      ],
      [
        { label: "SATA 1TB", factor: 0.7 },
        { label: "NVMe Gen3 1TB", factor: 0.9 },
        { label: "NVMe Gen4 2TB", factor: 1.5 },
        { label: "NVMe Gen5 2TB", factor: 2.4 },
        { label: "NVMe Gen5 4TB", factor: 3.6 }
      ],
      { id: "ssd", category: "storage", rareAt: 2e6, epicAt: 5e6, legendAt: 12e6, tone: "#5c6168", blurb: (v) => v }
    ),
    ...branded(
      [
        { brand: "Xigmatek", base: 7e5 },
        { brand: "Jetek", base: 85e4 },
        { brand: "Deepcool", base: 12e5 },
        { brand: "Cooler Master", base: 16e5 },
        { brand: "Corsair", base: 22e5 },
        { brand: "MSI", base: 26e5 },
        { brand: "Seasonic", base: 34e5 },
        { brand: "Super Flower", base: 42e5 },
        { brand: "Corsair HX", base: 55e5 },
        { brand: "Seasonic Prime", base: 7e6 }
      ],
      [
        { label: "550W", factor: 0.8 },
        { label: "650W", factor: 0.95 },
        { label: "750W", factor: 1.1 },
        { label: "1000W", factor: 1.45 },
        { label: "1600W", factor: 2 }
      ],
      { id: "psu", category: "psu", rareAt: 16e5, epicAt: 35e5, legendAt: 6e6, tone: "#242424", blurb: (v) => v }
    ),
    ...branded(
      [
        { brand: "ID-Cooling", base: 35e4 },
        { brand: "Jonsbo", base: 5e5 },
        { brand: "Deepcool", base: 75e4 },
        { brand: "Thermalright", base: 9e5 },
        { brand: "Arctic", base: 13e5 },
        { brand: "Corsair", base: 19e5 },
        { brand: "NZXT", base: 26e5 },
        { brand: "Lian Li", base: 34e5 },
        { brand: "Noctua", base: 28e5 },
        { brand: "EK", base: 65e5 }
      ],
      [
        { label: "th\xE1p", factor: 0.7 },
        { label: "low profile", factor: 0.85 },
        { label: "240", factor: 1 },
        { label: "360", factor: 1.35 },
        { label: "420", factor: 1.6 }
      ],
      { id: "cool", category: "cooler", rareAt: 9e5, epicAt: 22e5, legendAt: 45e5, tone: "#7ea2c4", blurb: (v) => v }
    ),
    ...branded(
      [
        { brand: "Xigmatek", base: 8e4 },
        { brand: "ID-Cooling", base: 12e4 },
        { brand: "Deepcool", base: 18e4 },
        { brand: "Thermalright", base: 25e4 },
        { brand: "Arctic", base: 35e4 },
        { brand: "Corsair", base: 5e5 },
        { brand: "Lian Li", base: 7e5 },
        { brand: "Noctua", base: 85e4 },
        { brand: "Phanteks", base: 65e4 },
        { brand: "Noctua Chromax", base: 11e5 }
      ],
      [
        { label: "92", factor: 0.8 },
        { label: "120", factor: 1 },
        { label: "140", factor: 1.25 },
        { label: "RGB", factor: 1.4 },
        { label: "180", factor: 1.8 }
      ],
      { id: "fan", category: "fan", rareAt: 25e4, epicAt: 6e5, legendAt: 1e6, tone: "#d7d2c8", blurb: (v) => `${v} mm ho\u1EB7c ki\u1EC3u.` }
    ),
    ...branded(
      [
        { brand: "Cooler Master", base: 6e4 },
        { brand: "Gelid", base: 9e4 },
        { brand: "Arctic", base: 12e4 },
        { brand: "Corsair", base: 16e4 },
        { brand: "Noctua", base: 22e4 },
        { brand: "Thermalright", base: 28e4 },
        { brand: "Prolimatech", base: 35e4 },
        { brand: "Thermal Grizzly", base: 45e4 },
        { brand: "Kingpin", base: 7e5 },
        { brand: "Honeywell", base: 9e5 }
      ],
      [
        { label: "1g", factor: 0.7 },
        { label: "2g", factor: 1 },
        { label: "4g", factor: 1.4 },
        { label: "8g", factor: 1.9 },
        { label: "t\u1EA5m", factor: 2.2 }
      ],
      { id: "paste", category: "paste", rareAt: 18e4, epicAt: 4e5, legendAt: 8e5, tone: "#c9a15a", blurb: () => "B\xF4i gi\u1EEFa CPU v\xE0 t\u1EA3n." }
    ),
    ...branded(
      [
        { brand: "EZDIY", base: 25e4 },
        { brand: "Upright", base: 35e4 },
        { brand: "Thermaltake", base: 5e5 },
        { brand: "Cooler Master", base: 7e5 },
        { brand: "Phanteks", base: 9e5 },
        { brand: "Lian Li", base: 14e5 },
        { brand: "LINKUP", base: 18e5 },
        { brand: "CableMod", base: 22e5 },
        { brand: "LINKUP Gen5", base: 28e5 },
        { brand: "Lian Li Gen5", base: 34e5 }
      ],
      [
        { label: "Gen3", factor: 0.7 },
        { label: "Gen4", factor: 1 },
        { label: "Gen4 m\u1EC1m", factor: 1.2 },
        { label: "Gen5", factor: 1.6 },
        { label: "Gen5 \u0111\xF4i", factor: 2 }
      ],
      { id: "riser", category: "riser", rareAt: 8e5, epicAt: 18e5, legendAt: 3e6, tone: "#3c4654", blurb: () => "D\u1EF1ng GPU d\u1ECDc." }
    ),
    ...branded(
      [
        { brand: "Jonsbo", base: 8e4 },
        { brand: "EZDIY", base: 12e4 },
        { brand: "Deepcool", base: 18e4 },
        { brand: "Cooler Master", base: 25e4 },
        { brand: "ASUS", base: 35e4 },
        { brand: "Lian Li", base: 45e4 },
        { brand: "Thermaltake", base: 6e5 },
        { brand: "Phanteks", base: 8e5 },
        { brand: "CableMod", base: 11e5 },
        { brand: "Lian Li k\xEDnh", base: 15e5 }
      ],
      [
        { label: "nh\u1EF1a", factor: 0.8 },
        { label: "nh\xF4m", factor: 1 },
        { label: "nam ch\xE2m", factor: 1.3 },
        { label: "ARGB", factor: 1.5 },
        { label: "d\u1ECDc", factor: 1.8 }
      ],
      { id: "bracket", category: "bracket", rareAt: 25e4, epicAt: 7e5, legendAt: 12e5, tone: "#8d9094", blurb: () => "\u0110\u1EE1 GPU kh\u1ECFi v\xF5ng." }
    ),
    ...branded(
      [
        { brand: "ID-Cooling", base: 15e4 },
        { brand: "Arctic", base: 25e4 },
        { brand: "Deepcool", base: 35e4 },
        { brand: "Thermalright", base: 45e4 },
        { brand: "Cooler Master", base: 6e5 },
        { brand: "Corsair", base: 9e5 },
        { brand: "Phanteks", base: 12e5 },
        { brand: "NZXT", base: 15e5 },
        { brand: "Lian Li", base: 18e5 },
        { brand: "Aquacomputer", base: 28e5 }
      ],
      [
        { label: "4 qu\u1EA1t", factor: 0.8 },
        { label: "6 qu\u1EA1t", factor: 1 },
        { label: "8 qu\u1EA1t", factor: 1.25 },
        { label: "ARGB", factor: 1.4 },
        { label: "PWM ARGB", factor: 1.7 }
      ],
      { id: "hub", category: "hub", rareAt: 4e5, epicAt: 12e5, legendAt: 22e5, tone: "#2a2722", blurb: () => "Gom qu\u1EA1t v\u1EC1 m\u1ED9t d\xE2y." }
    ),
    ...branded(
      [
        { brand: "EZDIY", base: 2e5 },
        { brand: "Asiahorse", base: 35e4 },
        { brand: "FormulaMod", base: 5e5 },
        { brand: "Thermaltake", base: 7e5 },
        { brand: "Cooler Master", base: 9e5 },
        { brand: "Corsair", base: 14e5 },
        { brand: "Lian Li", base: 18e5 },
        { brand: "CableMod", base: 24e5 },
        { brand: "Lian Li Strimer", base: 32e5 },
        { brand: "CableMod Pro", base: 45e5 }
      ],
      [
        { label: "24 pin", factor: 0.8 },
        { label: "CPU 8 pin", factor: 0.7 },
        { label: "GPU 8 pin", factor: 1 },
        { label: "12VHPWR", factor: 1.4 },
        { label: "b\u1ED9 \u0111\u1EE7", factor: 1.8 }
      ],
      { id: "sleeve", category: "sleeve", rareAt: 6e5, epicAt: 18e5, legendAt: 35e5, tone: "#c9a15a", blurb: () => "D\xE2y b\u1ECDc nh\xECn t\u1EEB h\xF4ng case." }
    ),
    ...branded(
      [
        { brand: "Vention", base: 25e4 },
        { brand: "Creative", base: 6e5 },
        { brand: "ASUS", base: 12e5 },
        { brand: "EVGA", base: 16e5 },
        { brand: "Creative AE", base: 24e5 },
        { brand: "Schiit", base: 35e5 },
        { brand: "FiiO", base: 45e5 },
        { brand: "RME", base: 12e6 },
        { brand: "Gustard", base: 16e6 },
        { brand: "Lynx", base: 28e6 }
      ],
      [
        { label: "USB", factor: 0.8 },
        { label: "PCIe", factor: 1 },
        { label: "5.1", factor: 1.2 },
        { label: "7.1", factor: 1.5 },
        { label: "DAC", factor: 1.8 }
      ],
      { id: "sound", category: "sound_card", rareAt: 15e5, epicAt: 5e6, legendAt: 15e6, tone: "#243e5a", blurb: () => "\xC2m thanh r\u1EDDi." }
    ),
    ...branded(
      [
        { brand: "Mercusys", base: 2e5 },
        { brand: "TP-Link", base: 35e4 },
        { brand: "D-Link", base: 45e4 },
        { brand: "Tenda", base: 3e5 },
        { brand: "Intel", base: 7e5 },
        { brand: "ASUS", base: 11e5 },
        { brand: "Killer", base: 16e5 },
        { brand: "ASUS WiFi 7", base: 22e5 },
        { brand: "TP-Link 10GbE", base: 35e5 },
        { brand: "Intel 10GbE", base: 45e5 }
      ],
      [
        { label: "WiFi 5", factor: 0.7 },
        { label: "WiFi 6", factor: 1 },
        { label: "WiFi 6E", factor: 1.3 },
        { label: "WiFi 7", factor: 1.6 },
        { label: "2.5GbE", factor: 1.4 }
      ],
      { id: "nic", category: "nic", rareAt: 6e5, epicAt: 18e5, legendAt: 35e5, tone: "#1d4d32", blurb: () => "M\u1EA1ng r\u1EDDi khi main kh\xF4ng c\xF3." }
    ),
    ...branded(
      [
        { brand: "Lite-On", base: 35e4 },
        { brand: "Asus", base: 5e5 },
        { brand: "LG", base: 7e5 },
        { brand: "Pioneer", base: 12e5 },
        { brand: "Plextor", base: 18e5 },
        { brand: "LG slim", base: 9e5 },
        { brand: "Pioneer UHD", base: 24e5 },
        { brand: "LG UHD", base: 32e5 },
        { brand: "Pioneer internal", base: 15e5 },
        { brand: "Buffalo", base: 2e6 }
      ],
      [
        { label: "DVD USB", factor: 0.8 },
        { label: "DVD g\u1EAFn trong", factor: 1 },
        { label: "Blu-ray", factor: 1.6 },
        { label: "UHD", factor: 2.2 },
        { label: "ghi \u0111\u0129a", factor: 1.3 }
      ],
      { id: "optical", category: "optical", rareAt: 8e5, epicAt: 2e6, legendAt: 35e5, tone: "#c5c8cc", blurb: () => "\u0110\u1ECDc \u0111\u0129a. \xCDt b\xE0n c\xF2n g\u1EAFn." }
    ),
    ...branded(
      [
        { brand: "Bykski", base: 8e5 },
        { brand: "Barrow", base: 1e6 },
        { brand: "Alphacool", base: 18e5 },
        { brand: "Corsair", base: 24e5 },
        { brand: "EK", base: 32e5 },
        { brand: "Watercool", base: 45e5 },
        { brand: "Optimus", base: 7e6 },
        { brand: "Heatkiller", base: 85e5 },
        { brand: "EK Quantum", base: 55e5 },
        { brand: "Optimus Signature", base: 12e6 }
      ],
      [
        { label: "\u0111\u1ED3ng", factor: 0.9 },
        { label: "niken", factor: 1.1 },
        { label: "acrylic", factor: 1.2 },
        { label: "acetal", factor: 1.3 },
        { label: "limited", factor: 1.6 }
      ],
      { id: "cblock", category: "cpu_block", rareAt: 2e6, epicAt: 5e6, legendAt: 9e6, tone: "#7ea2c4", blurb: () => "Block n\u01B0\u1EDBc cho CPU. Thay t\u1EA3n kh\xED." }
    ),
    ...branded(
      [
        { brand: "Bykski", base: 12e5 },
        { brand: "Barrow", base: 15e5 },
        { brand: "Alphacool", base: 28e5 },
        { brand: "Corsair", base: 36e5 },
        { brand: "EK", base: 5e6 },
        { brand: "Watercool", base: 7e6 },
        { brand: "EK Quantum", base: 85e5 },
        { brand: "Heatkiller", base: 11e6 },
        { brand: "Optimus", base: 14e6 },
        { brand: "Optimus Signature", base: 2e7 }
      ],
      [
        { label: "\u0111\u1ED3ng", factor: 0.9 },
        { label: "niken", factor: 1.1 },
        { label: "acrylic", factor: 1.25 },
        { label: "acetal", factor: 1.35 },
        { label: "active back", factor: 1.7 }
      ],
      { id: "gblock", category: "gpu_block", rareAt: 3e6, epicAt: 8e6, legendAt: 14e6, tone: "#3c4654", blurb: () => "Block n\u01B0\u1EDBc cho GPU." }
    ),
    ...branded(
      [
        { brand: "Bykski", base: 7e5 },
        { brand: "Barrow", base: 9e5 },
        { brand: "Freezemod", base: 11e5 },
        { brand: "Alphacool", base: 22e5 },
        { brand: "Corsair", base: 28e5 },
        { brand: "EK", base: 38e5 },
        { brand: "Aquacomputer", base: 65e5 },
        { brand: "Watercool", base: 8e6 },
        { brand: "EK Quantum", base: 55e5 },
        { brand: "Aquacomputer Ultitube", base: 12e6 }
      ],
      [
        { label: "DDC", factor: 0.9 },
        { label: "D5", factor: 1.2 },
        { label: "b\u01A1m + b\xECnh", factor: 1.5 },
        { label: "distro", factor: 1.8 },
        { label: "c\xF3 m\xE0n", factor: 2 }
      ],
      { id: "pump", category: "pump", rareAt: 15e5, epicAt: 4e6, legendAt: 8e6, tone: "#1e3a46", blurb: () => "\u0110\u1EA9y n\u01B0\u1EDBc trong loop." }
    ),
    ...branded(
      [
        { brand: "Bykski", base: 6e5 },
        { brand: "Barrow", base: 8e5 },
        { brand: "XSPC", base: 12e5 },
        { brand: "Corsair", base: 16e5 },
        { brand: "Alphacool", base: 2e6 },
        { brand: "EK", base: 26e5 },
        { brand: "Hardware Labs", base: 34e5 },
        { brand: "Watercool", base: 42e5 },
        { brand: "Hardware Labs GTX", base: 5e6 },
        { brand: "Alphacool Monsta", base: 65e5 }
      ],
      [
        { label: "120", factor: 0.6 },
        { label: "240", factor: 1 },
        { label: "280", factor: 1.15 },
        { label: "360", factor: 1.35 },
        { label: "420", factor: 1.6 }
      ],
      { id: "rad", category: "radiator", rareAt: 12e5, epicAt: 3e6, legendAt: 55e5, tone: "#2a2722", blurb: () => "T\u1EA3n nhi\u1EC7t n\u01B0\u1EDBc. C\u1EA7n qu\u1EA1t ri\xEAng." }
    ),
    ...branded(
      [
        { brand: "Bykski", base: 25e4 },
        { brand: "Barrow", base: 35e4 },
        { brand: "XSPC", base: 5e5 },
        { brand: "Corsair", base: 7e5 },
        { brand: "EK", base: 9e5 },
        { brand: "Alphacool", base: 11e5 },
        { brand: "Mayhems", base: 14e5 },
        { brand: "Bitspower", base: 18e5 },
        { brand: "EK Quantum", base: 24e5 },
        { brand: "Bitspower deluxe", base: 32e5 }
      ],
      [
        { label: "\u1ED1ng m\u1EC1m", factor: 0.8 },
        { label: "PETG", factor: 1 },
        { label: "acrylic", factor: 1.2 },
        { label: "fitting 6", factor: 1.4 },
        { label: "fitting 10", factor: 1.8 }
      ],
      { id: "tube", category: "tube", rareAt: 6e5, epicAt: 15e5, legendAt: 28e5, tone: "#d5dde4", blurb: () => "\u1ED0ng v\xE0 \u0111\u1EA7u n\u1ED1i loop." }
    )
  ];
  var layouts = [
    { id: "60", rarity: "common", name: "Block 60" },
    { id: "65", rarity: "rare", name: "Slab 65" },
    { id: "75", rarity: "rare", name: "Rail 75" },
    { id: "tkl", rarity: "epic", name: "Tenkey" },
    { id: "full", rarity: "rare", name: "Board 100" },
    { id: "alice", rarity: "legendary", name: "Alice" },
    { id: "alice67", rarity: "epic", name: "Alice 67" },
    { id: "alice_f", rarity: "epic", name: "Alice F" },
    { id: "split", rarity: "rare", name: "Split" },
    { id: "split_alice", rarity: "legendary", name: "Split Alice" }
  ];
  var PLATES = [
    { material: "plastic", rarity: "common", name: "nh\u1EF1a", tone: "#d7d2c8", blurb: "Plate nh\u1EF1a, \xEAm, r\u1EBB." },
    { material: "cnc", rarity: "rare", name: "CNC", tone: "#c9a15a", blurb: "Plate CNC nh\xF4m, ch\u1EAFc, k\xEAu r\xF5." },
    { material: "titanium", rarity: "legendary", name: "titan", tone: "#d5dde4", blurb: "Plate titan, nh\u1EB9, c\u1EE9ng." }
  ];
  var CASE_VARIANTS = [
    { kind: "mechanical", material: "plastic", rarity: "common", label: "c\u01A1 nh\u1EF1a", tone: "#d7d2c8" },
    { kind: "mechanical", material: "aluminum", rarity: "rare", label: "c\u01A1 nh\xF4m", tone: "#8d8478" },
    { kind: "he", material: "plastic", rarity: "rare", label: "HE nh\u1EF1a", tone: "#7ea2c4" },
    { kind: "he", material: "aluminum", rarity: "epic", label: "HE nh\xF4m", tone: "#c9a15a" }
  ];
  var LAYOUT_FACTOR = {
    "60": 0.75,
    "65": 0.85,
    "75": 1,
    tkl: 1.15,
    full: 1.3,
    alice: 1.55,
    alice67: 1.7,
    alice_f: 1.75,
    split: 1.45,
    split_alice: 1.9
  };
  var KB_CASE_BRAND = {
    mechanical: {
      plastic: ["Ajazz", "RK", "Redragon", "Akko", "Epomaker", "Keychron", "Akko", "RK", "Ajazz", "Keychron"],
      aluminum: ["Keychron", "Monsgeek", "NuPhy", "QK", "KBDfans", "Geon", "Mode", "TGR", "KBDfans", "Mode"]
    },
    he: {
      plastic: ["Akko", "Epomaker", "Keychron", "DrunkDeer", "Melgeek", "Wooting", "Keychron", "DrunkDeer", "Akko", "Wooting"],
      aluminum: ["Keychron", "DrunkDeer", "Melgeek", "KBDfans", "Wooting", "Geon", "Mode", "TGR", "Wooting", "Mode"]
    }
  };
  var KB_CASE_BASE = { mechanical: { plastic: 65e4, aluminum: 24e5 }, he: { plastic: 26e5, aluminum: 52e5 } };
  var PCB_BRAND = {
    mechanical: ["YMDK", "Akko", "KBDfans", "JLC", "YMDK", "Akko", "KBDfans", "QK", "Geon", "KBDfans"],
    he: ["Gateron", "Akko", "Keychron", "DrunkDeer", "Wooting", "Gateron", "Keychron", "Wooting", "DrunkDeer", "Wooting"]
  };
  var PLATE_BRAND = { plastic: "YMDK", cnc: "KBDfans", titanium: "Mode" };
  var PLATE_BASE = { plastic: 12e4, cnc: 7e5, titanium: 22e5 };
  var KB = layouts.flatMap((layout, index) => {
    const factor = LAYOUT_FACTOR[layout.id];
    return [
      ...CASE_VARIANTS.map((variant) => {
        const price = Math.round(KB_CASE_BASE[variant.kind][variant.material] * factor);
        const brand = KB_CASE_BRAND[variant.kind][variant.material][index] ?? "Keychron";
        return item({
          id: `kb_case_${variant.kind}_${variant.material}_${layout.id}`,
          name: `${brand} ${layout.name} ${variant.label}`,
          category: "kb_case",
          rarity: priceTier(price, 15e5, 32e5, 6e6),
          layout: layout.id,
          kbKind: variant.kind,
          caseMaterial: variant.material,
          brand,
          price,
          tone: variant.tone,
          blurb: `V\u1ECF ${variant.label}, layout ${LAYOUT_LABEL[layout.id]}.`
        });
      }),
      item({
        id: `kb_pcb_mechanical_${layout.id}`,
        name: `${PCB_BRAND.mechanical[index]} m\u1EA1ch c\u01A1 ${LAYOUT_LABEL[layout.id]}`,
        category: "kb_pcb",
        rarity: priceTier(Math.round(35e4 * factor), 5e5, 9e5, 14e5),
        layout: layout.id,
        kbKind: "mechanical",
        brand: PCB_BRAND.mechanical[index],
        price: Math.round(35e4 * factor),
        tone: "#1d4d32",
        blurb: `M\u1EA1ch c\u01A1 kh\u1EDBp ${LAYOUT_LABEL[layout.id]}. Kh\xF4ng l\u1EAFp switch HE.`
      }),
      item({
        id: `kb_pcb_he_${layout.id}`,
        name: `${PCB_BRAND.he[index]} m\u1EA1ch HE ${LAYOUT_LABEL[layout.id]}`,
        category: "kb_pcb",
        rarity: priceTier(Math.round(14e5 * factor), 18e5, 28e5, 4e6),
        layout: layout.id,
        kbKind: "he",
        brand: PCB_BRAND.he[index],
        price: Math.round(14e5 * factor),
        tone: "#1e3a46",
        blurb: `M\u1EA1ch Hall Effect kh\u1EDBp ${LAYOUT_LABEL[layout.id]}. Ch\u1EC9 nh\u1EADn switch HE.`
      }),
      ...PLATES.map((plate) => {
        const price = Math.round(PLATE_BASE[plate.material] * factor);
        const brand = PLATE_BRAND[plate.material];
        return item({
          id: `plate_${plate.material}_${layout.id}`,
          name: `${brand} plate ${plate.name} ${LAYOUT_LABEL[layout.id]}`,
          category: "plate",
          rarity: priceTier(price, 4e5, 12e5, 25e5),
          layout: layout.id,
          plateMaterial: plate.material,
          brand,
          price,
          tone: plate.tone,
          blurb: `${plate.blurb} Ch\u1EC9 v\u1EEBa layout ${LAYOUT_LABEL[layout.id]}.`
        });
      })
    ];
  });
  var FEELS = ["linear", "tactile"];
  var SOUNDS = ["thocky", "creamy", "silent"];
  var SOUND_NAMES = {
    thocky: ["Ink", "Coal", "Deep", "Bass", "Oak", "Drum", "Void", "Abyss", "Brick", "Stone", "Slate", "Ember", "Forge", "Flint", "Iron", "Steel", "Thock", "Thump", "Rumble", "Pitch", "Soot", "Char", "Cinder", "Hollow", "Core", "Knock", "Clack", "Ash"],
    creamy: ["Milk", "Foam", "Butter", "Custard", "Silk", "Velvet", "Cloud", "Pearl", "Cream", "Vanilla", "Malt", "Cocoa", "Toffee", "Caramel", "Honey", "Wax", "Plush", "Bud", "Petal", "Syrup", "Nectar", "Gold", "Pop", "Bloom", "Seed", "Ivory", "Down", "Pad"],
    silent: ["Hush", "Quiet", "Mute", "Soft", "Whisper", "Linen", "Ghost", "Mist", "Felt", "Moss", "Wool", "Shadow", "Feather", "Cotton", "Calm", "Still", "Haze", "Fog", "Baffle", "Muffle", "Dampen", "Reed", "Sage", "Fern", "Lake", "Breeze", "Night", "Dawn"]
  };
  var FEEL_NAME = { linear: "Linear", tactile: "Tactile" };
  function switchTone(feel, sound, index) {
    const bases = {
      thocky: ["#1a1a1a", "#2b2b2b", "#3a2e24", "#5c4030", "#4a3428", "#0e0e0e"],
      creamy: ["#f3ead7", "#f0d9a0", "#f7f1e4", "#ead9c4", "#fbfaf6", "#f8f4ee"],
      silent: ["#8d9094", "#6e7378", "#c5c8cc", "#d4d0c8", "#d5e2ee", "#4a5560"]
    };
    const pool = bases[sound] ?? bases.thocky;
    return pool[(index + (feel === "tactile" ? 2 : 0)) % pool.length];
  }
  var SWITCH_DEFS = [];
  var MECH_BRANDS = [
    { brand: "Outemu", price: 4e3 },
    { brand: "KTT", price: 5e3 },
    { brand: "Huano", price: 6e3 },
    { brand: "Ajazz", price: 7e3 },
    { brand: "Redragon", price: 8e3 },
    { brand: "RK", price: 9e3 },
    { brand: "Akko", price: 12e3 },
    { brand: "CIY", price: 13e3 },
    { brand: "MMD", price: 14e3 },
    { brand: "TTC", price: 16e3 },
    { brand: "Gateron", price: 18e3 },
    { brand: "Kailh", price: 22e3 },
    { brand: "Epomaker", price: 24e3 },
    { brand: "Durock", price: 26e3 },
    { brand: "WS", price: 28e3 },
    { brand: "HMX", price: 3e4 },
    { brand: "BSUN", price: 32e3 },
    { brand: "Momoka", price: 34e3 },
    { brand: "Cherry", price: 38e3 },
    { brand: "Tecsee", price: 42e3 },
    { brand: "SP-Star", price: 46e3 },
    { brand: "JWK", price: 5e4 },
    { brand: "Owlab", price: 55e3 },
    { brand: "Invokeys", price: 62e3 },
    { brand: "Geon", price: 7e4 },
    { brand: "Mode", price: 78e3 },
    { brand: "Zeal", price: 9e4 },
    { brand: "NovelKeys", price: 11e4 }
  ];
  var HE_BRANDS = [
    { brand: "Akko", price: 22e3 },
    { brand: "Gateron", price: 28e3 },
    { brand: "Keychron", price: 34e3 },
    { brand: "DrunkDeer", price: 42e3 },
    { brand: "Wooting", price: 58e3 },
    { brand: "Razer", price: 75e3 }
  ];
  var MECH_PER_CELL = MECH_BRANDS.length;
  var HE_PER_CELL = HE_BRANDS.length;
  for (const feel of FEELS) {
    for (const sound of SOUNDS) {
      const names = SOUND_NAMES[sound];
      MECH_BRANDS.forEach((row, index) => {
        const word = names[index % names.length];
        SWITCH_DEFS.push({
          id: `sw_mech_${feel[0]}_${sound[0]}_${index}`,
          name: `${row.brand} ${FEEL_NAME[feel]} ${word}`,
          feel,
          sound,
          rarity: priceTier(row.price, 15e3, 35e3, 6e4),
          tone: switchTone(feel, sound, index),
          kbKind: "mechanical",
          brand: row.brand,
          price: row.price
        });
      });
      HE_BRANDS.forEach((row, index) => {
        const word = names[index % names.length];
        SWITCH_DEFS.push({
          id: `sw_he_${feel[0]}_${sound[0]}_${index}`,
          name: `${row.brand} HE ${FEEL_NAME[feel]} ${word}`,
          feel,
          sound,
          rarity: priceTier(row.price, 15e3, 35e3, 6e4),
          tone: switchTone(feel, sound, index + 3),
          kbKind: "he",
          brand: row.brand,
          price: row.price
        });
      });
    }
  }
  var SOUND_BLURB = {
    thocky: "ti\u1EBFng tr\u1EA7m, \u0111\u1EE5c",
    creamy: "ti\u1EBFng kem, m\u01B0\u1EE3t",
    silent: "ti\u1EBFng kh\u1EBD, im"
  };
  var SWITCHES = SWITCH_DEFS.map(
    (sw) => item({
      id: sw.id,
      name: `Switch ${sw.name}`,
      category: "switch",
      rarity: sw.rarity,
      feel: sw.feel,
      sound: sw.sound,
      kbKind: sw.kbKind,
      brand: sw.brand,
      price: sw.price,
      tone: sw.tone,
      blurb: `${sw.kbKind === "he" ? "HE" : "C\u01A1"}, ${sw.feel === "linear" ? "tuy\u1EBFn t\xEDnh" : "c\xF3 n\u1EA5c"}, ${SOUND_BLURB[sw.sound]}.`
    })
  );
  var GEAR = [
    ...lined(
      [
        { brand: "Rapoo", base: 15e4 },
        { brand: "Logitech", base: 5e5 },
        { brand: "Razer", base: 12e5 },
        { brand: "Pulsar", base: 18e5 },
        { brand: "Lamzu", base: 22e5 },
        { brand: "Zowie", base: 2e6 },
        { brand: "Endgame Gear", base: 26e5 },
        { brand: "Vaxee", base: 24e5 },
        { brand: "Finalmouse", base: 45e5 },
        { brand: "WLMouse", base: 55e5 }
      ],
      [
        { label: "v\u0103n ph\xF2ng", factor: 0.6, tone: "#d7d2c8" },
        { label: "c\xF4ng th\xE1i", factor: 0.9, tone: "#3d4a48" },
        { label: "\u0111\u1ED1i x\u1EE9ng", factor: 1, tone: "#1c1b19" },
        { label: "l\u1ED7", factor: 1.2, tone: "#f4efe6" },
        { label: "si\xEAu nh\u1EB9", factor: 1.5, tone: "#c9a15a" }
      ],
      { id: "mouse", category: "mouse", rareAt: 8e5, epicAt: 25e5, legendAt: 45e5, tone: "#1c1b19", blurb: () => "Chu\u1ED9t." }
    ),
    ...lined(
      [
        { brand: "Superlux", base: 7e5 },
        { brand: "Audio-Technica", base: 2e6 },
        { brand: "Beyerdynamic", base: 4e6 },
        { brand: "Sony", base: 6e6 },
        { brand: "Sennheiser", base: 8e6 },
        { brand: "Hifiman", base: 12e6 },
        { brand: "Meze", base: 16e6 },
        { brand: "Audeze", base: 28e6 },
        { brand: "Focal", base: 4e7 },
        { brand: "Dan Clark", base: 55e6 }
      ],
      [
        { label: "\u0111\xF3ng", factor: 0.8, tone: "#2a2722" },
        { label: "m\u1EDF", factor: 1, tone: "#6e5438" },
        { label: "m\xE0ng", factor: 1.6, tone: "#c9a15a" },
        { label: "studio", factor: 1.3, tone: "#1c1b19" },
        { label: "kh\xF4ng d\xE2y", factor: 1.2, tone: "#3d4a48" }
      ],
      { id: "hp", category: "headphone", rareAt: 3e6, epicAt: 12e6, legendAt: 3e7, tone: "#2a2722", blurb: () => "Headphone." }
    ),
    ...[
      { brand: "KZ", model: "1DD", price: 25e4, shell: "nh\u1EF1a", tune: "V" },
      { brand: "Tangzu", model: "1DD", price: 45e4, shell: "nh\u1EF1a", tune: "\u1EA5m" },
      { brand: "7Hz", model: "1DD", price: 55e4, shell: "kim lo\u1EA1i", tune: "trung t\xEDnh" },
      { brand: "Truthear", model: "1DD", price: 7e5, shell: "nh\u1EF1a", tune: "bass" },
      { brand: "Moondrop", model: "1DD", price: 9e5, shell: "kim lo\u1EA1i", tune: "trung t\xEDnh" },
      { brand: "Kiwi Ears", model: "lai", price: 14e5, shell: "nh\u1EF1a", tune: "\u1EA5m" },
      { brand: "Simgot", model: "1BA", price: 18e5, shell: "kim lo\u1EA1i", tune: "s\xE1ng" },
      { brand: "Letshuoer", model: "lai", price: 22e5, shell: "kim lo\u1EA1i", tune: "V" },
      { brand: "Moondrop", model: "planar", price: 28e5, shell: "kim lo\u1EA1i", tune: "s\xE1ng" },
      { brand: "Thieaudio", model: "tribrid", price: 45e5, shell: "nh\u1EF1a", tune: "\u1EA5m" },
      { brand: "Softears", model: "4BA", price: 6e6, shell: "nh\u1EF1a", tune: "trung t\xEDnh" },
      { brand: "Sony", model: "1DD", price: 75e5, shell: "nh\u1EF1a", tune: "\u1EA5m" },
      { brand: "Sennheiser", model: "1DD", price: 85e5, shell: "kim lo\u1EA1i", tune: "trung t\xEDnh" },
      { brand: "Campfire", model: "2BA", price: 12e6, shell: "kim lo\u1EA1i", tune: "\u1EA5m" },
      { brand: "Thieaudio", model: "EST", price: 16e6, shell: "nh\u1EF1a", tune: "s\xE1ng" },
      { brand: "64 Audio", model: "tribrid", price: 22e6, shell: "nh\u1EF1a", tune: "trung t\xEDnh" },
      { brand: "Empire Ears", model: "tribrid", price: 28e6, shell: "nh\u1EF1a", tune: "bass" },
      { brand: "Vision Ears", model: "EST", price: 35e6, shell: "custom", tune: "trung t\xEDnh" },
      { brand: "Unique Melody", model: "bone", price: 42e6, shell: "custom", tune: "\u1EA5m" },
      { brand: "64 Audio", model: "flagship", price: 55e6, shell: "custom", tune: "trung t\xEDnh" }
    ].map(
      (row, i) => item({
        id: `iem_${i}`,
        name: `${row.brand} ${row.model}`,
        category: "iem",
        rarity: priceTier(row.price, 15e5, 6e6, 2e7),
        brand: row.brand,
        price: row.price,
        tone: i % 2 ? "#243e5a" : "#1c1b19",
        blurb: `V\u1ECF ${row.shell}, \xE2m ${row.tune}.`
      })
    ),
    ...[
      { brand: "Apple", model: "dongle", price: 25e4 },
      { brand: "JCAlly", model: "dongle", price: 35e4 },
      { brand: "Moondrop", model: "dongle", price: 7e5 },
      { brand: "FiiO", model: "dongle", price: 12e5 },
      { brand: "iBasso", model: "dongle", price: 18e5 },
      { brand: "Qudelix", model: "b\u1ECF t\xFAi", price: 32e5 },
      { brand: "FiiO", model: "b\u1ECF t\xFAi", price: 4e6 },
      { brand: "Shanling", model: "b\u1ECF t\xFAi", price: 55e5 },
      { brand: "Topping", model: "\u0111\u1EC3 b\xE0n", price: 35e5 },
      { brand: "SMSL", model: "\u0111\u1EC3 b\xE0n", price: 45e5 },
      { brand: "Schiit", model: "\u0111\u1EC3 b\xE0n", price: 6e6 },
      { brand: "FiiO", model: "\u0111\u1EC3 b\xE0n", price: 8e6 },
      { brand: "RME", model: "\u0111\u1EC3 b\xE0n", price: 18e6 },
      { brand: "Gustard", model: "\u0111\u1EC3 b\xE0n", price: 22e6 },
      { brand: "Chord", model: "b\u1ECF t\xFAi", price: 12e6 },
      { brand: "Chord", model: "\u0111\u1EC3 b\xE0n", price: 35e6 },
      { brand: "Woo", model: "\u0111\xE8n", price: 28e6 },
      { brand: "Cayin", model: "\u0111\xE8n", price: 16e6 },
      { brand: "Hifiman", model: "dongle", price: 24e5 },
      { brand: "dCS", model: "\u0111\u1EC3 b\xE0n", price: 8e7 }
    ].map(
      (row, i) => item({
        id: `dac_${i}`,
        name: `${row.brand} ${row.model}`,
        category: "dac",
        rarity: priceTier(row.price, 2e6, 8e6, 2e7),
        brand: row.brand,
        price: row.price,
        tone: "#2a2722",
        blurb: row.model
      })
    ),
    ...[
      { brand: "Tripowin", mat: "\u0111\u1ED3ng", plug: "3.5", price: 25e4 },
      { brand: "Xinhs", mat: "\u0111\u1ED3ng", plug: "4.4", price: 4e5 },
      { brand: "Openheart", mat: "b\u1EA1c", plug: "3.5", price: 5e5 },
      { brand: "NiceHCK", mat: "lai", plug: "4.4", price: 7e5 },
      { brand: "Yongse", mat: "SPC", plug: "4.4", price: 9e5 },
      { brand: "Effect Audio", mat: "\u0111\u1ED3ng", plug: "4.4", price: 25e5 },
      { brand: "Effect Audio", mat: "b\u1EA1c", plug: "4.4", price: 45e5 },
      { brand: "Null Audio", mat: "OCC", plug: "4.4", price: 32e5 },
      { brand: "PLUSSOUND", mat: "\u0111\u1ED3ng", plug: "4.4", price: 6e6 },
      { brand: "PLUSSOUND", mat: "b\u1EA1c", plug: "2.5", price: 8e6 },
      { brand: "Eletech", mat: "lai", plug: "4.4", price: 7e6 },
      { brand: "Eletech", mat: "b\u1EA1c", plug: "4.4", price: 12e6 },
      { brand: "Brise", mat: "OCC", plug: "4.4", price: 9e6 },
      { brand: "Han Sound", mat: "\u0111\u1ED3ng", plug: "4.4", price: 5e6 },
      { brand: "Lavricables", mat: "b\u1EA1c", plug: "4.4", price: 14e6 },
      { brand: "PW Audio", mat: "\u0111\u1ED3ng", plug: "4.4", price: 18e6 },
      { brand: "PW Audio", mat: "b\u1EA1c", plug: "4.4", price: 28e6 },
      { brand: "Toxic Cables", mat: "litz", plug: "4.4", price: 1e7 },
      { brand: "Astral Acoustics", mat: "graphene", plug: "USB-C", price: 35e5 },
      { brand: "Beat Audio", mat: "b\u1EA1c", plug: "4.4", price: 22e6 }
    ].map(
      (row, i) => item({
        id: `cable_${i}`,
        name: `${row.brand} ${row.mat} ${row.plug}`,
        category: "cable",
        rarity: priceTier(row.price, 15e5, 6e6, 15e6),
        brand: row.brand,
        price: row.price,
        tone: row.mat === "b\u1EA1c" ? "#d5dde4" : "#b87333",
        blurb: `Jack ${row.plug}, l\xF5i ${row.mat}.`
      })
    ),
    ...[
      { brand: "KBear", kind: "silicone", size: "b\u1ED9 3", price: 4e4 },
      { brand: "Tangzu", kind: "silicone", size: "b\u1ED9 3", price: 8e4 },
      { brand: "Moondrop", kind: "silicone", size: "b\u1ED9 3", price: 12e4 },
      { brand: "SpinFit", kind: "v\xE0nh xo\xE1y", size: "b\u1ED9 3", price: 25e4 },
      { brand: "SpinFit", kind: "hai v\xE0nh", size: "b\u1ED9 3", price: 35e4 },
      { brand: "Comply", kind: "foam", size: "b\u1ED9 3", price: 3e5 },
      { brand: "Dekoni", kind: "foam", size: "b\u1ED9 3", price: 45e4 },
      { brand: "Azla", kind: "l\u1ED7 h\u1EB9p", size: "b\u1ED9 3", price: 5e5 },
      { brand: "Azla", kind: "l\u1ED7 r\u1ED9ng", size: "b\u1ED9 5", price: 65e4 },
      { brand: "Divinus", kind: "l\u1ED7 r\u1ED9ng", size: "b\u1ED9 3", price: 4e5 },
      { brand: "Final", kind: "silicone", size: "b\u1ED9 5", price: 2e5 },
      { brand: "Sony", kind: "silicone", size: "b\u1ED9 3", price: 18e4 },
      { brand: "Symbio", kind: "lai", size: "b\u1ED9 3", price: 7e5 },
      { brand: "JVC", kind: "v\xE0nh xo\xE1y", size: "b\u1ED9 3", price: 28e4 },
      { brand: "Eletech", kind: "silicone", size: "b\u1ED9 3", price: 9e5 },
      { brand: "Crystal", kind: "l\u1ECFng", size: "b\u1ED9 3", price: 55e4 },
      { brand: "Medical", kind: "y t\u1EBF", size: "b\u1ED9 3", price: 15e4 },
      { brand: "SpinFit", kind: "W1", size: "b\u1ED9 3", price: 48e4 },
      { brand: "Azla", kind: "Sedna", size: "b\u1ED9 3", price: 12e5 },
      { brand: "Divinus", kind: "Velvet", size: "b\u1ED9 5", price: 15e5 }
    ].map(
      (row, i) => item({
        id: `tips_${i}`,
        name: `${row.brand} ${row.kind} ${row.size}`,
        category: "eartips",
        rarity: priceTier(row.price, 25e4, 6e5, 11e5),
        brand: row.brand,
        price: row.price,
        tone: "#e7e4de",
        blurb: row.kind
      })
    )
  ];
  var SCREENS = [
    ...lined(
      [
        { brand: "AOC", base: 25e5 },
        { brand: "ViewSonic", base: 32e5 },
        { brand: "Acer", base: 38e5 },
        { brand: "Gigabyte", base: 55e5 },
        { brand: "MSI", base: 65e5 },
        { brand: "ASUS", base: 8e6 },
        { brand: "Dell", base: 9e6 },
        { brand: "LG", base: 11e6 },
        { brand: "Samsung", base: 14e6 },
        { brand: "Apple", base: 28e6 }
      ],
      [
        { label: "24 ph\u1EB3ng FHD", factor: 0.7, sizeIn: 24, curve: "flat", res: "FHD" },
        { label: "27 ph\u1EB3ng FHD", factor: 0.85, sizeIn: 27, curve: "flat", res: "FHD" },
        { label: "27 ph\u1EB3ng QHD", factor: 1.1, sizeIn: 27, curve: "flat", res: "QHD" },
        { label: "27 cong QHD", factor: 1.25, sizeIn: 27, curve: "curved", res: "QHD" },
        { label: "32 ph\u1EB3ng 4K", factor: 1.8, sizeIn: 32, curve: "flat", res: "4K" }
      ],
      { id: "mon", category: "monitor", rareAt: 6e6, epicAt: 14e6, legendAt: 25e6, tone: "#101416", blurb: (v) => v }
    ),
    ...lined(
      [
        { brand: "North Bayou", base: 35e4 },
        { brand: "HUANUO", base: 5e5 },
        { brand: "ErGear", base: 7e5 },
        { brand: "Invision", base: 9e5 },
        { brand: "AVLT", base: 14e5 },
        { brand: "Ergotron", base: 45e5 },
        { brand: "Humanscale", base: 7e6 },
        { brand: "Secretlab", base: 55e5 },
        { brand: "Flo", base: 85e5 },
        { brand: "Colebrook", base: 6e6 }
      ],
      [
        { label: "\u0111\u01A1n l\xF2 xo", factor: 0.7, armKind: "single" },
        { label: "\u0111\u01A1n kh\xED", factor: 1, armKind: "single" },
        { label: "\u0111\u01A1n n\u1EB7ng", factor: 1.3, armKind: "single" },
        { label: "\u0111\xF4i kh\xED", factor: 1.6, armKind: "dual" },
        { label: "\u0111\xF4i n\u1EB7ng", factor: 2, armKind: "dual" }
      ],
      { id: "arm", category: "arm", rareAt: 12e5, epicAt: 4e6, legendAt: 8e6, tone: "#8d9094", blurb: (v) => v.startsWith("\u0111\xF4i") ? "Hai m\xE0n." : "M\u1ED9t m\xE0n." }
    ),
    ...lined(
      [
        { brand: "Edifier", base: 8e5 },
        { brand: "Creative", base: 12e5 },
        { brand: "Audioengine", base: 4e6 },
        { brand: "PreSonus", base: 5e6 },
        { brand: "Kali", base: 7e6 },
        { brand: "Yamaha", base: 8e6 },
        { brand: "Adam", base: 12e6 },
        { brand: "Focal", base: 18e6 },
        { brand: "Genelec", base: 28e6 },
        { brand: "Neumann", base: 4e7 }
      ],
      [
        { label: "\u0111\u01A1n nh\u1ECF", factor: 0.6, speakerKind: "single", tone: "#2a2722" },
        { label: "\u0111\u01A1n k\u1EC7", factor: 0.9, speakerKind: "single", tone: "#6e5438" },
        { label: "c\u1EB7p nh\u1ECF", factor: 1, speakerKind: "pair", tone: "#2a2722" },
        { label: "c\u1EB7p k\u1EC7", factor: 1.4, speakerKind: "pair", tone: "#3a3834" },
        { label: "c\u1EB7p studio", factor: 1.8, speakerKind: "pair", tone: "#1c1b19" }
      ],
      { id: "spk", category: "speaker", rareAt: 3e6, epicAt: 12e6, legendAt: 25e6, tone: "#2a2722", blurb: (v) => v }
    ),
    ...lined(
      [
        { brand: "Xiaomi", base: 3e5 },
        { brand: "Baseus", base: 45e4 },
        { brand: "Quntis", base: 7e5 },
        { brand: "BenQ", base: 22e5 },
        { brand: "Elgato", base: 28e5 },
        { brand: "Dyson", base: 12e6 },
        { brand: "Flos", base: 8e6 },
        { brand: "Artemide", base: 14e6 },
        { brand: "Louis Poulsen", base: 18e6 },
        { brand: "Anglepoise", base: 6e6 }
      ],
      [
        { label: "b\xE0n", factor: 0.8, lightKind: "desk", tone: "#e0a24a" },
        { label: "k\u1EB9p", factor: 0.7, lightKind: "desk", tone: "#f2c572" },
        { label: "thanh m\xE0n", factor: 1, lightKind: "monitor", tone: "#f4efe6" },
        { label: "h\u1EAFt t\u01B0\u1EDDng", factor: 0.9, lightKind: "bias", tone: "#7ea2c4" },
        { label: "v\xF2m", factor: 1.6, lightKind: "desk", tone: "#c9a15a" }
      ],
      { id: "light", category: "light", rareAt: 15e5, epicAt: 6e6, legendAt: 14e6, tone: "#e0a24a", blurb: (v) => `\u0110\xE8n ${v}.` }
    )
  ];
  var MECHA = KITS.flatMap(
    (kit) => PARTS.map((part, index) => {
      const price = Math.round(kit.price * (0.7 + index * 0.06));
      return item({
        id: `${kit.id}_${part.id}`,
        name: `${kit.name} \xB7 ${part.label}`,
        category: "mecha_part",
        rarity: priceTier(price, 8e5, 25e5, 8e6),
        kitId: kit.id,
        part: part.id,
        brand: kit.brand,
        price,
        tone: kit.tone,
        blurb: `M\u1EA3nh ${part.label.toLowerCase()} c\u1EE7a m\xF4 h\xECnh ${kit.name} (${kit.brand}). \u0110\u1EE7 8 m\u1EA3nh m\u1EDBi tr\u01B0ng.`
      });
    })
  );
  var SURFACE = [
    ...branded(
      [
        { brand: "Fantech", base: 8e4 },
        { brand: "Dareu", base: 12e4 },
        { brand: "Pulsar", base: 4e5 },
        { brand: "Artisan", base: 12e5 },
        { brand: "LGG", base: 9e5 },
        { brand: "X-raypad", base: 7e5 },
        { brand: "Wallhack", base: 1e6 },
        { brand: "SteelSeries", base: 6e5 },
        { brand: "Razer", base: 5e5 },
        { brand: "Artisan Hien", base: 16e5 }
      ],
      [
        { label: "speed", factor: 0.9 },
        { label: "control", factor: 1 },
        { label: "glass", factor: 1.8 },
        { label: "deskmat", factor: 1.3 },
        { label: "XL", factor: 1.4 }
      ],
      { id: "pad", category: "mousepad", rareAt: 4e5, epicAt: 9e5, legendAt: 14e5, tone: "#2a2722", blurb: () => "M\u1EB7t b\xE0n d\u01B0\u1EDBi chu\u1ED9t." }
    ),
    ...branded(
      [
        { brand: "Ajazz", base: 15e4 },
        { brand: "Keychron", base: 3e5 },
        { brand: "Glorious", base: 45e4 },
        { brand: "Kbdfans", base: 6e5 },
        { brand: "Grifiti", base: 8e5 },
        { brand: "Deltahub", base: 14e5 },
        { brand: "Mode", base: 18e5 },
        { brand: "TGR", base: 22e5 },
        { brand: "KBDfans g\u1ED7", base: 11e5 },
        { brand: "Deltahub Carpio", base: 28e5 }
      ],
      [
        { label: "m\xFAt", factor: 0.7 },
        { label: "g\u1ED7", factor: 1 },
        { label: "nh\xF4m", factor: 1.4 },
        { label: "t\xE1ch \u0111\xF4i", factor: 1.2 },
        { label: "k\xEA c\u1ED5 tay", factor: 1.6 }
      ],
      { id: "wrist", category: "wrist", rareAt: 5e5, epicAt: 12e5, legendAt: 2e6, tone: "#6e5438", blurb: () => "K\xEA c\u1ED5 tay tr\u01B0\u1EDBc ph\xEDm." }
    ),
    ...branded(
      [
        { brand: "Rapoo", base: 4e5 },
        { brand: "Logitech C", base: 8e5 },
        { brand: "Razer", base: 15e5 },
        { brand: "Elgato", base: 28e5 },
        { brand: "Insta360", base: 35e5 },
        { brand: "OBSBOT", base: 45e5 },
        { brand: "Logitech Brio", base: 4e6 },
        { brand: "Elgato Facecam", base: 55e5 },
        { brand: "Sony", base: 8e6 },
        { brand: "Elgato Prompter", base: 65e5 }
      ],
      [
        { label: "720", factor: 0.7 },
        { label: "1080", factor: 1 },
        { label: "4K", factor: 1.5 },
        { label: "xoay", factor: 1.8 },
        { label: "teleprompter", factor: 2 }
      ],
      { id: "cam", category: "webcam", rareAt: 15e5, epicAt: 4e6, legendAt: 7e6, tone: "#1c1b19", blurb: () => "G\u1EAFn tr\xEAn m\xE0n." }
    ),
    ...branded(
      [
        { brand: "Maono", base: 6e5 },
        { brand: "Fifine", base: 9e5 },
        { brand: "HyperX", base: 18e5 },
        { brand: "Elgato", base: 32e5 },
        { brand: "Shure", base: 5e6 },
        { brand: "Rode", base: 4e6 },
        { brand: "Audio-Technica", base: 35e5 },
        { brand: "Shure SM7", base: 1e7 },
        { brand: "Neumann", base: 18e6 },
        { brand: "Neumann TLM", base: 28e6 }
      ],
      [
        { label: "USB", factor: 0.8 },
        { label: "XLR", factor: 1.2 },
        { label: "c\u1EA7m", factor: 0.9 },
        { label: "\u0111\u1EC3 b\xE0n", factor: 1 },
        { label: "k\xE8m boom", factor: 1.5 }
      ],
      { id: "mic", category: "mic", rareAt: 2e6, epicAt: 6e6, legendAt: 15e6, tone: "#2a2722", blurb: () => "Mic g\xF3c b\xE0n." }
    ),
    ...branded(
      [
        { brand: "Ugreen", base: 4e5 },
        { brand: "Baseus", base: 6e5 },
        { brand: "Anker", base: 12e5 },
        { brand: "Belkin", base: 18e5 },
        { brand: "CalDigit", base: 6e6 },
        { brand: "OWC", base: 5e6 },
        { brand: "Satechi", base: 25e5 },
        { brand: "Hyper", base: 3e6 },
        { brand: "CalDigit TS4", base: 9e6 },
        { brand: "Sonnet", base: 12e6 }
      ],
      [
        { label: "USB-C", factor: 0.8 },
        { label: "HDMI", factor: 1 },
        { label: "\u0111\u1ECDc th\u1EBB", factor: 1.2 },
        { label: "Thunderbolt", factor: 1.8 },
        { label: "11 c\u1ED5ng", factor: 2 }
      ],
      { id: "dock", category: "dock", rareAt: 15e5, epicAt: 5e6, legendAt: 9e6, tone: "#8d9094", blurb: () => "Gom d\xE2y m\xE1y." }
    ),
    ...branded(
      [
        { brand: "Fantech", base: 15e4 },
        { brand: "Ugreen", base: 25e4 },
        { brand: "Avantree", base: 4e5 },
        { brand: "Woo", base: 12e5 },
        { brand: "Hifiman", base: 8e5 },
        { brand: "New Bee", base: 3e5 },
        { brand: "Samdi", base: 6e5 },
        { brand: "Hagoromo", base: 2e6 },
        { brand: "g\u1ED7 \xF3c ch\xF3", base: 15e5 },
        { brand: "nh\xF4m CNC", base: 28e5 }
      ],
      [
        { label: "m\u1ED9t tai", factor: 0.8 },
        { label: "hai tai", factor: 1 },
        { label: "treo", factor: 1.2 },
        { label: "g\u1ED7", factor: 1.5 },
        { label: "k\xE8m hub", factor: 1.7 }
      ],
      { id: "stand", category: "stand", rareAt: 5e5, epicAt: 14e5, legendAt: 24e5, tone: "#6e5438", blurb: () => "G\xE1c headphone khi kh\xF4ng \u0111eo." }
    )
  ];
  var ITEMS = [...FURNITURE, ...PC, ...KB, ...SWITCHES, ...GEAR, ...SCREENS, ...SURFACE, ...MECHA];
  var BY_ID = new Map(ITEMS.map((entry) => [entry.id, entry]));
  function getItem(id) {
    if (!id) return void 0;
    return BY_ID.get(id);
  }
  function itemsIn(category) {
    return ITEMS.filter((entry) => entry.category === category);
  }
  function kitParts(kitId) {
    return ITEMS.filter((entry) => entry.kitId === kitId);
  }
  var KIND_LABEL = {
    mechanical: "C\u01A1",
    he: "HE"
  };
  var CASE_MATERIAL_LABEL = {
    plastic: "Nh\u1EF1a",
    aluminum: "Nh\xF4m"
  };
  var FEEL_LABEL = {
    linear: "Linear",
    tactile: "Tactile"
  };
  var PLATE_LABEL = {
    plastic: "Nh\u1EF1a",
    cnc: "CNC",
    titanium: "Titan"
  };
  var SOUND_LABEL = {
    thocky: "Thocky",
    creamy: "Creamy",
    silent: "Silent"
  };
  var PC_FIELDS = [
    { key: "caseId", category: "pc_case", label: "Case", required: true },
    { key: "motherboardId", category: "motherboard", label: "Mainboard", required: true },
    { key: "cpuId", category: "cpu", label: "CPU", required: true },
    { key: "pasteId", category: "paste", label: "Keo t\u1EA3n", required: true },
    { key: "coolerId", category: "cooler", label: "T\u1EA3n", required: true },
    { key: "cpuBlockId", category: "cpu_block", label: "Block CPU", required: false },
    { key: "ramId", category: "ram", label: "RAM", required: true },
    { key: "gpuId", category: "gpu", label: "GPU", required: true },
    { key: "gpuBlockId", category: "gpu_block", label: "Block GPU", required: false },
    { key: "bracketId", category: "bracket", label: "\u0110\u1EE1 GPU", required: false },
    { key: "riserId", category: "riser", label: "Riser", required: false },
    { key: "storageId", category: "storage", label: "\u1ED4", required: true },
    { key: "opticalId", category: "optical", label: "\u1ED4 quang", required: false },
    { key: "psuId", category: "psu", label: "Ngu\u1ED3n", required: true },
    { key: "sleeveId", category: "sleeve", label: "D\xE2y b\u1ECDc", required: false },
    { key: "fanId", category: "fan", label: "Qu\u1EA1t", required: false },
    { key: "hubId", category: "hub", label: "Hub qu\u1EA1t", required: false },
    { key: "pumpId", category: "pump", label: "B\u01A1m", required: false },
    { key: "radiatorId", category: "radiator", label: "K\xE9t", required: false },
    { key: "tubeId", category: "tube", label: "\u1ED0ng", required: false },
    { key: "soundCardId", category: "sound_card", label: "Card \xE2m thanh", required: true },
    { key: "nicId", category: "nic", label: "Card m\u1EA1ng", required: true }
  ];

  // ../../download/atelier-for-cursor-src/atelier-for-cursor/src/lib/atelier/logic.ts
  var logic_exports = {};
  __export(logic_exports, {
    applyAutoEquip: () => applyAutoEquip,
    applyStreak: () => applyStreak,
    bestSwitch: () => bestSwitch,
    chestsForPoints: () => chestsForPoints,
    coverKeys: () => coverKeys,
    deepPoints: () => deepPoints,
    iemReady: () => iemReady,
    kitComplete: () => kitComplete,
    mergeCaps: () => mergeCaps,
    monitorSlots: () => monitorSlots,
    pcComplete: () => pcComplete,
    rollChest: () => rollChest,
    scoreDraft: () => scoreDraft,
    todayKey: () => todayKey
  });
  function todayKey(date = /* @__PURE__ */ new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function deepPoints(minutes) {
    if (minutes < 25) return 0;
    return Math.floor(minutes / 25) * 10;
  }
  function scoreDraft(draft) {
    return deepPoints(draft.deepMinutes) + (draft.reading ? 10 : 0) + (draft.lowScroll ? 5 : 0) + Math.max(0, draft.todos) * 10;
  }
  function chestsForPoints(points, rng) {
    if (points < 25) return [];
    if (points < 35) return rng() < 0.3 ? ["common"] : [];
    if (points < 45) return ["common"];
    if (points < 55) return rng() < 0.4 ? ["common", "rare"] : ["common"];
    if (points < 70) return ["rare"];
    const epics = 1 + Math.floor((points - 70) / 30);
    return Array.from({ length: epics }, () => "epic");
  }
  function applyStreak(bonus, points) {
    const broke35 = points < 35;
    const broke40 = points < 40;
    const streak35 = broke35 ? 0 : bonus.streak35 + 1;
    const streak40 = broke40 ? 0 : bonus.streak40 + 1;
    let claimed3 = broke35 ? false : bonus.claimed3;
    let claimed5 = broke40 ? false : bonus.claimed5;
    let claimed7 = broke35 ? false : bonus.claimed7;
    const chests = [];
    if (streak35 >= 3 && !claimed3) {
      chests.push("common");
      claimed3 = true;
    }
    if (streak40 >= 5 && !claimed5) {
      chests.push("rare");
      claimed5 = true;
    }
    if (streak35 >= 7 && !claimed7) {
      chests.push("epic");
      claimed7 = true;
    }
    return { bonus: { streak35, streak40, claimed3, claimed5, claimed7 }, chests };
  }
  var RARITY_ORDER = ["common", "rare", "epic", "legendary"];
  var CHEST_WEIGHTS = {
    common: [70, 25, 5, 0],
    rare: [45, 35, 18, 2],
    epic: [25, 35, 30, 10],
    legendary: [10, 25, 35, 30]
  };
  function pickWeighted(rows, rng) {
    const total = rows.reduce((sum, row) => sum + row.w, 0);
    let cursor = rng() * total;
    for (const row of rows) {
      cursor -= row.w;
      if (cursor <= 0) return row.id;
    }
    return rows[rows.length - 1].id;
  }
  function rollRarity(tier, rng, force) {
    if (force === "legendary") return "legendary";
    const weights = CHEST_WEIGHTS[tier];
    const rows = RARITY_ORDER.map((id, index) => ({ id, w: weights[index] ?? 0 })).filter((row) => {
      if (force === "epic") return row.id === "epic" || row.id === "legendary";
      return row.w > 0;
    });
    return pickWeighted(rows, rng);
  }
  var FAMILIES = [
    { id: "keyboard", w: 22 },
    { id: "pc", w: 16 },
    { id: "mecha", w: 16 },
    { id: "audio", w: 12 },
    { id: "display", w: 14 },
    { id: "mouse", w: 8 },
    { id: "furniture", w: 8 },
    { id: "ambience", w: 4 }
  ];
  var FAMILY_CATS = {
    pc: ["pc_case", "motherboard", "cpu", "gpu", "ram", "storage", "psu", "cooler", "fan", "paste", "riser", "bracket", "hub", "sleeve", "sound_card", "nic", "optical", "cpu_block", "gpu_block", "pump", "radiator", "tube"],
    mecha: ["mecha_part"],
    audio: ["headphone", "iem", "dac", "cable", "eartips"],
    display: ["monitor", "arm"],
    mouse: ["mouse", "mousepad", "wrist"],
    furniture: ["desk", "chair", "stand", "dock"],
    ambience: ["light", "speaker", "webcam", "mic"]
  };
  function pickFromCat(category, rarity, rng) {
    const pool = itemsIn(category);
    const exact = pool.filter((entry) => entry.rarity === rarity);
    const src = exact.length ? exact : pool;
    const index = Math.floor(rng() * src.length);
    return src[index] ?? pool[0];
  }
  function rollCaps(rarity, rng) {
    const layouts2 = Object.keys(LAYOUT_ROWS);
    const layout = layouts2[Math.floor(rng() * layouts2.length)];
    const keys = layoutKeys(layout);
    const base = CAP_COLORS[Math.floor(rng() * CAP_COLORS.length)];
    const shine = rng() < 0.45;
    const legend = rng() < 0.5 ? "top" : "north";
    if (rarity === "legendary") {
      return keys.map((key) => ({ key, color: base.hex, shine, legend, qty: 1 }));
    }
    const count = rarity === "common" ? 6 : rarity === "rare" ? 10 : 16;
    const bias = rarity === "epic" ? 0.75 : rarity === "rare" ? 0.4 : 0.15;
    const bag = [...keys];
    const picked = [];
    while (bag.length && picked.length < count) {
      const index = Math.floor(rng() * bag.length);
      picked.push(bag.splice(index, 1)[0]);
    }
    return picked.map((key) => {
      const uniform = rng() < bias;
      const color = uniform ? base : CAP_COLORS[Math.floor(rng() * CAP_COLORS.length)];
      return {
        key,
        color: color.hex,
        shine: uniform ? shine : rng() < 0.45,
        legend: uniform ? legend : rng() < 0.5 ? "top" : "north",
        qty: 1
      };
    });
  }
  var SWITCH_QTY = {
    common: 8,
    rare: 14,
    epic: 24,
    legendary: 40
  };
  function rollOne(rarity, rng) {
    const family = pickWeighted(FAMILIES, rng);
    if (family === "keyboard") {
      const sub = pickWeighted(
        [
          { id: "case", w: 16 },
          { id: "pcb", w: 16 },
          { id: "plate", w: 16 },
          { id: "switch", w: 28 },
          { id: "caps", w: 24 }
        ],
        rng
      );
      if (sub === "caps") return { kind: "keycaps", caps: rollCaps(rarity, rng), rarity };
      if (sub === "switch") {
        const found3 = pickFromCat("switch", rarity, rng);
        return { kind: "item", itemId: found3?.id ?? "sw_mech_l_t_0", qty: SWITCH_QTY[rarity], rarity };
      }
      const category2 = sub === "case" ? "kb_case" : sub === "pcb" ? "kb_pcb" : "plate";
      const found2 = pickFromCat(category2, rarity, rng);
      return { kind: "item", itemId: found2?.id ?? "kb_case_mechanical_plastic_60", qty: 1, rarity };
    }
    const cats = FAMILY_CATS[family];
    const category = cats[Math.floor(rng() * cats.length)];
    const found = pickFromCat(category, rarity, rng);
    return { kind: "item", itemId: found?.id ?? "desk_0", qty: 1, rarity };
  }
  function rollChest(tier, pity, rng) {
    const force = pity.sinceLegendary >= 20 ? "legendary" : pity.sinceEpic >= 10 ? "epic" : "none";
    const count = tier === "common" ? 2 : tier === "rare" ? rng() < 0.5 ? 3 : 2 : 3;
    const drops = [];
    for (let index = 0; index < count; index += 1) {
      const rarity = rollRarity(tier, rng, index === 0 ? force : "none");
      drops.push(rollOne(rarity, rng));
    }
    const rank = (rarity) => RARITY_ORDER.indexOf(rarity);
    const best = drops.reduce((top, drop) => rank(drop.rarity) > rank(top) ? drop.rarity : top, "common");
    const next = best === "legendary" ? { sinceEpic: 0, sinceLegendary: 0 } : best === "epic" ? { sinceEpic: 0, sinceLegendary: pity.sinceLegendary + 1 } : { sinceEpic: pity.sinceEpic + 1, sinceLegendary: pity.sinceLegendary + 1 };
    return { drops, pity: next };
  }
  function mergeCaps(current, extra) {
    const next = current.map((cap) => ({ ...cap }));
    for (const cap of extra) {
      const index = next.findIndex(
        (row) => row.key === cap.key && row.color === cap.color && row.shine === cap.shine && row.legend === cap.legend
      );
      if (index >= 0) next[index].qty += cap.qty;
      else next.push({ ...cap });
    }
    return next;
  }
  function kitComplete(kitId, stock) {
    return kitParts(kitId).every((part) => (stock[part.id] ?? 0) > 0);
  }
  function pcComplete(setup) {
    return PC_FIELDS.filter((field) => field.required).every((field) => Boolean(setup.pc[field.key]));
  }
  function iemReady(setup) {
    return Boolean(setup.iemId && setup.dacId && setup.cableId && setup.tipsId);
  }
  function monitorSlots(armId) {
    const arm = getItem(armId);
    if (arm?.armKind === "dual") return 2;
    if (arm?.armKind === "single") return 1;
    return 0;
  }
  function cloneSetup(setup) {
    return {
      ...setup,
      pc: { ...setup.pc },
      monitorIds: [...setup.monitorIds],
      speakerIds: [...setup.speakerIds],
      lightIds: [...setup.lightIds]
    };
  }
  function applyAutoEquip(setup, stock, gainedIds) {
    const next = cloneSetup(setup);
    const gained = gainedIds.map((id) => getItem(id)).filter((item2) => item2 != null);
    const used = {};
    const reserve = (id) => {
      if (!id) return;
      used[id] = (used[id] ?? 0) + 1;
    };
    reserve(next.deskId);
    reserve(next.chairId);
    reserve(next.mouseId);
    reserve(next.mousepadId);
    reserve(next.wristId);
    reserve(next.webcamId);
    reserve(next.micId);
    reserve(next.dockId);
    reserve(next.standId);
    reserve(next.armId);
    reserve(next.kbCaseId);
    reserve(next.kbPcbId);
    reserve(next.kbPlateId);
    reserve(next.headphoneId);
    reserve(next.monitorIds[0]);
    reserve(next.monitorIds[1]);
    for (const id of Object.values(next.pc)) reserve(id);
    for (const id of next.speakerIds) reserve(id);
    for (const id of next.lightIds) reserve(id);
    const take = (id) => {
      const have = stock[id] ?? 0;
      const busy = used[id] ?? 0;
      if (busy >= have) return false;
      used[id] = busy + 1;
      return true;
    };
    const fillSingle = (current, category) => {
      if (current) return current;
      const found = gained.find((item2) => item2.category === category);
      if (found && take(found.id)) return found.id;
      return current;
    };
    next.deskId = fillSingle(next.deskId, "desk");
    next.chairId = fillSingle(next.chairId, "chair");
    next.mouseId = fillSingle(next.mouseId, "mouse");
    next.mousepadId = fillSingle(next.mousepadId, "mousepad");
    next.wristId = fillSingle(next.wristId, "wrist");
    next.webcamId = fillSingle(next.webcamId, "webcam");
    next.micId = fillSingle(next.micId, "mic");
    next.dockId = fillSingle(next.dockId, "dock");
    next.standId = fillSingle(next.standId, "stand");
    next.armId = fillSingle(next.armId, "arm");
    next.kbCaseId = fillSingle(next.kbCaseId, "kb_case");
    if (!next.kbPcbId) {
      const caseItem = getItem(next.kbCaseId);
      const layout = caseItem?.layout;
      const kind = caseItem?.kbKind;
      const pcb = gained.find(
        (item2) => item2.category === "kb_pcb" && (!layout || item2.layout === layout) && (!kind || item2.kbKind === kind)
      );
      if (pcb && take(pcb.id)) next.kbPcbId = pcb.id;
    }
    if (!next.kbPlateId) {
      const layout = getItem(next.kbCaseId)?.layout;
      const plate = gained.find((item2) => item2.category === "plate" && (!layout || item2.layout === layout));
      if (plate && take(plate.id)) next.kbPlateId = plate.id;
    }
    for (const field of PC_FIELDS) {
      next.pc[field.key] = fillSingle(next.pc[field.key], field.category);
    }
    const slots = monitorSlots(next.armId);
    if (slots < 1) next.monitorIds = [null, null];
    else if (slots < 2) next.monitorIds[1] = null;
    const monitors = gained.filter((item2) => item2.category === "monitor");
    for (const monitor of monitors) {
      if (slots >= 1 && !next.monitorIds[0] && take(monitor.id)) next.monitorIds[0] = monitor.id;
      else if (slots === 2 && !next.monitorIds[1] && take(monitor.id)) next.monitorIds[1] = monitor.id;
    }
    if (!next.headphoneId) next.headphoneId = fillSingle(next.headphoneId, "headphone");
    if (!next.iemId) next.iemId = fillSingle(null, "iem");
    if (!next.dacId) next.dacId = fillSingle(null, "dac");
    if (!next.cableId) next.cableId = fillSingle(null, "cable");
    if (!next.tipsId) next.tipsId = fillSingle(null, "eartips");
    if (next.audioMode === "none" && gained.some((item2) => item2.category === "headphone") && next.headphoneId) {
      next.audioMode = "headphone";
    } else if (next.audioMode === "none" && iemReady(next)) {
      next.audioMode = "iem";
    }
    if (next.speakerIds.length === 0) {
      const pair = gained.find((item2) => item2.category === "speaker" && item2.speakerKind === "pair");
      const single = gained.find((item2) => item2.category === "speaker" && item2.speakerKind === "single");
      if (pair && take(pair.id)) next.speakerIds = [pair.id];
      else if (single && take(single.id)) next.speakerIds = [single.id];
    }
    if (next.lightIds.length < 2) {
      for (const light of gained.filter((item2) => item2.category === "light")) {
        if (next.lightIds.length >= 2) break;
        if (!next.lightIds.includes(light.id) && take(light.id)) next.lightIds.push(light.id);
      }
    }
    if (!next.mechaKitId) {
      const touched = new Set(
        gained.flatMap((item2) => item2.kitId ? [item2.kitId] : [])
      );
      const done = KITS.find((kit) => touched.has(kit.id) && kitComplete(kit.id, stock));
      if (done) next.mechaKitId = done.id;
    }
    return next;
  }
  function coverKeys(layout, owned) {
    const keys = layoutKeys(layout);
    const sigs = /* @__PURE__ */ new Map();
    for (const cap of owned) {
      if (cap.qty <= 0) continue;
      sigs.set(`${cap.color}|${cap.shine ? 1 : 0}|${cap.legend}`, {
        color: cap.color,
        shine: cap.shine,
        legend: cap.legend
      });
    }
    let bestFilled = {};
    let bestUniform = -1;
    let bestScore = -1;
    const options = [null, ...sigs.values()];
    for (const opt of options) {
      const pool = owned.map((cap) => ({ ...cap }));
      const filled = {};
      const take = (key, pred) => {
        const index = pool.findIndex((cap2) => cap2.key === key && cap2.qty > 0 && pred(cap2));
        if (index < 0) return;
        const cap = pool[index];
        cap.qty -= 1;
        filled[key] = { color: cap.color, shine: cap.shine, legend: cap.legend };
      };
      if (opt) {
        for (const key of keys) {
          take(key, (cap) => cap.color === opt.color && cap.shine === opt.shine && cap.legend === opt.legend);
        }
      }
      for (const key of keys) {
        if (!filled[key]) take(key, () => true);
      }
      const uniform = opt ? keys.filter(
        (key) => filled[key] && filled[key].color === opt.color && filled[key].shine === opt.shine && filled[key].legend === opt.legend
      ).length : 0;
      const score = uniform * 8 + Object.keys(filled).length;
      if (score > bestScore) {
        bestScore = score;
        bestFilled = filled;
        bestUniform = uniform;
      }
    }
    return { keys, filled: bestFilled, uniform: Math.max(0, bestUniform) };
  }
  function bestSwitch(layout, stock, kind = "mechanical") {
    const need = layoutKeys(layout).length;
    let id = null;
    let have = 0;
    for (const entry of itemsIn("switch")) {
      if (entry.kbKind && entry.kbKind !== kind) continue;
      const qty = stock[entry.id] ?? 0;
      if (qty > have) {
        have = qty;
        id = entry.id;
      }
    }
    return { need, have, id, matched: have >= need };
  }

  // ../../download/atelier-for-cursor-src/atelier-for-cursor/src/lib/atelier/entry.ts
  globalThis.AtelierLib = { ...catalog_exports, ...logic_exports };
})();
