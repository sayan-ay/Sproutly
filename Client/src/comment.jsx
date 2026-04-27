import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, CornerDownRight, Send } from "lucide-react";
import { api } from "./axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "./auth/authStore";
import toast from "react-hot-toast";

export default function SingleComment({ commentArg }) {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;
  const navigate = useNavigate();

  const [comment, setComment] = useState(commentArg);

  const myReaction = comment?.reactions?.find(
    (r) => r.userId?.toString() === userId?.toString(),
  );
  const isLiked = myReaction?.reaction === "LIKE";
  const isUnliked = myReaction?.reaction === "DISLIKE";

  async function ReactionHandler(reaction) {
    if (!userId) return navigate("/signin");
    let prevState = structuredClone(comment);
    setComment((prev) => {
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
      await api.patch(`/reactions/comments/${comment?._id}`, {
        reaction,
      });
    } catch (err) {
      setComment(prevState);
      console.log("API error:", err.response?.status, err.response?.data);
    }
  }

  return (
    <div className="comment-card" id={comment._id}>
      <div className="comment-header">
        {comment.commentedBy?.profilePic ? (
          <img
            src={comment.commentedBy.profilePic}
            alt={comment.commentedBy.username}
            className="w-6 h-6 min-w-6 min-h-6 max-w-6 max-h-6 rounded-full object-cover block shrink-0 "
          />
        ) : (
          <div className="comment-avatar-fallback">
            {comment.commentedBy?.username?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <span className="comment-username">
          {comment.commentedBy?.username}
        </span>
      </div>

      {/* Comment body */}
      <p className="comment-body">{comment.content}</p>

      {/* Actions */}
      <div className="comment-actions">
        <button
          className={`comment-action-btn ${isLiked ? "active-like" : ""}`}
          onClick={() => ReactionHandler("LIKE")}
          aria-label="Like comment"
        >
          <ThumbsUp size={14} fill={isLiked ? "currentColor" : "none"} />
          <span className="text-xs">
            {comment?.reactions?.filter((r) => r.reaction === "LIKE").length ||
              0}
          </span>
        </button>

        <button
          className={`comment-action-btn ${isUnliked ? "active-dislike" : ""}`}
          onClick={() => ReactionHandler("DISLIKE")}
          aria-label="Dislike comment"
        >
          <ThumbsDown size={14} fill={isUnliked ? "currentColor" : "none"} />
          <span className="text-xs">
            {comment?.reactions?.filter((r) => r.reaction === "DISLIKE")
              .length || 0}
          </span>
        </button>

        <button className="comment-reply-btn" aria-label="Reply">
          <CornerDownRight size={13} />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
}

export const CommentSection = ({ postId, setCommentsLoaded }) => {
  const [comments, setComments] = useState([]);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [addedComment, setAddedComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCommentsLoaded(false);
    api
      .get(`/comments/${postId}`)
      .then((res) => {
        setComments(res.data.comments);

        setCommentsLoaded(true);
      })
      .catch((err) => console.log(err));
  }, [postId]);

  async function commentAdd() {
    if (!addedComment.trim()) return;

    try {
      await toast.promise(
        api.post(`/comments/add/${postId}`, { content: addedComment }),
        {
          loading: "Adding...",
          success: (
            <div className="bg-green-50 text-green-500">Comment added!</div>
          ),
          error: (
            <div className="bg-red-50 text-red-600">Could not add comment</div>
          ),
        },
        {
          duration: 2000,
          position: "bottom-center",
        },
      );

      setAddedComment("");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">
        {comments?.length
          ? `${comments.length} Comment${comments.length > 1 ? "s" : ""}`
          : "No comments yet"}
      </h3>
      <div
        className="comment-input-row"
        onClick={() =>
          !isAuthenticated && navigate("/signin", { replace: true })
        }
      >
        <input
          type="text"
          className="comment-input"
          placeholder="Share your thoughts…"
          value={addedComment}
          onChange={(e) => setAddedComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commentAdd()}
        />
        <button className="comment-submit-btn" onClick={commentAdd} aria-label="Post comment">
          <Send size={18} />
        </button>
      </div>
      <div className="comment-list">
        {comments?.map((comment) => (
          <SingleComment commentArg={comment} key={comment._id} />
        ))}
      </div>
    </div>
  );
};
