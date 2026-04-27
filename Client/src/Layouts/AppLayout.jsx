import Navbar from "../Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useLogout } from "../auth/logout";
import { useSocketStore } from "../socketstore";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { api } from "../axios";

export default function AppLayout() {
  const logout = useLogout();
  const navigate = useNavigate();

  const setSocket = useSocketStore((state) => state.setSocket);

  useEffect(() => {
    let socketInstance;

    api
      .post("/auth/me", {})
      .then(() => {
        socketInstance = io(import.meta.env.VITE_API_BASE_URL, { withCredentials: true });
        
        socketInstance.on("connect", () => {
          console.log("socket connected successfully");
        });

        setSocket(socketInstance);
      })
      .catch((err) => {
        console.error(
          "Auth check failed:",
          err.response?.status ?? err.message,
        );
        if (err.response?.status === 401) {
          logout();
          
        }
      });

    return () => {
      if (socketInstance) {
        socketInstance.off("connect");
      }
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className=" max-w-200 w-full flex flex-col min-h-screen pb-10 mx-auto ">
        <Outlet />
      </div>
    </>
  );
}
