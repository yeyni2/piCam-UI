import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    userInfo: {},
  }),
  getters: {},
  actions: {
    async saveUserInfo(user) {
      if (user) {
        try {
          const lastDataUpdate = sessionStorage.getItem("datetime");
          if (lastDataUpdate) {
            const differenceInHours =
              (new Date() - new Date(lastDataUpdate)) / (1000 * 60 * 60);
            if (differenceInHours < 1) {
              this.datetime = sessionStorage.getItem(datetime);
              this.userIdToken = sessionStorage.getItem(userIdToken);
              this.userInfo = sessionStorage.getItem(userInfo);
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

          this.datetime = sessionStorage.getItem(datetime);
          this.userIdToken = userIdToken;
          this.userInfo = sessionStorage.getItem(userInfo);
        } catch (error) {
          alert(error);
        }
      } else {
        sessionStorage.removeItem("userIdToken");
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("datetime", new Date());

        this.datetime = null;
        this.userIdToken = null;
        this.userInfo = null;
      }
    },
  },
});
