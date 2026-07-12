export interface CustomIconsDbEntry {
  projectId: string;
  pokemonKey: string;
  blob: Blob;
}

type State = { type: "uninit" } | { type: "db"; db: IDBDatabase } | { type: "denied" };

let state: State = { type: "uninit" };

export function getCustomIcons(f: (entries: CustomIconsDbEntry[]) => void) {
  tryInit();
  if (state.type !== "db") return;

  const transaction = state.db.transaction(["customIcons"]);
  const store = transaction.objectStore("customIcons");
  const request = store.getAll();

  request.onsuccess = () => {
    f(request.result);
  };
}

function tryInit() {
  if (state.type !== "uninit") {
    return;
  }

  const request = indexedDB.open("stardex", 1);

  request.onupgradeneeded = (event) => {
    // @ts-expect-error Untyped.
    const db: IDBDatabase = event.target.result;

    db.createObjectStore("customIcons", { keyPath: ["projectId", "pokemonKey"] });

    // eslint-disable-next-line no-console
    console.log("Database upgraded.");
  };

  request.onerror = () => {
    state = { type: "denied" };
  };

  request.onsuccess = (event) => {
    // @ts-expect-error Untyped.
    const db: IDBDatabase = event.target.result;
    state = { type: "db", db };

    // eslint-disable-next-line no-console
    console.log("Database initialized.");
  };
}
