import Post from "./Post.jsx";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { api } from "./axios.js";

export default function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/bookmarks")

      .then((res) => {
        setLoading(false);
        setPosts(res.data.bookmarkedPosts);
      })
      .catch((err) => alert(err));
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!posts.length)
    return (
      <div className="feed mt-5">
        <p className="text-center text-2xl mt-55 caret-transparent cursor-default ">
          No Bookmarked Posts Yet
        </p>
      </div>
    );

  return (
    <div className="feed mt-5">
      {posts.map((post) => (
        <Post postArg={post} setPosts={setPosts} key={post._id} />
      ))}
    </div>
  );
}
