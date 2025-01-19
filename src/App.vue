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
import { computed, onBeforeMount } from "vue";
import { auth } from "./JS/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const route = useRoute();

const isLoginPage = computed(() => route.path === "/login");

const saveUserInfo = async (user) => {
  if (user) {
    try {
      const lastDataUpdate = sessionStorage.getItem("datetime");
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      let savedMail = undefined;

      if (userInfo && "email" in userInfo) {
        savedMail = userInfo["email"];
      }
      if (
        lastDataUpdate &&
        ((savedMail && savedMail == user.email) || !savedMail)
      ) {
        const differenceInHours =
          (new Date() - new Date(lastDataUpdate)) / (1000 * 60 * 60);
        if (differenceInHours < 1) {
          return;
        }
      }

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

      sessionStorage.setItem("datetime", new Date());
      sessionStorage.setItem("userIdToken", userIdToken);
      sessionStorage.setItem("userInfo", JSON.stringify(userDataJson));
      window.dispatchEvent(new Event("authChange"));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  } else {
    sessionStorage.removeItem("userIdToken");
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("datetime");
  }
};

onBeforeMount(async () => {
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
  margin-top: 80px !important;
}
</style>
