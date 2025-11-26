import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    client: "./src/client.ts",
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
  minify: true,
});
