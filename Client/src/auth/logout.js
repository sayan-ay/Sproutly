import { api } from "../axios";
import { useAuthStore } from "./authStore";

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const logout = () => {
    api
      .post("/users/logout", {})
      .then((res) => {
        localStorage.removeItem("user-storage");
        clearUser();
      })
      .catch((err) => {
        alert(err);
      });
  };
  return logout;
};
