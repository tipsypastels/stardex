import { dark } from "../../models/dark";
import { Icon } from "../common/icon";
import { ButtonLink, Link } from "../common/link";

export function Footer() {
  return (
    <footer class="mt-8 bg-footer py-8 text-center text-white">
      <div class="mb-1">
        Created by <Icon name="duck" />{" "}
        <Link blank to="https://github.com/tipsypastels" look="none" bold>
          tipsypastels
        </Link>
        .
      </div>
      <div class="text-sm">
        <Link blank to="https://github.com/tipsypastels/stardex/blob/main/CHANGELOG.md" look="none">
          Changelog
        </Link>{" "}
        •{" "}
        <Link blank to="https://github.com/tipsypastels/stardex" look="none">
          GitHub
        </Link>{" "}
        •{" "}
        <ButtonLink look="none" onClick={() => (dark.on = !dark.on)}>
          {dark.on ? "Light" : "Dark"} Mode
        </ButtonLink>
      </div>
    </footer>
  );
}
