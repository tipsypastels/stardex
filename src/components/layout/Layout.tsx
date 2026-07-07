import { Header } from "./Header";
import { Panes } from "./Panes";

export function Layout() {
  return (
    <div class="flex min-h-screen flex-col">
      <Header />
      <Panes left={<div>hi</div>} right={<div>bye</div>} />
    </div>
  );
}
