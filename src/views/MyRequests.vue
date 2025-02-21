<template>
  <div
    class="d-flex align-center justify-center"
    style="margin-top: 100px !important"
  >
    <div class="my-requests" v-if="requests.length > 0">
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
import { getSessionStorageData, serverUrlBase } from "../JS/utils";

const requests = ref([]);
const loading = ref(false);

const userIdToken = await getSessionStorageData("userIdToken");

onBeforeMount(async () => {
  loading.value = true;
  requests.value = await getRequests();
  loading.value = false;
});

const getRequests = async () => {
  try {
    const response = await fetch(serverUrlBase + "api/get_my_requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userIdToken.value}`,
      },
    });
    return response.json();
  } catch (error) {
    alert(error);
  }
};
</script>

<style>
.my-requests {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

@media screen and (max-width: 720px) {
  .my-requests {
    flex-direction: column;
  }
}
</style>
