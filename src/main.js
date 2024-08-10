import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components";
import * as directives from "vuetify/lib/directives";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: "mdi",
    defaultSet: "mdi",
  },
});

createApp(App).use(store).use(router).use(vuetify).mount("#app");

navigator.serviceWorker.register("/firebase-messaging-sw.js").catch((err) => {
  console.error("Service worker registration failed:", err);
});
