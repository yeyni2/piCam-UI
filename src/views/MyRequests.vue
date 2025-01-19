<template>
  <div class="d-flex align-center justify-center">
    <div v-if="requests.length > 0">
      <RequestsCard
        v-for="(request, index) in requests"
        :key="index"
        :request="request"
        @remove-request="requests.splice(index, 1)"
      />
    </div>
    <div v-else-if="!loading" style="font-size: 2rem; font-weight: 550">
      No Requests Found...
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import RequestsCard from "../components/RequestsCard.vue";

const requests = ref([]);
const loading = ref(false);

const userIdToken = sessionStorage.getItem("userIdToken");

onBeforeMount(async () => {
  loading.value = true;
  requests.value = await getRequests();
  loading.value = false;
});

const getRequests = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/get_my_requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userIdToken}`,
      },
    });
    return response.json();
  } catch (error) {
    alert(error);
  }
};
</script>
