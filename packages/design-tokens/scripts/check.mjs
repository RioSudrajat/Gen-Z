import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const colors = await readFile(new URL("../src/colors.css", import.meta.url), "utf8");
assert.match(colors, /--genz-brand-primary:\s*#2dd4bf/i);
assert.match(colors, /--genz-on-primary:\s*#050505/i);
assert.match(colors, /--genz-light-link:\s*#0f766e/i);
console.log("Brand palette tokens available.");
