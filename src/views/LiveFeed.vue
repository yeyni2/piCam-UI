<template>
  <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.js"></script> -->
  <div class="live-feed-page">
    <h1 class="pa-3">Home Cam Live Feed!</h1>
    <v-btn @click="toggleJoinCamPopup" class="ma-5">Join A New Cam!</v-btn>
    <img style="width: -webkit-fill-available" :src="videoUrl" />
  </div>
  <v-dialog v-model="joinCamPopup">
    <div class="d-flex align-center justify-center">
      <join-cam @closePopup="toggleJoinCamPopup" />
    </div>
  </v-dialog>
</template>

<script setup>
import { io } from "socket.io-client";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import JoinCam from "../components/JoinCam.vue";

const videoUrl = ref("");
const joinCamPopup = ref(false);

const userIdToken = sessionStorage.getItem("userIdToken");

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

const toggleJoinCamPopup = () => {
  joinCamPopup.value = !joinCamPopup.value;
  if (joinCamPopup.value) {
    if (socket.connected) {
      socket.disconnect();
    }
  } else {
    if (!socket.connected) {
      socket.connect();
    }
  }
};

onBeforeMount(() => {
  if (!socket.connected) {
    socket.connect();
  }
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
