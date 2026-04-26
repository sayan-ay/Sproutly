import { Bell, Mail, Search } from "lucide-react";
// import { api } from "./axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogout } from "./auth/logout";
import { useAuthStore } from "./auth/authStore";
import toast from "react-hot-toast";

function Navbar() {
  const logout = useLogout();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  return (
    <nav className="flex flex-row gap-3 py-4 bg-linear-to-r from-[#52B788] to-[#95D5B2] pr-5 pl-8 items-center shadow-xl sticky top-0 select-none cursor-default z-80 mb-5">
      <div className="text-4xl font-semibold text-[#ccd979] ">
        <NavLink className="cursor-pointer caret-transparent" to="/">
          <span
            style={{
              fontFamily: "Varela Round",
            }}
          >
            Sproutly
          </span>
        </NavLink>
      </div>

      {!user && (
        <div className="ml-auto hover:text-[#210376]">
          {" "}
          <NavLink className="cursor-pointer" to="/signin">
            SignIn
          </NavLink>
        </div>
      )}
      {user && (
        <div className="ml-auto flex items-center gap-7">
          <NavLink to="/search">
            <Search className="hover:text-[#059f8d]" />
          </NavLink>
          <Mail
            className="hover:text-[#059f8d]"
            onClick={() =>
              toast.custom(
                (t) => (
                  <div
                    className={`pr-2 pl-5 mr-2 mt-18 border-r-4 border-orange-500 bg-white font-semibold py-4 rounded-l-3xl  shadow-lg transition-opacity duration-300 ${t.visible ? "opacity-100" : "opacity-0"}`}
                  >
                    <span className="text-orange-500">Coming Soon</span>{" "}
                    <span>🫸</span>
                  </div>
                ),
                {
                  position: "top-right",
                  duration: 1200,
                },
              )
            }
          />
          <NavLink to="/notifications">
            <Bell className="hover:text-[#1f9c8d]" />
          </NavLink>

          <div className="relative text-center">
            <details>
              <summary className="list-none cursor-pointer">
                <img
                  src={user.profilePic}
                  alt="img"
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white hover:ring-[#0cbcdb] transition-all"
                />
              </summary>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                <div className="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 hover:font-bold  transition-colors">
                  <NavLink to={`/profile/${user._id}`}>Profile</NavLink>
                </div>
                <div className="w-full h-px bg-gray-100" />
                <div className="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50  hover:text-purple-700 hover:font-bold  transition-colors">
                  <NavLink to={"/bookmarks"}> Bookmarks</NavLink>
                </div>
                <div className="w-full h-px bg-gray-100" />
                <div
                  className="cursor-pointer px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 hover:font-bold transition-colors"
                  onClick={() => {
                    logout();
                    navigate("/signin");
                  }}
                >
                  Logout
                </div>
              </div>
            </details>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
