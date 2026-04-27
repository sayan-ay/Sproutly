import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { api } from "./axios";
import { useAuthStore } from "./auth/authStore";
import SingleComment from "./comment";
import Loader from "./Loader";
import Post from "./Post";
import ModalImage from "react-modal-image";
import toast from "react-hot-toast";

export default function Profile() {
  const currentUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const dialogRef = useRef(null);

  const { user_id } = useParams();

  const [isFollowing, setIsFollowing] = useState(false);
  const isOwner = currentUser?._id.toString() === user_id;

  const [err, setErr] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Posts");
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const postsAndCommentsButtonsClass =
    "border-b-2 border-[#76c893] font-bold text-[#52b69a]";

  async function fetchUser() {
    setLoading(true);
    try {
      const res = await api.get(`/users/${user_id}`);

      setUser(res.data.user);

      // ✅ Now you have the actual data to check against
      setIsFollowing(
        currentUser &&
          res.data.user.followers.some(
            (followerId) =>
              followerId.toString() === currentUser._id.toString(),
          ),
      );
    } catch (err) {
      setErr(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await api.get(`/users/${user_id}/posts`);

      setPosts(res.data.posts);
      console.log(res.data.posts);
    } catch (err) {
      setErr(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  async function fetchComments() {
    setLoading(true);
    try {
      const res = await api.get(`/comments/user/${user_id}`);
      console.log(res.data.comments);
      setComments(res.data.comments);
    } catch (err) {
      setErr(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUser();
    fetchComments();
    fetchPosts();
  }, [user_id]);

  async function followButtonHandler() {
    if (!currentUser) return navigate("/signin", { replace: true });

    if (!isFollowing) {
      setIsFollowing(true);
      try {
        await api.get(`/users/${user?._id}/follow`);
      } catch (err) {
        setIsFollowing(false);
        alert(err);
      }
    } else if (isFollowing) dialogRef.current.showModal();
  }
  async function handleUnfollowButton() {
    setIsFollowing(false);
    dialogRef.current.close();
    try {
      await api.get(`/users/${user?._id}/follow`);
    } catch (err) {
      setIsFollowing(true);
      alert(err);
    }
  }

  if (err?.response?.status === 404)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        404 not found user
      </div>
    );
  if (err)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Something went wrong. Please try again.
      </div>
    );

  return (
    <>
      <dialog ref={dialogRef}>
        <p>Unfollow this user?</p>
        <div className="dialog-actions">
          <button
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-stone-600 border border-stone-200 hover:bg-stone-100 transition-colors"
            onClick={() => dialogRef.current.close()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
            onClick={handleUnfollowButton}
          >
            Unfollow
          </button>
        </div>
      </dialog>

      {loading && <Loader />}
      {!loading && (
        <main className="w-full mx-auto mt-6 px-4">
          {/* Profile Header Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-200">
            {/* Banner */}
            <div className="h-44 w-full bg-[#d9ed92] relative overflow-hidden">
              {/* Simple Leaf Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c10 0 20 10 20 25s-10 25-20 25S10 45 10 30 20 5 30 5z' fill='%3C/svg%3E")`,
                  backgroundSize: "80px 80px",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
            </div>

            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-16">
                {/* Profile Picture */}
                <div className="p-1 bg-white rounded-full shadow-md">
                  <div className="w-32 h-32 rounded-full bg-stone-100 border-2 border-solid border-[#8ed45f] flex items-center justify-center text-stone-300 text-xs text-center font-mono overflow-hidden">
                    <ModalImage
                      large={user?.profilePic}
                      small={user?.profilePic}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="flex space-x-3 mb-2">
                  {/* Follow Button (Visible to others) */}
                  {!isOwner && (
                    <button
                      className={`px-6 py-2 rounded-lg ${isFollowing ? "bg-[#10baa9] " : "bg-[#76c893] hover:bg-[#52b69a]"} text-white font-bold  transition-colors shadow-sm`}
                      onClick={followButtonHandler}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}

                  {/* Edit Profile Button (Visible to owner) */}
                  {isOwner && (
                    <button
                      className="px-6 py-2 rounded-lg border-2 border-stone-200 text-stone-600 font-semibold hover:bg-stone-50 transition-colors shadow-sm"
                      onClick={() =>
                        toast.custom(
                          (t) => (
                            <div
                              className={`pr-2 pl-5 mr-2 mt-18 border-r-4 border-orange-500 bg-white font-semibold py-4 rounded-l-3xl  shadow-lg transition-opacity duration-300 ${t.visible ? "opacity-100" : "opacity-0"}`}
                            >
                              <span className="text-orange-500">
                                Coming Soon
                              </span>{" "}
                              <span>🫸</span>
                            </div>
                          ),
                          {
                            position: "top-right",
                            duration: 1200,
                          },
                        )
                      }
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Identity Section */}
              <div className="mt-6">
                <h2 className="text-3xl font-bold text-stone-800">
                  {user?.fullName}
                </h2>
                <p className="text-[#52b69a] font-medium tracking-tight">
                  @{user?.username}
                </p>
                <p className="mt-4 text-stone-600 leading-relaxed max-w-2xl italic">
                  {user?.bio}
                </p>
              </div>

              {/* Statistics Row */}
              <div className="flex space-x-12 w-full  mt-8 py-5 border-t border-stone-100 caret-transparent cursor-default">
                <div className="text-center flex-1">
                  <span className="block font-bold text-xl text-stone-800">
                    {posts?.length || 0}
                  </span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Posts
                  </span>
                </div>
                <div className="text-center flex-1">
                  <span className="block font-bold text-xl text-stone-800">
                    {user?.followers?.length || 0}
                  </span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Followers
                  </span>
                </div>
                <div className="text-center flex-1">
                  <span className="block font-bold text-xl text-stone-800">
                    {user?.followingCount}
                  </span>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Following
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex  space-x-10 mt-8 border-b border-stone-200 px-6 w-full">
            <button
              className={`pb-4 flex-1  ${tab === "Posts" ? postsAndCommentsButtonsClass : " text-stone-400 font-medium hover:text-stone-600 "}`}
              onClick={() => setTab("Posts")}
            >
              Posts
            </button>
            <button
              className={`pb-4 flex-1 ${tab === "Comments" ? postsAndCommentsButtonsClass : " text-stone-400 font-medium hover:text-stone-600"} `}
              onClick={() => setTab("Comments")}
            >
              Comments
            </button>
          </div>

          {/* Content Feed Container */}
          <div className="mt-8 space-y-6 pb-20 flex-col flex gap-1 items-center">
            {tab === "Posts" &&
              posts?.map((post) => <Post key={post._id} postArg={post} />)}
            {tab === "Comments" && comments?.length > 0 &&
              comments.map((comment) => (
                <Link
                  to={`/posts/${comment.onWhichPost}#comment-${comment._id}`}
                  key={comment._id}
                  className="w-full block bg-white rounded-xl shadow-sm border border-stone-200 p-2 sm:p-4 hover:shadow-md hover:border-stone-300 transition-all duration-200"
                >
                  <SingleComment commentArg={comment} />
                </Link>
              ))}
            {tab === "Comments" && comments?.length === 0 && (
              <div className="w-full bg-white rounded-xl shadow-sm border border-stone-200 p-8 text-center text-stone-500">
                No comments yet.
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
}
