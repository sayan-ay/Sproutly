import { useEffect, useRef } from "react";

import toast from "react-hot-toast";
import { useSocketStore } from "./socketstore";
import { useNotifStore } from "./notifStore";
import { useAuthStore } from "./auth/authStore";
import notifSound from "./assets/notif.wav";

const notificationTextMapper = {
  LIKE: (n) => `liked your ${n.commentId ? "comment" : "post"}`,
  DISLIKE: (n) => `disliked your ${n.commentId ? "comment" : "post"}`,
  COMMENT_ON_COMMENT: () => `commented on your comment`,
  COMMENT_ON_POST: () => `commented on your post`,
  FOLLOW: () => "started following you",
  NEW_POST: () => "created a new post",
};

export default function GlobalNotificationListener() {
  const socket = useSocketStore((state) => state.socket);
  const user = useAuthStore((state) => state.user);
  const addNotif = useNotifStore((state) => state.addNotif);
  const notifSoundRef = useRef(new Audio(notifSound));

  useEffect(() => {
    if (!socket || !user) return;

    function handler(data) {
      notifSoundRef.current.currentTime = 0;
      notifSoundRef.current.play().catch((e) => console.log("Sound error:", e));
      addNotif(data);
      toast.custom(
        (t) => (
          <div
            className={`px-6 border-l-4 border-indigo-500 bg-white font-semibold py-4 rounded-md shadow-lg transition-opacity duration-300 ${t.visible ? "opacity-100" : "opacity-0"}`}
          >
            <span className="text-indigo-600">{data.sender.username}</span>{" "}
            <span className="text-gray-600 font-normal">
              {notificationTextMapper[data.notifType]?.(data)}
            </span>
          </div>
        ),
        {
          duration: 1200,
        },
      );
    }

    socket.on("notification-add", handler);
    return () => socket.off("notification-add", handler);
  }, [socket, user]);

  return null;
}
