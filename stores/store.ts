import { defineStore } from "pinia";

export const useUserStore = defineStore("user-store", {
  state: () => ({
    name: "",
    phone: "",
  }),

  getters: {
    getName(): string {
      return this.name;
    },
    getPhone(): string {
      return this.phone;
    },
  },

  actions: {
    setName(val: string) {
      this.name = val;
    },
    setPhone(val: string) {
      this.phone = val;
    },
  },
});

// hot updates
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
