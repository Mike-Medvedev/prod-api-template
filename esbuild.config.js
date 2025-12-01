import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    outfile: "dist/bundle.js",
    bundle: true,
    platform: "node",
    format: "esm",
    packages: "external",
    alias: {
      "@": "./src",
    },
  })
  .catch(() => process.exit(1));
