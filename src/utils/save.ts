export function saveToFile(name: string, contents: string) {
  const a = document.createElement("a");
  const blob = new Blob([contents], { type: "application/json" });

  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();

  URL.revokeObjectURL(a.href);
}
