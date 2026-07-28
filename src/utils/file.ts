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

export function blobToDataUrl(blob: Blob, f: (dataUrl: string) => void) {
  const fileReader = new FileReader();

  fileReader.onload = () => f(fileReader.result as string);
  fileReader.readAsDataURL(blob);
}

export function readFileAsTextAsync(file: File) {
  return new Promise<string>((ok) => {
    const fileReader = new FileReader();
    fileReader.onload = () => ok(fileReader.result as string);
    fileReader.readAsText(file);
  });
}
