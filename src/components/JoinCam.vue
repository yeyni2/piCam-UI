<template>
  <v-card class="py-5 px-7">
    <v-card-title class="mb-3">Joining a new cam?!</v-card-title>
    <v-card-text>
      <v-text-field label="Camera's Name" v-model="cameraName"></v-text-field>
      <div v-for="(desc, key) in descriptions" :key="key" class="d-flex">
        <v-checkbox v-model="checkboxValues[key]" :label="desc.title">
          <template #label>
            {{ desc.title }}
            <v-icon @click="openPopup(key)" class="mx-5" small
              >mdi-information-outline</v-icon
            >
          </template>
        </v-checkbox>
      </div>
      <v-textarea
        class="mt-5"
        v-model="comment"
        label="leave a comment"
        variant="solo-filled"
        clearable
        auto-grow
        row-height="15"
        rows="1"
      ></v-textarea>
    </v-card-text>
    <v-btn @click="makeRquest">Send Request</v-btn>
    <v-dialog v-model="popupVisible">
      <div class="d-flex align-center justify-center">
        <v-card class="pa-5" style="max-width: 600px">
          <v-card-title>{{ popupTitle }}</v-card-title>
          <v-card-text>{{ popupContent }}</v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn text @click="popupVisible = false">Exit</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { getSessionStorageData, serverUrlBase } from "../JS/utils";

const userIdToken = await getSessionStorageData("userIdToken");

const cameraName = ref("");
const comment = ref("");

const emit = defineEmits(["closePopup"]);

const checkboxValues = ref({
  useAccountImages: false,
  requestLiveFeed: false,
  getNotifications: false,
});

const popupVisible = ref(false);
const popupTitle = ref("");
const popupContent = ref("");

const descriptions = {
  useAccountImages: {
    title: "allow usage of account's images (for cam's DB)",
    content: `admins can create ghost users with images they have to identify a person.\n
       Checking the box will give the admin premmision to use images from your account directly insted and help with better identification.\n
       If identification is not requierd by you or by the admin, there is reason to check the box.`,
  },
  requestLiveFeed: {
    title: "Request Live Feed Access",
    content:
      "Enables you to view live fotage from the camera, using a mobile device.",
  },
  getNotifications: {
    title: "Requst Notification Permissions",
    content: `When an event is cought a notification is sent to all the user with said permissions.\n
              This events are normaly identification of people infront of the cam.`,
  },
};

const makeRquest = async () => {
  try {
    await fetch(serverUrlBase + "/api/join_cam_request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        camera: cameraName.value,
        options: checkboxValues.value,
        userIdToken: userIdToken.value,
        sender_comment: comment.value,
      }),
    });
    emit("closePopup");
  } catch (error) {
    alert(error);
  }
};

function openPopup(key) {
  checkboxValues.value[key] = !checkboxValues.value[key];
  popupTitle.value = descriptions[key].title;
  popupContent.value = descriptions[key].content;
  popupVisible.value = true;
}
</script>
