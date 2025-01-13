import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    userInfo: {},
  }),
  getters: {},
  actions: {
    setUserInfo(newValue) {
      this.userInfo = newValue;
    },
  },
});
