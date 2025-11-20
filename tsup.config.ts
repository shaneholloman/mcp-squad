import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "./src/package.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: "dist",
  banner: {
    js: "#!/usr/bin/env node",
  },
  outExtension: () => {
    return {
      js: ".js",
    };
  },
  external: ["@modelcontextprotocol/sdk"],
  minify: true,
});
