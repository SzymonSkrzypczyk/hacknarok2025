import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'

export default defineConfig({
  plugins: [svelte(), viteSingleFile()],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
    },
  },
})
