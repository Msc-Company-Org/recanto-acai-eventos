import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Testes de lógica pura rodam em ambiente Node. Arquivos que precisam de `window`
// (ex.: tracking.ts) podem declarar `// @vitest-environment happy-dom` no topo.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    globals: true,
    include: ["lib/**/*.test.ts", "components/**/*.test.tsx", "tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      exclude: ["lib/**/*.test.ts", "lib/db.ts", "lib/schema.ts", "lib/content.ts"],
    },
  },
});
