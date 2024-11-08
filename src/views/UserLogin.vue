<template>
  <div
    class="d-flex flex-column justify-center align-center"
    style="height: 100vh"
  >
    <div class="page">
      <h3>Enter Your User Credential</h3>
      <v-form class="form">
        <v-text-field
          v-model="email"
          label="Email"
          type="email"
          :rules="[requireRule]"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="togglePasswordVisibility"
          :rules="[requireRule, minLengthRule(6)]"
        ></v-text-field>
        <v-btn @click="login">{{ submitBtnText }}</v-btn>

        <div class="ma-5">
          <p v-if="signUp">
            Already have a user?
            <span class="singup-text" @click="togglePage">Login</span>
          </p>
          <p v-else>
            Don't have a user?
            <span class="singup-text" @click="togglePage">Singup</span>
          </p>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script setup>
import { auth, messaging } from "../JS/firebaseConfig.js";
import { getToken } from "firebase/messaging";
import { minLengthRule, requireRule } from "../JS/utils.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const email = ref("");
const password = ref("");

const showPassword = ref(false);

const signUp = ref(false);
const submitBtnText = ref("Login");

const login = async () => {
  let user = "";
  try {
    let userCredential = "";
    if (signUp.value) {
      userCredential = await register();
    } else {
      userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );
    }
    user = userCredential.user;
  } catch (error) {
    console.error(error.message);
    alert(error.message);
    return;
  }
  await requestToken(user).catch((error) => {
    alert(error);
  });
  router.push("/");
};

const register = async () => {
  let userCredential = await createUserWithEmailAndPassword(
    auth,
    email.value,
    password.value
  );

  await fetch("api/add_new_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userIdToken: await userCredential.user.getIdToken(true),
    }),
  });

  return userCredential;
};

const requestToken = async (user) => {
  if (!("Notification" in window)) {
    alert("your browser doesn't support notification");
    return;
  }
  if (Notification.permission != "granted") {
    await Notification.requestPermission();
  }
  if (Notification.permission != "granted") {
    alert(
      "Your notification are blocked, you will not get messages when someone is at the door"
    );
    return;
  }

  await getToken(messaging, {
    vapidKey:
      "BCuf1gfQ26ONFqnapY-pXl9khG63_3C_JOdUvC-zFekSAhtmNV6erEY4K3B3725Z48Ch4qr-fv5D8S3xnXlaERs",
  })
    .then(async (currentToken) => {
      if (currentToken) {
        await fetch("http://localhost:3000/api/set_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageToken: currentToken,
            userIdToken: await user.getIdToken(true),
          }),
        });
      } else {
        alert("No registration token available");
      }
    })
    .catch((err) => {
      console.error("An error occurred while retrieving token. ", err);
      alert("An error occurred while retrieving token. ", err);
    });
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const togglePage = () => {
  signUp.value = !signUp.value;
  if (signUp.value) {
    submitBtnText.value = "Signup";
  } else {
    submitBtnText.value = "Login";
  }
};
</script>

<style scoped>
.page {
  width: 50%;
  max-width: 350px;
  margin: auto;
  scale: 1.5;
}

.form {
  width: 95%;
  max-width: 250px;
  margin: auto;
  margin-top: 2rem;
}

.singup-text {
  color: blue;
  cursor: pointer;
}

.singup-text:hover {
  text-decoration: underline; /* Underline on hover to show it’s clickable */
}
</style>
