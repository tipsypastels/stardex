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

export function dataUrlToBlob(dataUrl: string) {
  const [header, base64Data] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1];

  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: mime });
}
