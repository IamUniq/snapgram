import { Link, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useGetUserFollowers, useGetUserFollowings, useGetUserPosts } from "@/lib/react-query/queriesAndMutations";

import { LikedPosts } from "@/_root/pages";
import { FollowButton, GridPostList, HighlightStories, Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import UserContent from "@/components/shared/UserContent";
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user } = useUserContext();
  const { id } = useParams()
  const { pathname } = useLocation()

  const { data: currentUser, isPending: isGettingUser } = useGetUserById(id || "")
  const { data: userPosts, isPending: isGettingUserPosts } = useGetUserPosts(id || "")
  const { data: userFollowers } = useGetUserFollowers(id || "")
  const { data: userFollowings } = useGetUserFollowings(id || "")

  if (!currentUser || isGettingUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <img
          src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
          className="w-40 h-40 rounded-full"
        />

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between w-[26rem]">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <h2 className="text-gray-500">@{currentUser.username}</h2>
            </div>

            {currentUser.$id === user.id ? (
              <Link to={`/profile/${user.id}/edit`} className="flex-center h-8 gap-2 bg-dark-4 p-2 rounded-xl">
                <img src="/assets/icons/edit.svg" width={20} height={20} />
                <p className="small-medium">Edit profile</p>
              </Link>
            ) : (
              <div className="flex gap-3 items-center">
                <FollowButton followerId={user.id} followingId={currentUser.$id} />

                <Button
                  asChild
                  className="bg-light-2 text-black"
                >
                  <Link to={`/profile/${id}/chat`}>
                    Message
                  </Link>
                </Button>
              </div>
            )}
          </div>


          <div className="flex gap-8 flex-wrap z-20">
            <div className="flex flex-col">
              <p className="body-bold text-primary-500">{userPosts?.total || 0}</p>
              <p className="small-medium lg:base-medium text-light-2">Posts</p>
            </div>
            <Link to={`/profile/${id}/followers`} className="flex flex-col">
              <p className="body-bold text-primary-500">{userFollowers?.total || 0}</p>
              <p className="small-medium lg:base-medium text-light-2">Followers</p>
            </Link>
            <Link to={`/profile/${id}/following`} className="flex flex-col">
              <p className="body-bold text-primary-500">{userFollowings?.total || 0}</p>
              <p className="small-medium lg:base-medium text-light-2">Following</p>
            </Link>
          </div>

          <div className="max-w-[34rem] text-light-2 whitespace-pre-line">
            {currentUser.bio || "There is no bio yet"}
          </div>

          <HighlightStories />
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <Link
          to={`/profile/${currentUser.$id}`}
          className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Link>

        {currentUser.$id === user.id && (
          <Link
            to={`/profile/${id}/liked-posts`}
            className={cn("profile-tab rounded-r-lg", {
              "!bg-dark-3": pathname === `/profile/${id}/liked-posts`,
              "rounded-r-none": pathname === `/profile/${id}/"followers"}` || pathname === `/profile/${id}/following`
            })}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        )}
      </div>

      <Routes>
        <Route
          index
          element={
            isGettingUserPosts
              ? <Loader />
              : <GridPostList posts={userPosts?.documents} showStats={false} showUser={false} />
          }
        />
        {user.id === id && <Route path="/liked-posts" element={<LikedPosts />} />}
        <Route path="/following" element={<UserContent data={userFollowings?.documents!} loggedInUser={user.id} />} />
        <Route path="/followers" element={<UserContent data={userFollowers?.documents!} loggedInUser={user.id} />} />
      </Routes>

      <Outlet />
    </div>
  );
};

export default Profile;