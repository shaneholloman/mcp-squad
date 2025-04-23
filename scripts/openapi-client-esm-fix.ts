import fs from "fs";
import * as glob from "glob";
import path from "path";

const files = glob.sync("./src/lib/openapi/squad/**/*.ts");

files.forEach(file => {
  const content = fs.readFileSync(file, "utf8");
  // Fix relative imports without extensions (both ./ and ../ paths)
  const fixed = content.replace(
    /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g,
    (_match, p1, p2, p3) => {
      // Skip if already ends with .js or .json
      if (p2.endsWith(".js") || p2.endsWith(".json")) return `${p1}${p2}${p3}`;
      return `${p1}${p2}.js${p3}`;
    },
  );
  fs.writeFileSync(file, fixed);
  console.log(`✔️ fixed imports in ${path.relative(".", file)}`);
});
