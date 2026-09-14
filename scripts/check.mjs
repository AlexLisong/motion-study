import { readFile, access } from "node:fs/promises";
const html = await readFile("dist/index.html", "utf8");
const js = await readFile("dist/app.js", "utf8");
const css = await readFile("dist/styles.css", "utf8");
const paths = new Set(
  [
    ...html.matchAll(/(?:src|href)="([^"?#]+)"/g),
    ...js.matchAll(/['"](assets\/[^'"]+)['"]/g),
  ]
    .map((m) => m[1])
    .filter((p) => !p.startsWith("http") && !p.startsWith("#")),
);
for (const match of css.matchAll(/url\(['"]?([^)'"?#]+)['"]?\)/g))
  if (!match[1].startsWith("data:") && !match[1].startsWith("http"))
    paths.add(match[1]);
for (const path of paths) await access(`dist/${path}`);
for (const id of ["keel", "next-move", "orla", "undr"])
  if (!new RegExp(`\\bid:\\s*["']${id}["']`).test(js))
    throw new Error(`Missing study: ${id}`);
console.log(
  `Validated the entrypoint, all four study definitions, and ${paths.size} local assets. JavaScript syntax passed.`,
);
