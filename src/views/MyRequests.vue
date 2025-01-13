<template>
  <div class="d-flex align-center justify-center">
    <div v-if="requests.length > 0">
      <v-card
        class="pa-7"
        style="min-width: 300px"
        v-for="(request, index) in requests"
        :key="index"
      >
        <v-card-title class="mb-3">{{ request.cam }}</v-card-title>
        <v-card-subtitle>Status: {{ request.status }}</v-card-subtitle>
        <v-card-text>
          <v-checkbox
            v-for="(value, key) in request.options"
            :key="key"
            :model-value="value"
            :label="key"
            disabled
          />
          <div>Creation Date: {{ formatDate(request.timestamp) }}</div>
        </v-card-text>
      </v-card>
    </div>
    <div v-else style="font-size: 2rem; font-weight: 550">
      No Requests Found...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const requests = ref([]);

const userIdToken = sessionStorage.getItem("userIdToken");

onMounted(async () => {
  requests.value = await getRequests();
  console.log(requests.value);
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

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  console.log(date);
  return date.toLocaleDateString();
};
</script>
