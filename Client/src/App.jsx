import { lazy, Suspense } from "react";

import ProtectedRoutes from "./auth/ProtectedRoutes";

import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import GlobalNotificationListener from "./globalNotificationListener";
import AppLayout from "./Layouts/AppLayout.jsx";
import Loader from "./Loader.jsx";
import Home from "./Home.jsx";
import FallBackErrorBoundary from "./fallbackErrorboundary.jsx";
import NotFound from "./NotFound.jsx";

const Signin = lazy(() => import("./auth/SignIn"));
const Signup = lazy(() => import("./auth/SignUp"));
const Onboarding = lazy(() => import("./auth/Onboarding"));
const AddPost = lazy(() => import("./AddPost"));
const Profile = lazy(() => import("./Profile"));

const Search = lazy(() => import("./searchComponents/Search"));
const Postpage = lazy(() => import("./Postpage"));
const Notifications = lazy(() => import("./Notifications"));
const Bookmarks = lazy(() => import("./Bookmarks.jsx"));

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <GlobalNotificationListener />
      <ErrorBoundary FallbackComponent={FallBackErrorBoundary}>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />

                <Route path="/posts/:postid" element={<Postpage />} />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoutes>
                      <Notifications />
                    </ProtectedRoutes>
                  }
                />
                <Route path="/search" element={<Search />} />
                <Route path="/profile/:user_id" element={<Profile />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="/add-post"
                element={
                  <ProtectedRoutes>
                    <AddPost />
                  </ProtectedRoutes>
                }
              />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}

export default App;
