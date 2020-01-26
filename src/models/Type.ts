import TYPE_DATA from "../data/TYPE_DATA";
import { IconSource } from "../Icon";
import randomColor from 'randomcolor';

export class Type {
  name: string;

  constructor(name: string) {
    this.name = name.toLowerCase();
  }

  get color(): string {
    return TYPE_DATA[this.name]?.['color']
      || randomColor({ seed: this.name });
  }

  get icon(): IconSource {
    return TYPE_DATA[this.name]?.['icon']
      || 'question-circle';
  }
}

export type TypeWithDistribution = {
  type: Type,
  count: number,
}