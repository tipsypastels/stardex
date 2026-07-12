export function saveToFile(name: string, kind: "text" | "json", contents: string) {
  const a = document.createElement("a");
  const blob = new Blob([contents], {
    type: kind === "text" ? "text/plain" : "application/json",
  });

  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();

  URL.revokeObjectURL(a.href);
}
