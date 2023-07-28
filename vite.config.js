import { defineConfig } from "vite";

const examplePlugin = () => ({
  name: "example-plugin",
  transform(src, id) {
    console.log(id);
    if (id.includes(".css")) {
      console.log(src);
      return src.replace("red", "blue");
    }
  },
});

export default defineConfig({
  // plugins: [examplePlugin()],
  build: {
    rollupOptions: {},
    sourcemap: true,
  },
  server: {
    hmr: false,
  },
  css: {
    devSourcemap: true,
    // sourceMap: true,
    postcss: {
      map: {
        inline: false,
      },
    },
    // lightningcss: {

    // },
  },
});
