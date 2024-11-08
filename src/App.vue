<template>
  <Suspense>
    <template #default>
      <router-view class="router" />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
  <NavBar v-if="isLoginPage" />
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const isLoginPage = computed(() => route.path !== "/login");
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.router {
  margin-top: 64px !important;
}
</style>
