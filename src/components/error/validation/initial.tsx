import { unsafeWipeEverythingAndReload } from "../../../models/wipe";
import { Button } from "../../common/button";
import { ButtonLink, Link } from "../../common/link";
import { createErrorDumper } from "../util.ts";

export interface InitialValidationErrorProps {
  error: unknown;
}

export function InitialValidationError(props: InitialValidationErrorProps) {
  const dumper = createErrorDumper(() => props.error);

  function wipeEverythingAndReload() {
    if (!confirm("Are you sure? You really will lose everything.")) {
      return;
    }
    if (
      !dumper.made &&
      !confirm("You don't even want to make an error dump? You're just going to rawdog it?")
    ) {
      return;
    }
    unsafeWipeEverythingAndReload();
  }

  return (
    <div class="m-auto w-200 max-w-full px-4 pt-8 md:px-0">
      <h1 class="mb-2 border-b-2 border-b-error pb-2 text-3xl font-bold text-error">Error!</h1>
      <p class="mb-4">
        <strong>Your Stardex state is corrupted and could not be loaded.</strong>
      </p>

      <p class="mb-4">
        This is most likely a bug with Stardex. You can{" "}
        <ButtonLink onClick={dumper.make}>save an error dump</ButtonLink> and upload it to the{" "}
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
        <Button onClick={wipeEverythingAndReload}>Wipe Everything and Reload</Button>
      </div>
    </div>
  );
}
