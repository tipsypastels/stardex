import * as v from "valibot";
import { saveToFile } from ".";

interface ErrorDump {
  date: string;
  userAgent: string;
  locals: Record<string, unknown>;
  model?: string;
  error: {
    name?: string;
    message: string;
    cause?: unknown;
    stack?: string[];
    issues?: v.FlatErrors<undefined>;
  };
}

export function saveErrorDumpToFile(error: unknown, model?: string) {
  const dump: ErrorDump = {
    date: new Date().toString(),
    userAgent: navigator.userAgent,
    locals: {},
    model,
    error: convertError(error),
  };

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) break;
    const value = localStorage.getItem(key);
    dump.locals[key] = value;
  }

  saveToFile("stardex_error_dump.json", "json", JSON.stringify(dump, null, 2));
}

function convertError(error: unknown): ErrorDump["error"] {
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
