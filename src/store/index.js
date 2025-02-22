import { defineStore } from "pinia";

export const useSessionStorageStore = defineStore("sessionStorageStore", {
  state: () => ({
    datetime: null,
    userInfo: null,
    userIdToken: null,
    isLoading: true,
    isLoginPage: true,
    isRegistering: true,
  }),
  getters: {},
  actions: {
    setUserInfo(newVal) {
      this.userInfo = newVal;
    },
    setUserIdToken(newVal) {
      this.userIdToken = newVal;
    },
    setDatetime(newVal) {
      this.datetime = newVal;
    },
    setIsLoading(newVal) {
      this.isLoading = newVal;
    },
    setIsLoginPage(newVal) {
      this.isLoginPage = newVal;
    },
    setIsRegistering(newVal) {
      this.isRegistering = newVal;
    },
  },
});
