import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../axios";
import UserResults from "./userResults";
import PostResults from "./postResults";
import { extractTextFromHtml } from "../utils/stringUtils";
import { Search, UserRound } from "lucide-react";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [userResult, setUserResult] = useState([]);
  const [postResult, setPostResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchParams({});
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") return;
    const abortController = new AbortController();
    const timer = setTimeout(() => fetchResults(abortController.signal), 500);
    // if (searchQuery.length === 1 && searchParams) setSearchParams({});

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [searchQuery]);

  async function fetchResults(signal) {
    setLoading(true);
    try {
      const res = await api.get(
        `/search?input=${encodeURIComponent(searchQuery)}`,
        { signal },
      );
      setUserResult(res.data.users);
      setPostResult(res.data.posts);
    } catch (error) {
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED")
        return;
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const submitHandler = () => {
    if (!searchQuery?.trim()) {
      setSearchParams({});
      return;
    }
    setSearchQuery("");
    setSearchParams({ input: searchQuery });
  };

  return (
    <main className=" px-4 pt-10 w-full flex flex-col items-center gap-8">
      <div className="w-full flex justify-center ">
        <div className="relative w-full max-w-130">
          {/* Input */}
          <div className="relative flex items-center">
            <Search
              size={15}
              className="absolute left-3.5 text-stone-400 pointer-events-none"
            />
            <input
              autoFocus
              value={searchQuery || ""}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                submitHandler();
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3.5 w-full text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-[#3a7d44] focus:ring-2 focus:ring-[#3a7d44]/10 transition-all placeholder:text-stone-400"
              type="text"
              placeholder="Search users or posts..."
            />
          </div>

          {/* Dropdown */}
          {searchQuery.trim() && (
            <div className="  shadow-4xl absolute top-full left-0 mt-1.5 w-full bg-[rgb(255,255,255)]   z-50 flex flex-col overflow-hidden px-5 ">
              <div
                className="px-4 py-3 text-sm text-stone-500 hover:bg-stone-50 cursor-pointer border-b border-[#000000] flex items-center gap-1"
                onClick={submitHandler}
              >
                <Search size={12} className="text-[#3a7d44]" />

                <span className="font-medium text-stone-800">
                  {" "}
                  Search for {"'"}
                  {searchQuery}
                  {"'"}
                </span>
              </div>
              {userResult &&
                userResult.slice(0, 5).map((user) => (
                  <div
                    key={user._id}
                    className=" relative px-4 py-3 text-sm text-stone-500 hover:bg-stone-50 cursor-pointer border-b border-[#000000] flex items-center gap-2"
                  >
                    <Link to={`/profile/${user._id}`}>
                      <span className="text-sm font-semibold text-stone-800 hover:underline  hover:text-green-500 ml-5 ">
                        @{user.username}
                      </span>
                    </Link>
                    <UserRound className="absolute left-2 " />
                  </div>
                ))}
              {postResult &&
                postResult.slice(0, 5).map((post) => (
                  <div
                    key={post._id}
                    className="px-4 py-8 text-sm text-stone-500 hover:bg-stone-50 cursor-pointer border-b border-[#000000] flex flex-col justify-center gap-4"
                  >
                    <Link
                      to={`/profile/${post.author._id}`}
                      className="flex gap-2 items-center"
                    >
                      <img
                        src={post.author.profilePic}
                        className="w-7 h-7 object-cover rounded-full ring-1 ring-green-400 inline"
                      />
                      <span className="text-xs font-medium text-stone-700 tracking-wide font-mono hover:underline hover:text-cyan-600">
                        @{post.author.username}
                      </span>
                    </Link>

                    <Link
                      to={`/posts/${post._id}`}
                      key={post._id}
                      className="text-stone-600 text-sm leading-relaxed font-Merriweather hover:text-stone-900 transition-colors"
                    >
                      {extractTextFromHtml(post.content)
                        .split(" ")
                        .slice(0, 30)
                        .join(" ")}
                      ...
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="w-full max-w-full">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-t-2 border-l-2 border-[#3a7d44] animate-spin" />
          </div>
        )}

        {!loading && searchParams.get("input") && (
          <>
            {userResult.length === 0 &&
            postResult.length === 0 &&
            searchParams.length !== 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-400 text-sm">
                  No results for{" "}
                  <span className="font-semibold text-stone-600">
                    "{searchParams.get("input")}"
                  </span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {userResult.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2.5">
                      <h2 className="text-[10px] font-medium uppercase tracking-widest text-stone-400">
                        Users
                      </h2>
                      <span className="text-[11px] text-stone-300">
                        ({userResult.length})
                      </span>
                    </div>
                    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                      <UserResults userResult={userResult} />
                    </div>
                  </section>
                )}
                {postResult.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-2.5">
                      <h2 className="text-[10px] font-medium uppercase tracking-widest text-stone-400">
                        Posts
                      </h2>
                      <span className="text-[11px] text-stone-300">
                        ({postResult.length})
                      </span>
                    </div>
                    <div className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                      <PostResults postResult={postResult} />
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}

        {!loading && !searchParams.get("input") && (
          <div className="text-center py-20">
            <p className="text-slate-800 text-xl">
              Type something and press Enter
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
