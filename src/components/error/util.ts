import { createSignal, type Accessor } from "solid-js";
import * as v from "valibot";
import { saveToFile } from "../../utils/file";

interface ErrorDump {
  date: string;
  userAgent: string;
  locals: Record<string, unknown>;
  error: {
    name?: string;
    message: string;
    cause?: unknown;
    stack?: string[];
    issues?: v.FlatErrors<undefined>;
  };
}

export function createErrorDumper(error: Accessor<unknown>) {
  const [made, setMade] = createSignal(false);

  function toDumpedError(error: unknown): ErrorDump["error"] {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        cause: error.cause,
        stack: error.stack?.split("\n"),
        issues: v.isValiError(error) ? v.flatten(error.issues) : undefined,
      };
    }
    return { message: `${error}` };
  }

  return {
    get made() {
      return made();
    },
    make() {
      const dump: ErrorDump = {
        date: new Date().toString(),
        userAgent: navigator.userAgent,
        locals: {},
        error: toDumpedError(error()),
      };

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) break;
        const value = localStorage.getItem(key);
        dump.locals[key] = value;
      }

      saveToFile("stardex_error_dump.json", "json", JSON.stringify(dump, null, 2));
      setMade(true);
    },
  };
}
