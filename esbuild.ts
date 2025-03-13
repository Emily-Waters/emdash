import * as esbuild from "esbuild";
import * as fs from "fs";
import emdash from "./emdash";

const args = process.argv.slice(2);
const watch = args.includes("--watch");

const options: esbuild.BuildOptions = {
  entryPoints: ["./emdash/**/*.ts"],
  format: "cjs",
  outdir: "dist",
  minify: !watch,
  sourcemap: watch,
  define: {
    "process.env.NODE_ENV": watch ? '"development"' : '"production"',
  },
};

async function main() {
  await emdash.fs.namespace("emdash");

  if (watch) {
    const ctx = await esbuild.context(options);

    let ns = false;

    fs.watch("emdash", { recursive: true }, async (event, filename) => {
      if (filename?.includes("index.ts")) {
        return;
      }

      if (!ns) {
        ns = true;
        console.log(`[${event}]: ${filename}`);
        await emdash.fs
          .namespace("emdash")
          .then(() => ctx.rebuild())
          .then(() => (ns = false));
      }
    });

    await ctx.watch();
  } else {
    await esbuild.build(options);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
