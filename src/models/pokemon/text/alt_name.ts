const ALIASES = {
  genericFull: [
    { regex: /^m(ale)?$/, altName: undefined },
    { regex: /^f$/, altName: "Female" },
  ],
  genericPartial: [
    { regex: /\\balola\\b/, altName: "Alolan" },
    { regex: /\\bgalar\\b/, altName: "Galarian" },
    { regex: /\\bhisui\\b/, altName: "Hisuian" },
    { regex: /\\bpaldea\\b/, altName: "Paldean" },
    { regex: /\\bg[ -]?max\\b/, altName: "Gigantamax" },
  ],
  specific: {
    tauros: [
      { regex: /^combat( breed)?$/, altName: "Paldean Combat Breed" },
      { regex: /^blaze( breed)?$/, altName: "Paldean Blaze Breed" },
      { regex: /^aqua breed?$/, altName: "Paldean Aqua Breed" },
    ],
    castform: [
      { regex: /^sun$/, altName: "Sunny" },
      { regex: /^rain$/, altName: "Rainy" },
      { regex: /^snow$/, altName: "Snowy" },
    ],
    wormadam: [
      { regex: /^plant$/, altName: undefined },
      { regex: /^sandy?$/, altName: "Sandy Cloak" },
      { regex: /^trash$/, altName: "Trash Cloak" },
    ],
    basculin: [
      { regex: /^red$/, altName: undefined },
      { regex: /^blue$/, altName: "Blue Striped" },
      { regex: /^white$/, altName: "White Striped" },
    ],
    oricorio: [
      { regex: /^pompom$/, altName: "Pom-Pom" },
      { regex: /^pau$/, altName: "Pa'u" },
    ],
    necrozma: [
      { regex: /^dusk$/, altName: "Dusk Mane" },
      { regex: /^dawn$/, altName: "Dawn Wings" },
    ],
    eiscue: [
      { regex: /^ice$/, altName: undefined },
      { regex: /^noice$/, altName: "Noice Face" },
    ],
    morpeko: [{ regex: /^full$/, altName: undefined }],
    zacian: [
      { regex: /^hero$/, altName: "Hero of Many Battles" },
      { regex: /^crowned$/, altName: "Crowned Sword" },
    ],
    zamazenta: [
      { regex: /^hero$/, altName: "Hero of Many Battles" },
      { regex: /^crowned$/, altName: "Crowned Shield" },
    ],
    urshifu: [
      { regex: /^single$/, altName: "Single Strike" },
      { regex: /^rapid$/, altName: "Rapid Strike" },
      { regex: /^single gigantamax$/, altName: "Single Strike Gigantamax" },
      { regex: /^rapid gigantamax$/, altName: "Rapid Strike Gigantamax" },
    ],
    calyrex: [
      { regex: /^ice$/, altName: "Ice Rider" },
      { regex: /^shadow$/, altName: "Shadow Rider" },
    ],
    ursaluna: [{ regex: /^blood moon$/, altName: "Bloodmoon" }],
    squawkabilly: [
      { regex: /^green$/, altName: undefined },
      { regex: /^blue$/, altName: "Blue Plumage" },
      { regex: /^yellow$/, altName: "Yellow Plumage" },
      { regex: /^white$/, altName: "White Plumage" },
    ],
    tatsugiri: [
      { regex: /^mega curly$/, altName: "Curly Mega" },
      { regex: /^mega droopy$/, altName: "Droopy Mega" },
      { regex: /^mega stretchy$/, altName: "Stretchy Mega" },
    ],
    ogerpon: [
      { regex: /^teal$/, altName: undefined },
      { regex: /^wellspring$/, altName: "Wellspring Mask" },
      { regex: /^hearthflame$/, altName: "Hearthflame Mask" },
      { regex: /^cornerstone$/, altName: "Cornerstone Mask" },
    ],
    maushold: [
      { regex: /^three$/, altName: undefined },
      { regex: /^four$/, altName: "Family of Four" },
    ],
  },
};

export function transformAltNameWithAliases(species: string, altNameInput: string) {
  for (const { regex, altName } of ALIASES.genericFull) {
    if (new RegExp(regex, "i").test(altNameInput)) {
      return altName;
    }
  }
  for (const { regex, altName } of ALIASES.genericPartial) {
    altNameInput = altNameInput.replace(new RegExp(regex, "i"), altName);
  }
  if (species in ALIASES.specific) {
    const aliases = ALIASES.specific[species as keyof (typeof ALIASES)["specific"]];
    for (const { regex, altName } of aliases) {
      if (new RegExp(regex, "i").test(altNameInput)) {
        return altName;
      }
    }
  }
  return altNameInput;
}
