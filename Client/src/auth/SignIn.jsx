import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import googleimg from "../assets/google.svg";
import { api } from "../axios";
import { useAuthStore } from "./authStore";
import { toast } from "react-hot-toast";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) return navigate("/");
  }, [user]);

  async function submitHandler(e) {
    e.preventDefault();
    try {
      const res = await toast.promise(
        api.post("/users/signin", {
          email,
          password,
        }),
        {
          loading: "Signing...",
          success: (
            <div className="bg-green-50 text-green-500">
              Signed in!Navigating to home
            </div>
          ),
          error: (err) => (
            <div className="bg-red-50 text-red-600">
              {err.response?.data?.message || "Could not login"}
            </div>
          ),
        },
        {
          duration: 2000,
          position: "bottom-right",
          className: "pr-5 pl-3 mr-2 mb-5",
        },
      );

      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#d8f3dc] to-[#95d5b2] flex flex-col items-center justify-center px-4 ">
      <header className="text-center text-5xl font-bold mb-8 text-[#1a6f2b]   ">
        Sign In
      </header>

      <div className="mx-auto w-full max-w-120 border border-[#b7e4c7] shadow-md p-10 rounded-xl bg-white ">
        <form className="flex flex-col gap-3 caret-transparent cursor-default">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-lg font-medium text-[#2d6a4f]"
            >
              Email Address
            </label>
            <input
              autoComplete="off"
              type="text"
              placeholder="Email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-[#b7e4c7] rounded-lg px-3 py-2 bg-[#f8fffe] focus:outline-none focus:border-[#52B788]"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="Password"
              className="text-lg font-medium text-[#2d6a4f]"
            >
              Password
            </label>
            <input
              autoComplete="off"
              type={show ? "text" : "password"}
              placeholder="Password"
              name="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="border border-[#b7e4c7] rounded-lg px-3 py-2 bg-[#f8fffe] focus:outline-none focus:border-[#52B788] "
            />
            <span
              className="absolute right-2.5 bottom-2.5 text-stone-500"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "Hide" : "Show"}
            </span>
          </div>

          <button
            onClick={submitHandler}
            className="bg-[#52B788] hover:bg-[#3d9e70]  text-white font-bold py-2 px-4 rounded-lg cursor-pointer mt-2"
            type="submit"
          >
            Sign In
          </button>

          <div className="flex items-center gap-3 cursor-default">
            <div className="flex-1 h-px bg-[#b7e4c7]" />
            <span className="text-xs text-[#74c69d]">or</span>
            <div className="flex-1 h-px bg-[#b7e4c7]" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-[#b7e4c7] py-2 px-4 rounded-lg cursor-pointer hover:bg-[#f0faf4]"
          >
            <img src={googleimg} className="h-5 w-5" />
            <span className="font-medium text-[#2d6a4f]">
              Sign In with Google
            </span>
          </button>
        </form>

        <div className="mt-4 text-center text-base text-gray-600 cursor-default caret-transparent">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#52B788] font-semibold hover:underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
