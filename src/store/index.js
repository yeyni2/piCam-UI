import { defineStore } from "pinia";

export const useSessionStorageStore = defineStore("sessionStorageStore", {
  state: () => ({
    datetime: null,
    isLoading: false,
  }),
  getters: {},
  actions: {
    setDatetime(newVal) {
      this.datetime = newVal;
    },
    setIsLoading(newVal) {
      this.isLoading = newVal;
    },
  },
});
