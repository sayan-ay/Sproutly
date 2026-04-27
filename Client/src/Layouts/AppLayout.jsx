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
    api
      .post("/auth/me", {})
      .then(() => {
        const socket = io("http://localhost:3000", { withCredentials: true });
        setSocket(socket);
      })
      .catch((err) => {
        console.error(
          "Auth check failed:",
          err.response?.status ?? err.message,
        );
        if( err.response?.status===401){
        logout();
        navigate("/signin");
        }
      });
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
