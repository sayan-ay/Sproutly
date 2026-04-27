import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../axios";
import { useAuthStore } from "./authStore";

export default function Onboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const fromSignup = location.state?.fromSignup;
  const setUser = useAuthStore((state) => state.setUser);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [pfp, setPfp] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!userId || !fromSignup) {
      navigate("/signup", { replace: true });
    }
  }, [userId, fromSignup]);

  if (!userId || !fromSignup) return null;

  function handleUsernameChange(val) {
    // Strip spaces, force lowercase, ensure starts with @
    let cleaned = val.replace(/\s/g, "").toLowerCase();
    if (!cleaned.startsWith("@")) cleaned = "@" + cleaned.replace(/^@+/, "");
    setUsername(cleaned);
    if (cleaned.length < 4) {
      setUsernameError("Username too short");
    } else if (!/^@[a-z0-9_.]+$/.test(cleaned)) {
      setUsernameError("Only letters, numbers, _ and . allowed");
    } else {
      setUsernameError("");
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPfp(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submitHandler(e) {
    e.preventDefault();
    if (usernameError) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("fullName", fullName);
      formData.append("username", username.replace("@", ""));
      formData.append("bio", bio);
      if (pfp) formData.append("profilePic", pfp);

      const response = await api.post("/users/onboarding", formData);
      setUser(response.data.user);
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-[#b7e4c7] rounded-xl px-4 py-3 bg-[#f8fffe] focus:outline-none focus:ring-2 focus:ring-[#52B788] focus:border-transparent transition-all text-stone-700 placeholder:text-stone-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d8f3dc] via-[#b7e4c7] to-[#74c69d] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-4xl">🌿</span>
            <span className="text-4xl font-bold text-[#1b4332] tracking-tight">
              Sproutly
            </span>
          </div>
          <p className="text-[#2d6a4f] text-sm font-medium">
            Let's set up your profile
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-xl shadow-[#52b788]/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-[#1b4332] mb-1">
            Almost there! 🎉
          </h2>
          <p className="text-stone-400 text-sm mb-6">
            Tell the community a bit about yourself
          </p>

          <form onSubmit={submitHandler} className="flex flex-col gap-5">
            {/* Profile picture */}
            <div className="flex flex-col items-center gap-3">
              <div
                onClick={() => inputRef.current.click()}
                className="relative w-28 h-28 rounded-2xl bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] border-2 border-dashed border-[#74c69d] flex items-center justify-center cursor-pointer overflow-hidden group hover:border-[#52B788] transition-colors"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#74c69d] group-hover:text-[#52B788] transition-colors">
                    <span className="text-3xl">📷</span>
                    <span className="text-xs font-semibold">Add photo</span>
                  </div>
                )}
                {/* Overlay on hover when image exists */}
                {preview && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                    <span className="text-white text-xs font-bold">Change</span>
                  </div>
                )}
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-xs text-stone-400">
                {preview
                  ? "Click to change"
                  : "Optional — you can add one later"}
              </p>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#2d6a4f]">
                Full name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#2d6a4f]">
                Username
              </label>
              <input
                type="text"
                placeholder="@yourhandle"
                required
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                className={
                  inputClass +
                  (usernameError
                    ? " border-red-300 focus:ring-red-300"
                    : username && !usernameError
                      ? " border-[#52B788]"
                      : "")
                }
              />
              {usernameError && (
                <p className="text-red-400 text-xs font-medium">
                  {usernameError}
                </p>
              )}
              {username && !usernameError && (
                <p className="text-[#52B788] text-xs font-medium">
                  ✓ Looks good!
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#2d6a4f]">
                Bio{" "}
                <span className="text-stone-300 font-normal">(optional)</span>
              </label>
              <textarea
                placeholder="Tell us about yourself, your plants, your vibe..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className={inputClass + " resize-none"}
              />
              <p className="text-xs text-stone-300 text-right">
                {bio.length}/160
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !!usernameError}
              className="mt-1 w-full bg-[#52B788] hover:bg-[#3d9e70] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-[#52b788]/30 hover:shadow-lg hover:shadow-[#52b788]/40 hover:-translate-y-0.5 active:translate-y-0"
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
                  Setting up profile...
                </span>
              ) : (
                "Finish & enter Sproutly 🌱"
              )}
            </button>
          </form>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-8 h-1.5 rounded-full bg-white/40" />
          <div className="w-8 h-1.5 rounded-full bg-[#1b4332]" />
        </div>
        <p className="text-center text-xs text-[#2d6a4f]/60 mt-2">
          Step 2 of 2
        </p>
      </div>
    </div>
  );
}
