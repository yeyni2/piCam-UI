<template>
  <div>
    <h1>Home Cam Live Feed!</h1>
    <!-- TODO: create an image with href as in the python server -->
  </div>
</template>

<script setup>
import { auth } from "../JS/firebaseConfig.js";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// TODO: get users home cam ip from the server, then make the live feed from that ip.

</script>

<style>
#login-page {
  scale: 1.4;
}
</style>
