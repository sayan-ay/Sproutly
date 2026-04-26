import { create } from "zustand";

export const useEdit = create((set) => ({
  edit: false,
  value: "",
  setValue: (value) => set({ value: value }),
  resetValue: () => set({ value: "" }),
  setEdit: (newstate) => set({ edit: newstate }),
}));
