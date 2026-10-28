/** Saves `data` as a file through a temporary link. */
export function downloadFile(name: string, data: BlobPart, type: string): void {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export const MIME: Record<string, string> = {
  md: "text/markdown",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
};

export function mimeFor(name: string): string {
  return MIME[name.slice(name.lastIndexOf(".") + 1)] ?? "text/plain";
}
