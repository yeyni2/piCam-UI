<template>
  <div class="page">
    <h1>Account Informaion</h1>
    <v-form class="form">
      <v-text-field
        v-model="accountInfo.email"
        label="Email"
        type="email"
        class="input"
        variant="solo"
        disabled
      ></v-text-field>
      <v-text-field
        v-model="accountInfo.name"
        label="Name"
        class="input"
        variant="solo"
      ></v-text-field>
      <v-file-input
        v-model="newImages"
        label="Images of your face"
        multiple
        accept="image/*"
        class="input"
        variant="solo"
      ></v-file-input>
      <v-btn @click="saveInfo" size="x-large">save</v-btn>
    </v-form>
    <h2 class="mb-12">Face recognition images</h2>
    <div class="images-container">
      <div
        v-for="(image, index) in accountInfo.images"
        :key="image.imagePath"
        class="image-wrapper"
      >
        <img :src="image.url" alt="User Image" class="account-image" />
        <v-icon class="delete-icon" @click="deleteImage(index)">
          mdi-trash-can-outline
        </v-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { auth } from "../JS/firebaseConfig.js";
import { ref, onMounted } from "vue";
import axios from "axios";

const accountInfo = ref({});
const newImages = ref([]);

const userIdToken = await auth.currentUser.getIdToken();

const saveInfo = async () => {
  const formData = new FormData();

  formData.append("userIdToken", userIdToken);
  formData.append("name", accountInfo.value.name);

  for (let i = 0; i < newImages.value.length; i++) {
    formData.append("images", newImages.value[i]);
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/edit_account_details",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (accountInfo.value.images) {
      accountInfo.value.images = [
        ...new Set([
          ...accountInfo.value.images,
          ...response.data.uploadedImages,
        ]),
      ];
    } else {
      accountInfo.value.images = response.data.uploadedImages;
    }
    newImages.value = [];
  } catch (error) {
    alert(error);
  }
};

const getUserData = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/get_account_info", {
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

const deleteImage = async (index) => {
  try {
    fetch("http://localhost:3000/api/delete_image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imagePath: accountInfo.value.images[index].imagePath,
        userIdToken: userIdToken,
      }),
    });
    accountInfo.value.images.splice(index, 1);
  } catch (error) {
    alert(error);
  }
};

onMounted(async () => {
  accountInfo.value = await getUserData();
});
</script>

<style>
.page {
  margin-top: 5rem !important;
}
.form {
  margin-top: 2rem !important;
  margin: auto;
  max-width: 500px;
  width: 80%;
  padding-bottom: 3rem;
}

.input {
  min-height: 110px;
}

.singup-text {
  color: blue;
  cursor: pointer;
}

.singup-text:hover {
  text-decoration: underline;
}

.images-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 80%;
  margin: auto;
  max-width: 1400px;
}

.image-wrapper {
  width: calc(100% / 3 - 2rem);
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
}

.account-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 30px;
  position: absolute;
  top: 0;
  left: 0;
  transition: filter 0.5s ease, transform 0.5s ease;
}

.image-wrapper:hover .account-image,
.image-wrapper:focus-within .account-image {
  filter: grayscale(100%) blur(2px);
}

.delete-icon {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem !important;
  color: white !important;
  opacity: 0.65;
  transition: opacity 0.5s ease;
}

.image-wrapper:hover .delete-icon,
.image-wrapper:focus-within .delete-icon {
  opacity: 1;
}

@media screen and (min-width: 650px) {
  .images-container {
    width: 70%;
  }

  .image-wrapper {
    width: calc(100% / 4 - 2rem);
  }
  .delete-icon {
    opacity: 0;
  }
}
@media screen and (min-width: 1100px) {
  .images-container {
    width: 60%;
  }

  image-wrapper {
    width: calc(100% / 5 - 2rem);
  }
}
</style>
