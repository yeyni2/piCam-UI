import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/lib/components";
import * as directives from "vuetify/lib/directives";
import "@mdi/font/css/materialdesignicons.css";

const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    iconfont: "mdi",
    defaultSet: "mdi",
  },
});

const app = createApp(App);
app.use(pinia).use(router).use(vuetify).mount("#app");
app.config.warnHandler = () => {};
