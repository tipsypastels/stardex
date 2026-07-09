import { Empty } from "../../common/empty";

export function EmptyPokedex() {
  return <Empty>you have no pokemon</Empty>;
}

export function EmptyFilteredPokedex() {
  return <Empty>no pokemon matched your filter</Empty>;
}
