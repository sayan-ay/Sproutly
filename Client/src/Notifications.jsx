import { useState, useEffect } from "react";
import { api } from "./axios";
import { useAuthStore } from "./auth/authStore";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import { useNotifStore } from "./notifStore";

export default function Notifications() {
  const [loading, setLoading] = useState(true);

  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  const notifs = useNotifStore((state) => state.notifs);
  const setNotifs = useNotifStore((state) => state.setNotifs);

  // Fetch on mount → populate store
  useEffect(() => {
    api
      .get(`/users/${userId}/notifications`)
      .then((res) => {
        setNotifs(res.data.notifs);
        setLoading(false);
      })
      .catch((err) => console.log("Error", err));
  }, []);

  // No socket logic here — GlobalNotificationListener handles it
  // Store auto-updates → this component re-renders automatically ✅

  const notificationTextMapper = {
    LIKE: (n) => `liked your ${n.commentId ? "comment" : "post"}`,
    DISLIKE: (n) => `disliked your ${n.commentId ? "comment" : "post"}`,
    COMMENT_ON_COMMENT: () => `commented on your comment`,
    COMMENT_ON_POST: () => `commented on your post`,
    FOLLOW: () => "started following you",
    NEW_POST: () => "created a new post",
  };

  const notificationLinkMapper = {
    POST: (n) => {
      if (n.commentId) return `/posts/${n.targetId}#comment-${n.commentId}`;
      return `/posts/${n.targetId}`;
    },
    FOLLOW: (n) => `/profile/${n.sender._id}`,
  };

  async function readHandler(notifId) {
    await api.patch(`/users/${userId}/notifications/${notifId}/mark-read`, {});
  }

  if (loading) return <Loader />;

  return (
    <main className="w-[90%] mt-2 flex flex-col gap-2 mx-15 caret-transparent cursor-default">
      {notifs.length === 0 && (
        <p className="text-xl text-green-800 mt-40 text-center">
          No notifications yet
        </p>
      )}

      {notifs.map((notif) => (
        <div
          className="relative px-10 py-3 h-auto rounded-md bg-white transition-all 
            duration-200 hover:shadow-lg flex items-center justify-center gap-3"
          key={notif._id}
          onClick={() => readHandler(notif._id)}
        >
          {!notif.isRead && (
            <div className="absolute inset-0 bg-blue-400 opacity-20 pointer-events-none" />
          )}

          <Link
            to={`/profile/${notif.sender._id}`}
            className="flex items-center gap-3 shrink-0"
          >
            <img
              src={notif.sender.profilePic}
              className="h-10 w-10 rounded-full object-cover hover:scale-105 
                transition-transform ease-in-out duration-100"
            />
            <span
              className="font-semibold text-gray-900 text-sm hover:underline 
              hover:text-[#111167] hover:scale-95 transition-transform ease-in-out duration-100"
            >
              {notif.sender.username}
            </span>
          </Link>

          <Link
            to={
              notificationLinkMapper[notif.targetType.toUpperCase()]?.(notif) ??
              "#"
            }
            className="flex-1"
          >
            <span className="text-sm text-gray-700">
              {notificationTextMapper[notif.notifType]?.(notif)}
            </span>
          </Link>

          <span className="text-xs text-gray-400 shrink-0">
            {new Date(notif.createdAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </main>
  );
}
