<template>
  <div>
    <h1>Home Cam Live Feed!</h1>
    <v-btn @click="userSignOut">sign out</v-btn>
    <img :src="getSrc" width="640" height="480" />
  </div>
</template>

<script setup>
import { auth } from "../JS/firebaseConfig";
import { signOut } from "firebase/auth";

const userSignOut = () => {
  signOut(auth);
};

const getSrc = () => {
  return `/video_feed?user_id=${auth.currentUser.uid}`;
};
</script>

<style></style>
