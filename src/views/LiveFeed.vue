<template>
  <div class="live-feed-page">
    <h1 class="pa-3">Home Cam Live Feed!</h1>
    <div class="ma-6 mb-9">
      <v-btn @click="userSignOut">sign out</v-btn>
    </div>
    <img style="width: -webkit-fill-available" :src="videoUrl" />
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

const getSrc = async () => {
  const userIdToken = await auth.currentUser.getIdToken();
  videoUrl.value = `/api/video_feed?user_id_token=${userIdToken}`;
};

getSrc();
</script>

<style>
.live-feed-page {
  margin: auto;
  width: 80%;
  max-width: 1000px;
}

@media (max-width: 999px) {
  .live-feed-page {
    width: 70%;
    max-width: 700px;
  }
}
</style>
