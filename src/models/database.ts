/* eslint-disable no-console */

export interface CustomIconsDbEntry {
  projectId: string;
  pokemonId: string;
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

export function addCustomIconsDbEntry(entry: CustomIconsDbEntry, f?: () => void) {
  withDb((db) => {
    const transaction = db.transaction("customIcons", "readwrite");
    const store = transaction.objectStore("customIcons");
    const request = store.put(entry);

    request.onsuccess = () => {
      console.log(`Custom icon "${entry.projectId}-${entry.pokemonId}" uploaded!`);
      f?.();
    };
  });
}

export function deleteCustomIconsDbEntry(entry: Omit<CustomIconsDbEntry, "blob">, f?: () => void) {
  withDb((db) => {
    const transaction = db.transaction("customIcons", "readwrite");
    const store = transaction.objectStore("customIcons");
    const request = store.delete([entry.projectId, entry.pokemonId]);

    request.onsuccess = () => {
      console.log(`Custom icon "${entry.projectId}-${entry.pokemonId}" deleted!`);
      f?.();
    };
  });
}

export function addBulkCustomIconsDbEntries(
  projectId: string,
  entries: Omit<CustomIconsDbEntry, "projectId">[],
  f?: () => void,
) {
  if (entries.length === 0) {
    f?.();
    return;
  }

  withDb((db) => {
    const transaction = db.transaction("customIcons", "readwrite");
    const store = transaction.objectStore("customIcons");

    for (const entry of entries) {
      const request = store.put({ ...entry, projectId });

      request.onerror = (event) => {
        console.error(
          `Failed to add custom icon "${projectId}-${entry.pokemonId}" during bulk.`,
          // @ts-expect-error Untyped.
          event.target.error,
        );
      };
    }

    transaction.oncomplete = () => {
      console.log(`${entries.length} custom icons for "${projectId}" uploaded!`);
      f?.();
    };
  });
}

export function deleteBulkCustomIconDbEntries(projectId: string, f?: () => void) {
  withDb((db) => {
    const transaction = db.transaction("customIcons", "readwrite");
    const store = transaction.objectStore("customIcons");
    const index = store.index("projectId");
    const request = index.openKeyCursor(projectId);

    request.onsuccess = (event) => {
      // @ts-expect-error Untyped.
      const cursor: IDBCursor | null = event.target.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      } else {
        f?.();
      }
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
          console.error("Database error", event.target.error);
        };

        const store = db.createObjectStore("customIcons", { keyPath: ["projectId", "pokemonId"] });
        store.createIndex("projectId", "projectId");

        console.log("Database upgraded.");
      };

      request.onerror = () => {
        state = { type: "denied" };
      };

      request.onsuccess = (event) => {
        // @ts-expect-error Untyped.
        const db: IDBDatabase = event.target.result;

        db.onversionchange = () => {
          db.close();
          state = { type: "uninit" };
          console.warn("Database closed due to external version change or deletion.");
        };

        state = { type: "db", db };

        console.log("Database initialized.");
        f(db);
      };
    }
  }
}

export function dropDb(f: () => void) {
  if (state.type === "db") {
    state.db.close();
    state = { type: "uninit" };
  }

  const request = indexedDB.deleteDatabase("stardex");
  request.onsuccess = f;

  request.onerror = (e) => {
    console.error("Failed to delete database:", e);
  };

  request.onblocked = () => {
    console.warn("Database deletion blocked, is it open in another tab?");
  };
}

export function unsafeWipeEverythingAndReload() {
  localStorage.clear();
  dropDb(() => location.reload());
}
