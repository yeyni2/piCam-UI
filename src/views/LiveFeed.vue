<template>
  <div class="live-feed-page">
    <h1 class="pa-3">Home Cam Live Feed!</h1>
    <div class="ma-6 mb-9">
      <v-btn @click="userSignOut">sign out</v-btn>
    </div>
    <img :src="videoUrl" />
  </div>
</template>

<script setup>
import { auth } from "../JS/firebaseConfig";
import { signOut } from "firebase/auth";
import { ref } from "vue";

const videoUrl = ref("");

const userSignOut = () => {
  signOut(auth);
  window.location.reload();
};

const getSrc = () => {
  videoUrl.value = `/api/video_feed?user_id=${auth.currentUser.uid}`;
};

getSrc();
</script>

<style>
.live-feed-page {
  margin: auto;
  width: 80%;
  max-width: 1000px;
}
</style>
