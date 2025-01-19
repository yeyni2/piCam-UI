<template>
  <v-card class="pa-7" style="min-width: 350px">
    <v-btn
      v-if="!isAdminRequest || request.concluded"
      style="position: absolute; top: 16px; right: 16px"
      variant="text"
      icon
      @click="deleteCard"
    >
      <v-icon v-if="request.concluded"> mdi-eye-off </v-icon>
      <v-icon v-else-if="!isAdminRequest"> mdi-delete </v-icon>
    </v-btn>
    <v-card-title>{{ request.camera }}</v-card-title>
    <v-card-subtitle :class="statusClass"
      >Status: {{ request.status }}</v-card-subtitle
    >
    <div class="mt-5" v-if="isAdminRequest">
      Name: {{ request["sender_name"] }}
    </div>
    <div class="mt-2" v-if="isAdminRequest">
      Email: {{ request["sender_email"] }}
    </div>

    <v-card-text>
      <v-checkbox
        v-for="(value, key) in request.options"
        :key="key"
        :model-value="value"
        :label="key"
        disabled
      />
      <v-textarea
        v-if="disableComment"
        class="mt-5"
        v-model="disableComment"
        :label="disabledLable"
        variant="solo-filled"
        auto-grow
        row-height="15"
        rows="1"
        :disabled="true"
      ></v-textarea>
      <div>Creation Date: {{ formatDate(request.timestamp) }}</div>
      <v-textarea
        v-if="!request.concluded && isAdminRequest"
        class="mt-5"
        v-model="admin_comment"
        label="leave a comment"
        variant="solo-filled"
        clearable
        auto-grow
        row-height="15"
        rows="1"
      ></v-textarea>
    </v-card-text>
    <div class="d-flex justify-space-evenly mt-4" v-if="isAdminRequest">
      <v-btn
        :disabled="request.concluded"
        class="deny-btn"
        @click="answer_request('denied', request)"
      >
        deny
      </v-btn>

      <v-btn
        :disabled="request.concluded"
        class="approve-btn"
        @click="answer_request('approved', request)"
      >
        approve
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from "vue";

const emit = defineEmits(["remove-request"]);

const disableComment = ref("");
const disabledLable = ref("");
const admin_comment = ref("");

const userIdToken = sessionStorage.getItem("userIdToken");

const props = defineProps({
  request: {
    type: Object,
    requierd: true,
  },
  isAdminRequest: {
    type: Boolean,
    default: false,
  },
});

const statusClass = computed(() => {
  if (props.request.status == "approved") return "approved-text";
  if (props.request.status == "denied") return "denied-text";
});

const deleteCard = async () => {
  try {
    await fetch("http://localhost:3000/api/delete_request", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userIdToken}`,
      },
      body: JSON.stringify({
        ...props.request,
      }),
    });
    props.request = {};
    emit("remove-request");
  } catch (error) {
    alert(error);
  }
};

const answer_request = async (verdict, request) => {
  try {
    await fetch("http://localhost:3000/api/admin_request_answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userIdToken}`,
      },
      body: JSON.stringify({
        ...props.request,
        answer: {
          verdict,
          admin_comment: admin_comment.value,
        },
      }),
    });
  } catch (error) {
    alert(error);
  }
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

const handleTextArea = () => {
  if (props.isAdminRequest) {
    disableComment.value = props.request["sender_comment"];
    disabledLable.value = "comment from sender";
  } else {
    disableComment.value = props.request["admin_comment"];
    disabledLable.value = "comment from cam's admin";
  }
};

onMounted(() => {
  handleTextArea();
});
</script>

<style scoped>
.approve-btn {
  background-color: aquamarine !important;
}

.deny-btn {
  background-color: lightcoral !important;
  padding: 0px 30px !important;
}

.approved-text {
  color: #5be05b;
}

.denied-text {
  color: #ff00008a;
}
</style>
