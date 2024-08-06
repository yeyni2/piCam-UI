import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LiveFeed from "../views/LiveFeed.vue";
import Login from "../views/UserLogin.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/liveFeed",
    name: "LiveFeed",
    component: LiveFeed,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (to.path === "/") {
        next("/LiveFeed");
      } else {
        next();
      }
    } else {
      if (to.path !== "/") {
        next("/");
      } else {
        next();
      }
    }
  });
});

export default router;
