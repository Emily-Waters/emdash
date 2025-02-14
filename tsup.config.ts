import { defineConfig } from "tsup";

const config = defineConfig({
  entry: ["src/**/*"],
  outDir: "dist",
  splitting: false,

  sourcemap: true,
  clean: true,
});

export default config;
