import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: "dist",
  outExtension: () => {
    return {
      js: ".js",
    };
  },
  external: ["@modelcontextprotocol/sdk"],
  noExternal: ["zod"],
  minify: true,
});
