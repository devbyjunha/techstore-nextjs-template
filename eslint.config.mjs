// eslint-config-next v16 exports flat config arrays directly.
// Import them via standard ESM to avoid the FlatCompat circular-reference error.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "techstore-nextjs-template/**",
    ],
  },
];

export default eslintConfig;
