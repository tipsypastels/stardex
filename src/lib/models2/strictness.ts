const DATA = {
  easygoing: {
    name: "Easygoing",
    description: "If you're just trying out Stardex.",
    maximumRatioDifference: 0.1,
  },
  normal: {
    name: "Normal",
    description: "If you're using Stardex as a rough guideline.",
    maximumRatioDifference: 0.04,
  },
  strict: {
    name: "Strict",
    description: "If you're using Stardex as a strict guideline.",
    maximumRatioDifference: 0.02,
  },
  bitchy: {
    name: "Bitchy",
    description: "If you're here for a real fight.",
    maximumRatioDifference: 0.01,
  },
};

export type StrictnessKey = keyof typeof DATA;

export class Strictness {
  static EASYGOING = new this("easygoing");
  static NORMAL = new this("normal");
  static STRICT = new this("strict");
  static BITCHY = new this("bitchy");
  static ALL = [this.EASYGOING, this.NORMAL, this.STRICT, this.BITCHY];
  static DEFAULT = this.NORMAL;

  static of(key: StrictnessKey) {
    return this.ALL.find((s) => s.key === key)!;
  }

  readonly key: StrictnessKey;

  private constructor(key: StrictnessKey) {
    this.key = key;
  }

  get name() {
    return this.#data.name;
  }

  get description() {
    return this.#data.description;
  }

  get maximumRatioDifference() {
    return this.#data.maximumRatioDifference;
  }

  get #data() {
    return DATA[this.key];
  }

  toJson() {
    return this.key;
  }
}
