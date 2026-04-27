import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { Hash } from "lucide-react";
import { extractTextFromHtml } from "../utils/stringUtils";

const highlightedTexts = (post) =>
  post.highlights.map((highlight) => {
    let finalHtmlText = "";
    for (const text of highlight.texts) {
      if (text.type === "hit")
        finalHtmlText += `<mark class="bg-yellow-100 text-yellow-800 rounded px-0.5 font-semibold not-italic">${text.value}</mark>`;
      else finalHtmlText += extractTextFromHtml(text.value);
    }
    return finalHtmlText;
  });

export default function PostResults({ postResult }) {
  return (
    <div className="flex flex-col gap-3">
      {postResult.map((post, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow p-5"
        >
          {/* Author */}
          <Link
            to={`/profile/${post.author._id}`}
            className="flex items-center gap-2 mb-3"
          >
            <img
              src={post.author.profilePic}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-green-300"
            />
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-sm font-semibold text-stone-700 hover:underline hover:text-[#3a7d44]"
            >
              {post.author.username}
            </span>
          </Link>

          {/* Excerpt */}
          <Link to={`/posts/${post._id}`} className="block">
            <p
              style={{ fontFamily: "'Roboto', sans-serif" }}
              className="text-sm text-stone-700 font-medium leading-relaxed mb-3"
            >
              {extractTextFromHtml(post.content)
                .split(" ")
                .slice(0, 25)
                .join(" ")}
              ...
            </p>

            {/* Divider */}
            <div className="border-t border-stone-100 mb-3" />

            {/* Match count badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-1 bg-[#e8f5e1] text-[#3a7d44] rounded-full px-2.5 py-0.5">
                <Hash size={10} />
                <span className="text-[11px] font-bold">
                  {highlightedTexts(post).length} match
                  {highlightedTexts(post).length !== 1 ? "es" : ""}
                </span>
              </div>
            </div>

            {/* Highlighted matches */}
            <ul className="flex flex-col gap-1.5">
              {highlightedTexts(post).map((highlightedText, i) => (
                <li
                  key={i}
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                  className="text-xs text-stone-500 leading-relaxed pl-3 border-l-2 border-[#96d86a]"
                >
                  ...{parse(highlightedText)}...
                </li>
              ))}
            </ul>
          </Link>
        </div>
      ))}
    </div>
  );
}
