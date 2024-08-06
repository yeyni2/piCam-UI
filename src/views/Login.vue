<template>
    <div
      id="login-page"
      class="d-flex flex-column justify-center align-center"
      style="height: 100vh"
    >
      <h1 class="ma-4">Login</h1>
      <div class="mb-5" id="firebaseui-auth-container"></div>
      <v-btn @click="guest">Continue As Guest</v-btn>
    </div>
  </template>
  
  <script setup>
  import { signInAnonymously } from "firebase/auth";
  import { startFirebaseUI } from "../JS/utill.js";
  import { auth } from "../JS/firebaseConfig.js";
  import { onMounted } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  const startLogin = () => {
    startFirebaseUI("#firebaseui-auth-container");
  };
  
  const guest = () => {
    signInAnonymously(auth)
      .then((a) => {
        console.log("gay", auth);
        console.log(a);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  onMounted(() => {
    startLogin();
    auth.onAuthStateChanged((authUser) => {
      console.log(auth);
      router.push("/home");
    });
  });
  </script>
  
  <style>
  #login-page {
    scale: 1.4;
  }
  </style>
  