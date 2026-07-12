/* eslint-disable no-console */

export interface CustomIconsDbEntry {
  projectId: string;
  pokemonKey: string;
  blob: Blob;
}

export function getCustomIconDbEntries(
  projectId: string,
  f: (entries: CustomIconsDbEntry[]) => void,
) {
  withDb((db) => {
    const transaction = db.transaction("customIcons", "readonly");
    const store = transaction.objectStore("customIcons");
    const index = store.index("projectId");
    const request = index.getAll(projectId);

    request.onsuccess = () => {
      f(request.result);
    };
  });
}

export function addCustomIconsDbEntry(entry: CustomIconsDbEntry, f: () => void) {
  withDb((db) => {
    const transaction = db.transaction("customIcons", "readwrite");
    const store = transaction.objectStore("customIcons");
    const request = store.add(entry);

    request.onsuccess = () => {
      console.log(`Custom icon "${entry.projectId}-${entry.pokemonKey}" uploaded!`);
      f();
    };
  });
}

type State = { type: "uninit" } | { type: "db"; db: IDBDatabase } | { type: "denied" };

let state: State = { type: "uninit" };

function withDb(f: (db: IDBDatabase) => void) {
  switch (state.type) {
    case "denied": {
      return;
    }
    case "db": {
      f(state.db);
      return;
    }
    case "uninit": {
      const request = indexedDB.open("stardex", 1);

      request.onupgradeneeded = (event) => {
        // @ts-expect-error Untyped.
        const db: IDBDatabase = event.target.result;

        db.onerror = (event) => {
          // @ts-expect-error Untyped.
          console.error("Database error", event.target.error?.message);
        };

        const store = db.createObjectStore("customIcons", { keyPath: ["projectId", "pokemonKey"] });
        store.createIndex("projectId", "projectId");

        console.log("Database upgraded.");
      };

      request.onerror = () => {
        state = { type: "denied" };
      };

      request.onsuccess = (event) => {
        // @ts-expect-error Untyped.
        const db: IDBDatabase = event.target.result;
        state = { type: "db", db };

        console.log("Database initialized.");
        f(db);
      };
    }
  }
}
