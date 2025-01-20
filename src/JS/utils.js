import { auth } from "../JS/firebaseConfig";
import { useSessionStorageStore } from "../store/index";

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

const getSessionStorageData = (fieldName) => {
  const currentUser = auth.currentUser;

  if (!currentUser) return undefined;

  saveUserInfo(currentUser);

  return sessionStorage.getItem(fieldName);
};

const saveUserInfo = async (user) => {
  const sessionStore = useSessionStorageStore();
  if (user) {
    try {
      if (sessionStore.isLoading) {
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

      const userData = await fetch(
        "http://localhost:3000/api/get_account_info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userIdToken}`,
          },
        }
      );

      const userDataJson = await userData.json();

      sessionStorage.setItem("datetime", new Date());
      sessionStorage.setItem("userIdToken", userIdToken);
      sessionStorage.setItem("userInfo", JSON.stringify(userDataJson));

      window.dispatchEvent(new Event("sessionStorageChanged"));
      if (sessionStore) {
        sessionStore.setDatetime(sessionStorage.getItem("datetime"));
      }
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
      sessionStore.setIsLoading(false);
    }
  }
};

export { getSessionStorageData, saveUserInfo, requireRule, minLengthRule };
