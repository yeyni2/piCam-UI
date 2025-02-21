import { auth } from "../JS/firebaseConfig";
import { useSessionStorageStore } from "../store/index";
import { storeToRefs } from "pinia";

const serverUrlBase = "/";
// const serverUrlBase = "http://localhost:3000/";

const minLengthRule = (minLength) => {
  return (value) => {
    return (
      (value && value.length >= minLength) ||
      "password needs to be longer then 6 chars"
    );
  };
};

const requireRule = (v) => {
  return (v && v.trim() !== "") || "Must have a value";
};

const getSessionStorageData = async (fieldName) => {
  const sessionStore = useSessionStorageStore();

  const currentUser = auth.currentUser;

  if (!currentUser) return undefined;

  await saveUserInfo(currentUser);

  return storeToRefs(sessionStore)[fieldName];
};

const saveUserInfo = async (user, isAuthChange = false) => {
  const sessionStore = useSessionStorageStore();
  if (user) {
    try {
      if (sessionStore.isLoading && !isAuthChange) {
        return;
      }
      sessionStore.setIsLoading(true);

      const lastDataUpdate =
        sessionStore && sessionStore.datetime
          ? sessionStore.datetime
          : sessionStorage.getItem("datetime");
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
      let savedMail = undefined;

      if (userInfo && "email" in userInfo) {
        savedMail = userInfo["email"];
      }
      if (
        lastDataUpdate &&
        ((savedMail && savedMail == user.email) || !savedMail)
      ) {
        const differenceInHours =
          (new Date() - new Date(lastDataUpdate)) / (1000 * 60 * 60);
        if (differenceInHours < 1) {
          return;
        }
      }

      const userIdToken = await user.getIdToken();

      const userData = await fetch(serverUrlBase + "api/get_account_info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userIdToken}`,
        },
      });

      const userDataJson = await userData.json();

      sessionStorage.setItem("datetime", new Date());
      sessionStorage.setItem("userIdToken", userIdToken);
      sessionStorage.setItem("userInfo", JSON.stringify(userDataJson));

      if (sessionStore) {
        sessionStore.setDatetime(sessionStorage.getItem("datetime"));
        sessionStore.setUserInfo(userDataJson);
        sessionStore.setUserIdToken(userIdToken);
      }
      window.dispatchEvent(new Event("sessionStorageChanged"));
      console.log("dispatch");
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      if (sessionStore) {
        sessionStore.setIsLoading(false);
      }
    }
  } else {
    sessionStorage.removeItem("userIdToken");
    sessionStorage.removeItem("userInfo");
    sessionStorage.removeItem("datetime");
    if (sessionStore) {
      sessionStore.setDatetime(null);
      sessionStore.setUserInfo(null);
      sessionStore.setUserIdToken(null);
      sessionStore.setIsLoading(false);
    }
  }
};

export {
  getSessionStorageData,
  saveUserInfo,
  requireRule,
  minLengthRule,
  serverUrlBase,
};
