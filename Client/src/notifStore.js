// store/notifStore.js
import { create } from "zustand";

export const useNotifStore = create((set) => ({
  notifs: [],

  setNotifs: (notifs) => set({ notifs }), // called on initial API fetch

  addNotif: (notif) =>
    set((state) => ({
      // called by socket
      notifs: [notif, ...state.notifs],
    })),
}));
