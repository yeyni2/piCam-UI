<template>
  <Suspense v-if="!sessionStore.isLoading">
    <template #default>
      <router-view class="router" />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
  <NavBar v-if="!isLoginPage" />
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import { ref } from "vue";
import { auth } from "./JS/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { saveUserInfo } from "./JS/utils";
import { useSessionStorageStore } from "./store/index";

const sessionStore = useSessionStorageStore();

const isLoginPage = ref(true);


onAuthStateChanged(auth, async (user) => {
  await saveUserInfo(user);
  isLoginPage.value = false;
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
  margin-top: 80px !important;
}
</style>
