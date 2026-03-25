import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    isAdmin: (state) => state.user?.username === 'admin',
  },
  actions: {
    setUser(user) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
    updateUser(updates) {
      if (this.user) {
        this.user = { ...this.user, ...updates };
      }
    },
  },
  persist: true,
});