import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LiveFeed from "../views/LiveFeed.vue";
import Login from "../views/UserLogin.vue";
import EditAccount from "../views/EditAccount.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "LiveFeed",
    component: LiveFeed,
  },
  {
    path: "/editAccount",
    name: "editAccount",
    component: EditAccount,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      if (to.path != "/login") {
        next("/login");
      } else {
        next();
      }
    } else if (to.path == "/login") {
      next("/");
    } else {
      next();
    }
  });
});

export default router;
