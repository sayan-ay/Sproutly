import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../axios";
import { useAuthStore } from "./authStore";
import { toast } from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) return navigate("/");
  }, [user]);

  async function submitHandler(e) {
    e.preventDefault();
    if (confirmPassword !== password) return alert("Passwords do not match");
    setLoading(true);
    try {
      const res = await toast.promise(
        api.post("/users/add", { email, password }),
        {
          loading: "Signing...",
          success: (
            <div className="bg-green-50 text-green-500">
              Signed up!Navigating to onboarding
            </div>
          ),
          error: (err) => (
            <div className="bg-red-50 text-red-600">
              {err.response?.data?.message || "Could not create user"}
            </div>
          ),
        },
        {
          duration: 2000,
          position: "bottom-right",
          className: "pr-5 pl-3 mr-2 mb-5",
        },
      );

      // Pass the new userId to onboarding so we can update their profile
      navigate("/onboarding", {
        replace: true,
        state: { userId: res.data.userId, fromSignup: true },
      });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-[#b7e4c7] rounded-xl px-4 py-3 bg-[#f8fffe] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition-all text-stone-700 placeholder:text-stone-300";

  return (
    <div className="min-h-screen bg-linear-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#74c69d] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-4xl">🌿</span>
            <span className="text-4xl font-bold text-[#1b4332] tracking-tight">
              Sproutly
            </span>
          </div>
          <p className="text-[#2d6a4f] text-sm font-medium">
            Create your account — takes 30 seconds
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-xl shadow-[#52b788]/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1b4332] mb-1">
            Get started
          </h2>
          <p className="text-stone-400 text-sm mb-6">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-[#52B788] font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#2d6a4f]">
                Email address
              </label>
              <input
                autoComplete="off"
                type="email"
                placeholder="you@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#2d6a4f]">
                Password
              </label>
              <div className="relative">
                <input
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className={inputClass + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#52B788] transition-colors text-xs font-bold select-none"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#2d6a4f]">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  required
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className={
                    inputClass +
                    " pr-12 " +
                    (confirmPassword && confirmPassword !== password
                      ? "border-red-300 focus:ring-red-300"
                      : confirmPassword && confirmPassword === password
                        ? "border-[#52B788]"
                        : "")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#52B788] transition-colors text-xs font-bold select-none"
                >
                  {showConfirm ? "HIDE" : "SHOW"}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-xs font-medium">
                  Passwords don't match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-[#52B788] hover:bg-[#3d9e70] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-[#52b788]/30 hover:shadow-lg hover:shadow-[#52b788]/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account →"
              )}
            </button>
          </form>

          <p className="text-xs text-stone-300 text-center mt-6">
            By signing up you agree to our{" "}
            <span className="text-[#74c69d] cursor-pointer hover:underline">
              Terms
            </span>{" "}
            &{" "}
            <span className="text-[#74c69d] cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-8 h-1.5 rounded-full bg-[#1b4332]" />
          <div className="w-8 h-1.5 rounded-full bg-white/40" />
        </div>
        <p className="text-center text-xs text-[#2d6a4f]/60 mt-2">
          Step 1 of 2
        </p>
      </div>
    </div>
  );
}
