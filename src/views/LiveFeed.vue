<template>
  <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.js"></script> -->
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
import { io } from "socket.io-client";
import { onBeforeUnmount, ref } from "vue";

const videoUrl = ref("");

const userSignOut = () => {
  signOut(auth);
  window.location.reload();
};

const userIdToken = await auth.currentUser.getIdToken();
const socket = io("localhost:3000", {
  query: {
    userIdToken,
  },
});

socket.on("connect", () => {
  socket.emit("video_feed");
});

socket.on("disconnect", () => {
  socket.disconnect();
});

socket.on("new_frame", (data) => {
  videoUrl.value = `data:image/jpeg;base64,${data.frame}`;
});

onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect();
  }
});
</script>

<style>
.live-feed-page {
  margin: auto;
  width: 90%;
  max-width: 1000px;
}

@media (max-width: 999px) {
  .live-feed-page {
    width: 70%;
    max-width: 700px;
  }
}
</style>
