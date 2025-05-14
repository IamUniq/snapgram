import { Play } from "lucide-react";
import React, { useState } from "react";
import { Link, Outlet, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useGetUserFollowers, useGetUserFollowings } from "@/lib/react-query/queriesAndMutations";

import { FollowButton, GridPostList, Loader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ShareModal = React.lazy(() => import('@/components/shared/ShareModal'))
const LikedPosts = React.lazy(() => import('@/_root/pages/LikedPosts'))
const UserContent = React.lazy(() => import('@/components/shared/UserContent'))

const Profile = () => {
  const { user } = useUserContext();
  const { id } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)

  const { data: currentUser, isPending: isGettingUser } = useGetUserById(id || "")
  const { data: userFollowers } = useGetUserFollowers(id || "")
  const { data: userFollowings } = useGetUserFollowings(id || "")

  if (!currentUser || isGettingUser)
    return (
      <div className="flex-center w-full h-[90vh]">
        <Loader />
      </div>
    );

  const hasStory = currentUser?.stories > 0

  return (
    <div className="relative profile-container">
      { shareModalIsOpen &&
        <ShareModal
          type="profile"
          userId={ user.id }
          contentId={ currentUser.$id }
          open={ shareModalIsOpen }
          setOpen={ setShareModalIsOpen }
        />
      }

      <div className="flex flex-col items-start gap-6 w-full">
        <div className="flex gap-8 relative w-full">
          { currentUser.$id === user.id ? (
            <Dialog>
              <DialogTrigger>
                <img
                  src={ currentUser.imageUrl || "/assets/icons/profile-placeholder.svg" }
                  className={ cn("w-20 h-20 sm:w-28 sm:h-28 rounded-full", {
                    'border-2 border-primary-500': hasStory
                  }) }
                />
              </DialogTrigger>
              <DialogContent
                showCloseButton={ false }
                className={ cn("w-64 rounded-lg bg-dark-4 text-light-2",
                  hasStory ? "h-36" : "h-28"
                ) }>
                <DialogHeader className="sr-only">
                  <DialogTitle>Update Profile</DialogTitle>
                  <DialogDescription >Update your profile, view story or add one</DialogDescription>
                </DialogHeader>
                <Link to={ `/profile/${user.id}/edit` } className="flex items-center">
                  <img src="/assets/icons/edit.svg"
                    width={ 20 } height={ 20 }
                    className="mr-2"
                  />
                  <p className="small-medium">{ `${currentUser.imageUrl ? "Update" : "Add"} Profile Picture` }</p>
                </Link>
                { hasStory &&
                  <Link to={ `/profile/${user.id}/story` } className="flex items-center">
                    <Play size={ 20 } color="#877eff" className="mr-2" />
                    <p className="small-medium">View Story</p>
                  </Link>
                }
                <Link to="/create-story" className="flex items-center">
                  <img
                    src={ "/assets/icons/gallery-add.svg" }
                    width={ 20 } height={ 20 }
                    className="mr-2"
                  />
                  Add Story
                </Link>
              </DialogContent>
            </Dialog>
          ) : (
            <div onClick={ () => {
              hasStory && navigate
            } }>
              <img
                src={ currentUser.imageUrl || "/assets/icons/profile-placeholder.svg" }
                className={ cn("w-20 h-20 sm:w-28 sm:h-28 rounded-full", {
                  'border-2 border-primary-500': hasStory
                }) }
              />
            </div>
          ) }


          <div className="flex flex-col gap-3 md:mt-4">
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold">{ currentUser.name }</h1>
              <h2 className="text-sm md:text-base text-gray-500">@{ currentUser.username }</h2>
            </div>

            <div className="flex gap-5 md:gap-8 flex-wrap z-20">
              <div className="flex flex-col">
                <p className="body-bold text-primary-500">{ currentUser.posts.length }</p>
                <p className="small-medium lg:base-medium text-light-2">Posts</p>
              </div>
              <Link to={ `/profile/${id}/followers` } className="flex flex-col">
                <p className="body-bold text-primary-500">{ userFollowers?.total || 0 }</p>
                <p className="small-medium lg:base-medium text-light-2">Followers</p>
              </Link>
              <Link to={ `/profile/${id}/following` } className="flex flex-col">
                <p className="body-bold text-primary-500">{ userFollowings?.total || 0 }</p>
                <p className="small-medium lg:base-medium text-light-2">Following</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full text-light-2 whitespace-pre-line">
          { currentUser.bio }
        </div>

        <div className="flex gap-2 w-full md:w-[25rem]">
          { currentUser.$id === user.id ? (
            <Link
              to={ `/profile/${user.id}/edit` }
              className="flex-center gap-2 bg-dark-4 p-2 rounded-md w-1/2"
            >
              <img src="/assets/icons/edit.svg" width={ 20 } height={ 20 } />
              <p className="small-medium">Edit profile</p>
            </Link>
          ) : (
            <>
              <FollowButton
                followerId={ user.id }
                followingId={ currentUser.$id }
                className="w-1/3"
              />

              <Button
                asChild
                className="bg-light-2 text-black w-1/3"
              >
                <Link to={ `/profile/${id}/chat` }>
                  Message
                </Link>
              </Button>
            </>
          ) }

          <Button
            className={ cn("flex-center gap-1 bg-dark-4", currentUser.$id === user.id ? 'w-1/2' : 'w-1/3') }
            onClick={ () => setShareModalIsOpen(true) }
          >
            <img
              src={ "/assets/icons/share.svg" }
              alt="share"
              width={ 22 }
              height={ 22 }
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">Share</p>
          </Button>
        </div>

        {/* TODO: Create Highlights for each page */ }
        {/* <HighlightStories type="highlight" /> */ }
      </div>

      <div className="flex max-w-5xl w-full">
        <Link
          to={ `/profile/${currentUser.$id}` }
          className={ `profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"
            }` }>
          <img
            src={ "/assets/icons/posts.svg" }
            alt="posts"
            width={ 20 }
            height={ 20 }
          />
          Posts
        </Link>

        { currentUser.$id === user.id && (
          <Link
            to={ `/profile/${id}/liked-posts` }
            className={ cn("profile-tab rounded-r-lg", {
              "!bg-dark-3": pathname === `/profile/${id}/liked-posts`,
              "rounded-r-none": pathname === `/profile/${id}/"followers"}` || pathname === `/profile/${id}/following`
            }) }>
            <img
              src={ "/assets/icons/like.svg" }
              alt="like"
              width={ 20 }
              height={ 20 }
            />
            Liked Posts
          </Link>
        ) }
      </div>

      <Routes>
        <Route
          index
          element={ <GridPostList posts={ currentUser.posts } showStats={ true } showUser={ false } />
          }
        />
        { user.id === id && <Route path="/liked-posts" element={ <LikedPosts /> } /> }
        <Route path="/following" element={ <UserContent data={ userFollowings?.documents! } loggedInUser={ user.id } /> } />
        <Route path="/followers" element={ <UserContent data={ userFollowers?.documents! } loggedInUser={ user.id } /> } />
      </Routes>

      <Outlet />
    </div>
  );
};

export default Profile;