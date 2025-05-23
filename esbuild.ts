import * as esbuild from "esbuild";
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
  plugins: [
    {
      name: "namespace",
      setup(build) {
        build.onStart(async () => {
          console.log("Namespacing exports...");
          await emdash.fs.namespace("emdash");
          console.log("Namespacing done");
        });
      },
    },
  ],
};

async function main() {
  if (watch) {
    const ctx = await esbuild.context(options);

    await ctx.watch();
  } else {
    await esbuild.build(options);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
