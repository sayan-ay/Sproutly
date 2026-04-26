import { useEffect, useState } from "react";
import Addcard from "./Addcard";
import Post from "./Post";
import { api } from "./axios";
import Loader from "./Loader";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts")

      .then((res) => {
        setPosts(res.data.posts);
        setLoading(false);
      })
      .catch((err) => alert(err));
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Addcard />
      <div className="feed">
        {posts.map((post) => (
          <Post postArg={post} setPosts={setPosts} key={post._id} />
        ))}
      </div>
    </>
  );
}
