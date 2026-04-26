import { useParams } from "react-router-dom";
import { api } from "./axios";
import { useState, useEffect } from "react";
import Post from "./Post";

export default function Postpage() {
  const [post, setPost] = useState(null);
  const [err, setErr] = useState(null);
  const { postid } = useParams();

  useEffect(() => {
    api
      .get(`/posts/${postid}`)
      .then((res) => setPost(res.data.post))
      .catch((err) => setErr(err));
  }, []);

  if (!post && !err) return <div className="page-body">Loading...</div>;
  return (
    <div className="page-body">
      <Post postArg={post} />
    </div>
  );
}
