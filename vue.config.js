const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "picam",
    short_name: "picam",
    description: "Notification about people at the door",
    themeColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    display: "standalone",
    scope: "/",
    start_url: "/",
    id: "/",
    icons: [
      {
        src: "./public/random.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "public/random.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
    swSrc: "./public/firebase-messaging-sw.js",
    },
  },
});
