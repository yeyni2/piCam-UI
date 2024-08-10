<template>
  <div
    class="d-flex flex-column justify-center align-center"
    style="height: 100vh"
  >
    <div class="page">
      <h3>Enter Your PiCam User Credential</h3>
      <v-form class="form">
        <v-text-field v-model="email" label="Email" type="email"></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="togglePasswordVisibility"
        ></v-text-field>
        <v-btn @click="login">Login</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { auth, messaging } from "../JS/firebaseConfig.js";
import { getToken } from "firebase/messaging";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const email = ref("liranyeyni1620@gmail.com");
const password = ref("lioks1234");

const showPassword = ref(false);

const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    const user = userCredential.user;
    requestToken(user);
  } catch (error) {
    console.error(error.message);
    alert("Login faild");
  }
};

const requestToken = async (user) => {
  if (Notification.permission != "granted") {
    await Notification.requestPermission();
  }
  if (Notification.permission != "granted") return;

  getToken(messaging, {
    vapidKey:
      "BCuf1gfQ26ONFqnapY-pXl9khG63_3C_JOdUvC-zFekSAhtmNV6erEY4K3B3725Z48Ch4qr-fv5D8S3xnXlaERs",
  })
    .then(async (currentToken) => {
      if (currentToken) {
        console.log(currentToken);
        await fetch("/api/set_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: currentToken,
            userId: user.uid,
          }),
        });

        router.push("/liveFeed");
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.error("An error occurred while retrieving token. ", err);
    });
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style>
.page {
  width: 350px;
  margin: auto;
  scale: 1.5;
}

.form {
  width: 250px;
  margin: auto;
  margin-top: 2rem;
}
</style>
