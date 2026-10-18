import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/** @type {import('next').NextConfig} */
const config = {
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: repositoryRoot,
  turbopack: { root: repositoryRoot },
};

export default config;
