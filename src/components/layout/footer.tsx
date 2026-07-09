import { Icon } from "../common/icon";
import { Link } from "../common/link";

export function Footer() {
  return (
    <footer class="bg-footer mt-8 py-8 text-center text-white">
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
        </Link>
      </div>
    </footer>
  );
}
