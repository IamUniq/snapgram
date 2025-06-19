import { Route, Routes } from "react-router-dom";
import "./globals.css";

import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import {
  AllUsers,
  CreatePost,
  CreateStory,
  EditPost,
  Explore,
  Home,
  LikedPosts,
  Notifications,
  PostDetails,
  Profile,
  Reels,
  Saved,
  Settings,
  ViewHighlights,
  ViewStories
} from "./_root/pages";
import EditProfile from "./_root/pages/EditProfile";
import RootLayout from "./_root/RootLayout";
import FollowContent from "./components/shared/FollowContent";
import { Toaster } from "./components/ui/sonner";
import { useUserContext } from "./context/AuthContext";
import { StoryProvider } from "./context/StoryContext";
import UserPosts from "./_root/pages/UserPosts";

const App = () => {
  const { user } = useUserContext()

  return (
    <main className="flex">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />

          <Route path="/profile/:id" element={<Profile />}>
            <Route index element={<UserPosts />} />
            <Route path="followers" element={
              <>
                <h2 className="px-2 h3-bold md:h2-bold text-left w-full">Followers</h2>
                <FollowContent type="follower" loggedInUser={user.id} />
              </>
            }
            />
            <Route path="following" element={
              <>
                <h2 className="px-2 h3-bold md:h2-bold text-left w-full">Following</h2>
                <FollowContent type="following" loggedInUser={user.id} />
              </>
            } />
            <Route path="liked-posts" element={<LikedPosts />} />
          </Route>

          <Route path="/profile/:id/edit" element={<EditProfile />} />
          <Route path="/profile/:id/settings" element={<Settings />} />
          <Route path="/profile/:id/story" element={<ViewStories />} />
          <Route path="/profile/:id/highlights/:title" element={<ViewHighlights />} />


          {/* Story */}
          <Route path="/create-story" element={
            <StoryProvider>
              <CreateStory />
            </StoryProvider>
          } />
          {/* Chat */}
          <Route path="/profile/:id/chat" element={<EditProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
