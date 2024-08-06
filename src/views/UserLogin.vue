<template>
  <div
    id="login-page"
    class="d-flex flex-column justify-center align-center"
    style="height: 100vh"
  >
    <h1 class="ma-4">Login</h1>
    <v-text-feild>Email</v-text-feild>
    <v-text-feild>Password</v-text-feild>
  </div>
</template>

<script setup>
import { auth, messaging } from "../JS/firebaseConfig.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref();
const password = ref();

const login = async () => {
  await auth
    .signInWithEmailAndPassword(email.value, password.value)
    .then((shit) => {
      console.log("shit ", shit);
    });
  const token = await messaging.getToken();
  console.log(token);
  // TODO: Send the token to the server. If the user doesn't exist as a key return an error and dont nav to the next page...
};

onMounted(() => {
  auth.onAuthStateChanged(() => {
    router.push("/liveFeed");
  });
});
</script>

<style>
#login-page {
  scale: 1.4;
}
</style>
