import TYPE_DATA from "../data/TYPE_DATA";
import { IconSource } from "../shared/Icon";
import randomColor from 'randomcolor';

export class Type {
  static BUILTINS = Object.keys(TYPE_DATA);

  name: string;

  constructor(name: string) {
    this.name = name.toLowerCase();
  }

  get custom() {
    return !(this.name in TYPE_DATA);
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