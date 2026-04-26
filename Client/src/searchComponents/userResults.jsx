import { Link } from "react-router-dom";

export default function UserResults({ userResult }) {
  return (
    <div>
      {userResult.map((user, index) => (
        <div
          key={index}
          className="flex items-center  gap-3 px-4 py-2.5 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-none transition-colors"
        >
          <img
            src={user.profilePic}
            className="h-7 w-7 rounded-full object-cover shrink-0"
          />
          <Link to={`/profile/${user._id}`}>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-stone-800">
                {user.username}
              </span>
              <span className="text-xs text-stone-400">{user.fullName}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
