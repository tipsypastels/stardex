import { createSignal, Show, type JSXElement } from "solid-js";
import { startupError, type StartupError } from "../../models/ui/error";
import { unsafeWipeEverythingAndReload } from "../../models/util/database";
import { saveErrorDumpToFile } from "../../utils/fs/web/error_dump";
import { Button } from "../common/button";
import { ButtonLink, Link } from "../common/link";

export interface CatchStartupErrorProps {
  children: JSXElement;
}

export function CatchStartupError(props: CatchStartupErrorProps) {
  return (
    <Show when={startupError()} fallback={props.children}>
      {(error) => <StartupError error={error()} />}
    </Show>
  );
}

interface StartupErrorProps {
  error: StartupError;
}

function StartupError(props: StartupErrorProps) {
  const [dumped, setDumped] = createSignal(false);

  function dump() {
    saveErrorDumpToFile(props.error.inner, props.error.model);
    setDumped(true);
  }

  function wipeEverythingAndReload() {
    if (!confirm("Are you sure? You really will lose everything.")) {
      return;
    }
    if (
      !dumped() &&
      !confirm("You don't even want to make an error dump? You're just going to rawdog it?")
    ) {
      return;
    }
    unsafeWipeEverythingAndReload();
  }

  return (
    <div class="m-auto w-200 max-w-full px-4 pt-8 md:px-0">
      <h1 class="mb-2 border-b-2 border-b-danger pb-2 text-3xl font-bold text-danger">Error!</h1>
      <p class="mb-4">
        <strong>Your Stardex state is corrupted and could not be loaded.</strong>
      </p>

      <p class="mb-4">
        This is most likely a bug with Stardex. You can{" "}
        <ButtonLink onClick={dump}>save an error dump</ButtonLink> and open an issue at the{" "}
        <Link blank to="https://github.com/tipsypastels/stardex">
          project GitHub
        </Link>{" "}
        to help me diagnose it. The error dump will include your project state, in case it can be
        manually fixed.
      </p>

      <p class="mb-4">
        ...and/or wipe all your data to fix whatever's broken. I'll leave that one up to you. Click
        the tempting button if you want.
      </p>

      <div>
        <Button onClick={wipeEverythingAndReload} look="error">
          Wipe Everything and Reload
        </Button>
      </div>
    </div>
  );
}
