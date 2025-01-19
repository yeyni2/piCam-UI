<template>
  <div>
    <div class="live-feed-page">
      <h1 class="pa-3">Home Cam Live Feed!</h1>
      <div class="d-flex align-center flex-column">
        <v-btn @click="toggleJoinCamPopup" class="ma-5">Join A New Cam!</v-btn>
        <span v-if="cams.length == 0"> No Cams Found</span>
        <div v-else-if="cams.length > 1">
          <div v-for="cam in cams" @click="startLiveFeed(cam)">
            See {{ cam }} Live Feed!
          </div>
        </div>
        <img v-else style="width: -webkit-fill-available" :src="videoUrl" />
      </div>
    </div>
    <v-dialog v-model="openLiveFeed">
      <div class="d-flex align-center justify-center">
        <img style="width: -webkit-fill-available" :src="videoUrl" />
      </div>
    </v-dialog>
    <v-dialog v-model="joinCamPopup">
      <div class="d-flex align-center justify-center">
        <join-cam @closePopup="toggleJoinCamPopup" />
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { io } from "socket.io-client";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import JoinCam from "../components/JoinCam.vue";

const videoUrl = ref("");
const joinCamPopup = ref(false);
const cams = ref([]);
const openLiveFeed = ref(false);

const userIdToken = sessionStorage.getItem("userIdToken");

const socket = io("localhost:3000", {
  query: {
    userIdToken,
  },
});

socket.on("connect", () => {
  if (cams.value.length == 1) {
    socket.emit("video_feed", { cameras: cams.value[0], userIdToken });
  }
});

socket.on("disconnect", () => {
  socket.disconnect();
});

socket.on("new_frame", (data) => {
  videoUrl.value = `data:image/jpeg;base64,${data.frame}`;
});

const startLiveFeed = (cam) => {
  if (socket.connected) {
    socket.emit("video_feed", { cameras: cam });
    openLiveFeed.value = true;
  }
};

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

const handleUnloadPage = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

const get_cams = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

  if (userInfo && "cameras" in userInfo) {
    cams.value = userInfo["cameras"];
  }
};

onBeforeMount(() => {
  get_cams();
  if (!socket.connected) {
    socket.connect();
  }
  window.addEventListener("beforeunload", handleUnloadPage);
});

onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect();
  }
  window.removeEventListener("beforeunload", handleUnloadPage);
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
