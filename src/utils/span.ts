export interface Span {
  from: number;
  to: number;
}

export interface Spanned<T> extends Span {
  value: T;
}
