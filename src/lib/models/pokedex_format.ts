const DATA = {
  icons: {
    name: "Icons",
    description: "Display your Pokédex as party icons.",
  },
  names: {
    name: "Names",
    description: "Display your Pokédex as name cards.",
  },
  legacyText: {
    name: "Text Editor",
    description: "A single textbox to type all Pokémon into. Classic Stardex mode.",
  },
};

export type PokedexFormatKey = keyof typeof DATA;

export class PokedexFormat {
  static ICONS = new this("icons");
  static NAMES = new this("names");
  static LEGACY_TEXT = new this("legacyText");
  static ALL = [this.ICONS, this.NAMES, this.LEGACY_TEXT];
  static DEFAULT = this.ICONS;

  static of(key: PokedexFormatKey) {
    return this.ALL.find((f) => f.key === key)!;
  }

  readonly key: PokedexFormatKey;

  private constructor(key: PokedexFormatKey) {
    this.key = key;
  }

  get name() {
    return this.#data.name;
  }

  get description() {
    return this.#data.description;
  }

  get #data() {
    return DATA[this.key];
  }

  toJson() {
    return this.key;
  }
}
