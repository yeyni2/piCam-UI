<template>
  <div>
    <h1>Home Cam Live Feed!</h1>
    <v-btn @click="userSignOut">sign out</v-btn>
    <img :src="videoUrl" width="640" height="480" />
  </div>
</template>

<script setup>
import { auth } from "../JS/firebaseConfig";
import { signOut } from "firebase/auth";
import { ref } from "vue";

const videoUrl = ref("");

const userSignOut = () => {
  signOut(auth);
};

const getSrc = () => {
  videoUrl.value = `/api/video_feed?user_id=${auth.currentUser.uid}`;
};

getSrc();
</script>

<style></style>
