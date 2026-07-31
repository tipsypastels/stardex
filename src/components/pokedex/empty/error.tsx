import { Link } from "../../common/link";
import { Modal } from "../../common/menus/modal";

export interface PokedexEmptyImportErrorProps {
  error: unknown;
  onClose(): void;
}

export function PokedexEmptyImportError(props: PokedexEmptyImportErrorProps) {
  return (
    <Modal title="Invalid Project" onClose={props.onClose}>
      <p class="mb-2">This project is corrupted and could not be loaded.</p>
      <p>
        This may be a bug with Stardex. You can open an issue at the{" "}
        <Link blank to="https://github.com/tipsypastels/stardex">
          project GitHub
        </Link>{" "}
        with the project file to help me diagnose it.
      </p>
    </Modal>
  );
}
