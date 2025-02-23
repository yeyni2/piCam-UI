<template>
  <Suspense v-showS="!sessionStore.isLoading">
    <template #default>
      <router-view class="router" />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
  <NavBar v-if="!sessionStore.isLoginPage" />
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import { auth } from "./JS/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { saveUserInfo } from "./JS/utils";
import { useSessionStorageStore } from "./store/index";
import { onBeforeMount } from "vue";

const sessionStore = useSessionStorageStore();

onAuthStateChanged(auth, async (user) => {
  if (!sessionStore.isRegistering) {
    await saveUserInfo(user, true);
  }
  if (user) {
    sessionStore.setIsLoginPage(false);
  }
});

onBeforeMount(() => {
  sessionStore.setDatetime(sessionStorage.getItem("datetime"));
  sessionStore.setUserIdToken(sessionStorage.getItem("userIdToken"));
  sessionStore.setUserInfo(JSON.parse(sessionStorage.getItem("userInfo")));
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.router {
  margin-top: 100px !important;
}
</style>
