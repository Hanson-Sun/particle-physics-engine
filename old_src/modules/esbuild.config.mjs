// esbuild script
import * as esbuild from 'esbuild'

await esbuild
  .build({
    entryPoints: ['testFile.js'],
    bundle: true,
    outfile: 'dist/bundle.js',
    format: 'iife',
    globalName: 'Engine', // Specify the global variable name for the class
  })
  .catch(() => process.exit(1));