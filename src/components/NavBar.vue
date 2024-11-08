<template>
  <v-app>
    <v-app-bar class="navbar" height="auto">
      <div class="navbar__heading" @click="navigateTo('/')">PiCams</div>

      <div v-if="showBtns" class="d-flex">
        <v-btn
          text
          v-for="item in getHeader"
          :key="item.text"
          @click="navigateTo(item.route)"
          :active="false"
          class="navbar__link"
        >
          <v-icon left class="mx-1">
            {{ item.icon }}
          </v-icon>
          {{ item.text }}
        </v-btn>
      </div>
      <div v-else>
        <v-menu v-model="menu" aria-label="Navigation Menu">
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon
              class="navbar__link"
              @click="toggleMenu"
              v-bind="props"
            />
          </template>

          <v-list :class="['list__background']">
            <v-list-item v-for="item in items" :key="item.text">
              <v-list-item-title
                @click="navigate(item.route)"
                class="text-h5 navbar__link select-items"
              >
                <v-icon left class="mx-1">
                  {{ item.icon }}
                </v-icon>
                {{ getText(item.text) }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon class="navbar__link pr-8" @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
  </v-app>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRouter } from "vue-router";
import { getAuth, signOut } from "firebase/auth";

export default {
  name: "NavBar",
  setup() {
    const menu = ref(false);
    const screenWidth = ref(window.innerWidth);
    const showBtns = ref(false);
    const router = useRouter();
    const auth = getAuth();

    const items = [
      { text: "Live Feeds", route: "/", icon: "mdi-camera" },
      { text: "Account", route: "/editAccount", icon: "mdi-account" },
    ];

    const getHeader = computed(() => items);

    const navigateTo = (path) => {
      router.push(path);
      window.scrollTo(0, 0);
    };

    const getText = (name) => {
      return name; // Assuming no translation is needed, as "$t" isn't used in this example
    };

    const toggleMenu = () => {
      menu.value = !menu.value;
    };

    const navigate = (route) => {
      router.push(route);
      toggleMenu();
    };

    const updateScreenWidth = () => {
      screenWidth.value = window.innerWidth;
      isScreenBiggerThan1250();
    };

    const isScreenBiggerThan1250 = () => {
      showBtns.value = screenWidth.value >= 1250;
    };

    const logout = () => {
      signOut(auth)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          console.error("Logout failed: ", error);
        });
    };

    onMounted(() => {
      updateScreenWidth();
      window.addEventListener("resize", updateScreenWidth);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateScreenWidth);
    });

    return {
      menu,
      showBtns,
      items,
      getHeader,
      navigateTo,
      getText,
      toggleMenu,
      navigate,
      logout,
    };
  },
};
</script>

<style scoped>
.navbar {
  background-color: black !important;
  display: flex;
  justify-content: space-between !important;
  /* flex-wrap: wrap; */
  padding: 0.2rem 0.5rem;
  margin-bottom: 0.5rem !important;
  align-items: center;
}
.navbar__link {
  color: #b2b0b9;
  font-size: 1.2rem;
  padding: 0.2rem 1rem;
  align-items: center;
  cursor: pointer;
}
.navbar__heading {
  font-family: "Cursiv" !important;
  color: #fff;
  font-size: 1.8rem;
  line-height: normal;
  padding-bottom: 0.1rem;
  transition: all 0.8s;
}
.navbar__heading:hover {
  color: #fff;
  cursor: pointer;
}
.navbar__link:hover {
  color: #fff;
  cursor: pointer;
}
.list__background {
  margin-top: 0.2rem;
  background-color: #343131f0 !important;
}
.select-items {
  display: flex;
  align-items: center;
}
.v-input {
  flex: none;
}

@media screen and (min-width: 768px) {
  .navbar__heading {
    font-size: 2.5rem;
    margin-left: 0.5rem;
    margin-right: 0.9rem;
  }
}

@media screen and (min-width: 1250px) {
  .navbar__heading {
    font-size: 3rem;
  }
  .headers-container {
    display: block;
  }
  .menu-container {
    display: none;
  }
}
</style>
