import parse from "html-react-parser";
import { Link } from "react-router-dom";

export default function Blogcard({ post }) {
  return (
    <article className="blog-card">
      {/* Author header */}
      <Link to={`/profile/${post?.author?._id}`}>
        <div className="blog-head">
          <div className="author-avatar">
            <img
              src={post?.author?.profilePic}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="author-info">
            <span className="author-name">{post?.author?.username}</span>
            <span className="post-date">
              {post?.createdAt
                ? new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
        </div>
      </Link>
      {/* Content */}{" "}
      <Link to={`/posts/${post._id}`}>
        <div className="blog-content">
          {post?.content ? parse(post.content) : null}
        </div>
      </Link>
    </article>
  );
}
