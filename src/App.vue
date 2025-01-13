<template>
  <Suspense>
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
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { auth } from "./JS/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const route = useRoute();

const isLoginPage = computed(() => route.path === "/login");

const saveUserInfo = async (user) => {
  if (user) {
    try {
      const userIdToken = await user.getIdToken();

      const userData = await fetch(
        "http://localhost:3000/api/get_account_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userIdToken}`,
          },
        }
      );

      const userDataJson = await userData.json();

      sessionStorage.setItem("userIdToken", userIdToken);
      sessionStorage.setItem("userInfo", JSON.stringify(userDataJson));
    } catch (error) {
      alert(error);
    }
  } else {
    sessionStorage.removeItem("userIdToken");
    sessionStorage.removeItem("userInfo");
  }
};

onMounted(async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await saveUserInfo(currentUser);
  }
});

onAuthStateChanged(auth, async (user) => {
  await saveUserInfo(user);
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
