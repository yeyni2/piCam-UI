import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBByeGSOiAnyZcuyP_jgRgjYoXnzAM-mM4",
  authDomain: "picam-262bc.firebaseapp.com",
  projectId: "picam-262bc",
  storageBucket: "picam-262bc.appspot.com",
  messagingSenderId: "963842013886",
  appId: "1:963842013886:web:0ec795658960a996eebcef",
  measurementId: "G-H2Z212699G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log("Message received. ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    new Notification(notificationTitle, notificationOptions);
  }
});

export { auth, messaging };
