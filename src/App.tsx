import { Route, Routes } from "react-router-dom";
import "./globals.css";

import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  Settings,
  Notifications,
  CreateStory,
  ViewStories,
  Reels,
  ViewHighlights
} from "./_root/pages";
import EditProfile from "./_root/pages/EditProfile";
import { Toaster } from "./components/ui/sonner";
import { StoryProvider } from "./context/StoryContext";

const App = () => {
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
          <Route path="/profile/:id/*" element={<Profile />} />
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
