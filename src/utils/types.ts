export interface Span {
  from: number;
  to: number;
}

export interface Spanned<T> extends Span {
  value: T;
}

export interface NamedText {
  name: string;
  text: string;
}
