import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: './src/package.ts'
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  outDir: 'dist',
  outExtension: () => {
    return {
      js: '.js'
    }
  },
  external: [
    'zod', 
    '@modelcontextprotocol/sdk'
  ],
  minify: true
});