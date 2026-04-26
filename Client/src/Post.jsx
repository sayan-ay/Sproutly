import { api } from "./axios";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Blogcard from "./Blogcard";
import { CommentSection } from "./comment";
import { useAuthStore } from "./auth/authStore";

import {
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
  Forward,
  Bookmark,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Post({ postArg }) {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [commentVisibility, setCommentVisibility] = useState(false);
  const [post, setPost] = useState(postArg);
  const navigate = useNavigate();

  const postId = post?._id;

  const myReaction = post?.reactions?.find(
    (r) => r.userId?.toString() === userId?.toString(),
  );

  const isLiked = myReaction?.reaction === "LIKE";
  const isUnliked = myReaction?.reaction === "DISLIKE";
  const isBookmarked = post.isBookmarked;
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    setCommentVisibility(true);
    if (!commentsLoaded) return;

    requestAnimationFrame(() => {
      const commentID = hash.replace("#comment-", "");
      const comment = document.getElementById(commentID);
      if (comment) {
        comment.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, [hash, commentsLoaded]);

  async function sharePostHandler() {
    const url = `${location.origin}/posts/${postId}`;

    await toast.promise(
      navigator.clipboard.writeText(url),
      {
        loading: "Copying...",
        success: <b className=" text-green-800">Copied to clipboard</b>,
        error: (err) => (
          <b className=" text-red-800">
            Some error ocurred{err.response?.data?.message}
          </b>
        ),
      },
      {
        duration: 1500,
        position: "bottom-center",
        className: "mb-10  p-10",
      },
    );
  }

  async function bookmarkHandler() {
    if (!userId) return navigate("/signin");

    const prevPost = structuredClone(post);

    //  optimistic update
    setPost((prev) => ({
      ...prev,
      isBookmarked: !prev.isBookmarked,
    }));

    try {
      if (prevPost.isBookmarked) {
        await api.delete(`/bookmarks/${postId}`);
      } else {
        await api.post(`/bookmarks/${postId}`, {});
      }
    } catch (err) {
      // rollback on failure
      setPost(prevPost);
      console.log(err.message);
    }
  }

  async function ReactionHandler(reaction) {
    console.log("ReactionHandler called");
    console.log("postId:", postId);
    console.log("userId:", userId);

    if (!userId) return navigate("/signin");
    let prevState = structuredClone(post);
    setPost((prev) => {
      let reactions = [...prev.reactions];
      if (myReaction) {
        if (myReaction.reaction === reaction) {
          reactions = reactions.filter(
            (r) => r.userId.toString() !== userId.toString(),
          );
        } else {
          reactions = reactions.filter(
            (r) => r.userId.toString() !== userId.toString(),
          );
          reactions.push({ userId, reaction });
        }
      } else {
        reactions.push({ userId, reaction });
      }

      return { ...prev, reactions };
    });

    try {
      const res = await api.patch(`/reactions/posts/${postId}`, { reaction });
      console.log("API response:", res.data);
    } catch (err) {
      setPost(prevState);
      console.log("API error:", err.response?.status, err.response?.data);
    }
  }

  return (
    <div className="post-wrapper">
      <Blogcard post={post} />

      {/* Action bar */}
      <div className="blog-card-bottom px-7 py-3 bg-white border-x border-stone-200 rounded-b-2xl">
        <div className="blog-actions">
          <button
            className={`action-btn like ${isLiked ? "active" : ""}`}
            onClick={() => {
              ReactionHandler("LIKE");
            }}
          >
            <ThumbsUp size={17} fill={isLiked ? "currentColor" : "none"} />
            <span>
              {post?.reactions?.filter((r) => r.reaction === "LIKE").length ||
                0}
            </span>
          </button>
          <button
            className={`action-btn dislike ${isUnliked ? "active" : ""}`}
            onClick={() => {
              ReactionHandler("DISLIKE");
            }}
          >
            <ThumbsDown size={17} fill={isUnliked ? "currentColor" : "none"} />
            <span>
              {post?.reactions?.filter((r) => r.reaction === "DISLIKE")
                .length || 0}
            </span>
          </button>
          <button
            className="action-btn comment"
            onClick={() => setCommentVisibility((prev) => !prev)}
          >
            <MessageSquareText size={17} />
          </button>
          <button className="action-btn share" onClick={sharePostHandler}>
            <Forward size={17} />
          </button>
        </div>
        <button
          className={`action-btn bookmark ${isBookmarked ? "active" : ""}`}
          onClick={bookmarkHandler}
        >
          <Bookmark size={17} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Comments */}
      {commentVisibility && (
        <CommentSection
          postId={post._id}
          setCommentsLoaded={setCommentsLoaded}
        />
      )}
    </div>
  );
}
