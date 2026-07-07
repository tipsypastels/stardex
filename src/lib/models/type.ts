import randomColor from "randomcolor";
import { capitalize } from "$lib/utils/strings";
import DATA from "../data/types.json" with { type: "json" };

export abstract class Type {
  static of(key: string) {
    return key in DATA ? BuiltinType.of(key) : CustomType.of(key);
  }

  abstract name: string;
  abstract color: string;
  abstract icon: string;

  readonly key: string;

  protected constructor(key: string) {
    this.key = key;
  }

  isBuiltin(): this is BuiltinType {
    return false;
  }

  isCustom(): this is CustomType {
    return false;
  }
}

export class BuiltinType extends Type {
  static KEYS = Object.keys(DATA);
  static ALL = this.KEYS.map((key) => new this(key));
  static MAP = new Map(this.ALL.map((t) => [t.key, t]));

  static of(key: string) {
    const type = this.MAP.get(key);
    if (type) return type;
    throw new Error(`Unknown builtin type: ${key}.`);
  }

  get name() {
    return this.#data.name;
  }

  get color() {
    return this.#data.color;
  }

  get icon() {
    return this.#data.icon;
  }

  get #data() {
    return DATA[this.key as keyof typeof DATA];
  }

  isBuiltin(): this is BuiltinType {
    return true;
  }
}

export class CustomType extends Type {
  static #cache = new Map<string, CustomType>();

  static of(key: string) {
    const cached = this.#cache.get(key);
    if (cached) return cached;

    const made = new this(key);
    this.#cache.set(key, made);

    return made;
  }

  #name?: string;
  #color?: string;

  get name() {
    this.#name ??= capitalize(this.key);
    return this.#name;
  }

  get color() {
    this.#color ??= randomColor({ seed: this.key });
    return this.#color;
  }

  get icon() {
    return "question-circle";
  }

  isCustom(): this is CustomType {
    return true;
  }
}
