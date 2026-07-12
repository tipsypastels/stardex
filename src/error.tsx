import { useSignal } from "@preact/signals";
import { Component, type ComponentChildren, type ErrorInfo } from "preact";
import { Button } from "./components/common/button";
import { ButtonLink, Link } from "./components/common/link";
import { saveToFile } from "./utils/file";

export interface ErrorBoundaryProps {
  children: ComponentChildren;
}

interface State {
  error?: unknown;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    return this.state.error ? (
      <Error error={this.state.error} errorInfo={this.state.errorInfo} />
    ) : (
      <>{this.props.children}</>
    );
  }
}

interface ErrorProps {
  error: unknown;
  errorInfo?: ErrorInfo;
}

interface ErrorDump {
  date: string;
  userAgent: string;
  locals: Record<string, unknown>;
  error: unknown;
  componentStack?: string[];
}

function Error({ error, errorInfo }: ErrorProps) {
  const madeErrorDump = useSignal(false);

  function makeErrorDump() {
    const dump: ErrorDump = {
      date: new Date().toString(),
      userAgent: navigator.userAgent,
      locals: {},
      error:
        error instanceof window.Error
          ? {
              name: error.name,
              message: error.message,
              cause: error.cause,
              stack: error.stack?.split("\n"),
            }
          : error,
      componentStack: errorInfo?.componentStack?.split("\n"),
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) break;
      const value = localStorage.getItem(key);
      dump.locals[key] = value;
    }

    saveToFile("stardex_error_dump.json", "json", JSON.stringify(dump, null, 2));
    madeErrorDump.value = true;
  }

  function wipeEverythingAndReload() {
    if (!confirm("Are you sure? You really will lose everything.")) {
      return;
    }
    if (
      !madeErrorDump.value &&
      !confirm("You don't even want to make an error dump? You're just going to rawdog it?")
    ) {
      return;
    }

    localStorage.clear();
    location.reload();
  }

  return (
    <div class="m-auto w-200 max-w-full px-4 pt-8 md:px-0">
      <h1 class="mb-2 border-b-2 border-b-error pb-2 text-3xl font-bold text-error">Error!</h1>
      <p class="mb-4">
        Stardex failed to start and couldn't recover. This may be a sign that your project state is
        corrupted.
      </p>

      <div class="mb-4 rounded-md border-2 border-divider-heavy p-4">{`${error}`}</div>

      <p class="mb-4">
        This is most likely a bug with Stardex. You can{" "}
        <ButtonLink onClick={makeErrorDump}>save an error dump</ButtonLink> and upload it to the{" "}
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

      <div></div>
    </div>
  );
}
