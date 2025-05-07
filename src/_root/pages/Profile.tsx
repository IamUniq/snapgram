import { Link, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { useGetUserById, useGetUserFollowers, useGetUserFollowings } from "@/lib/react-query/queriesAndMutations";

import { LikedPosts } from "@/_root/pages";
import { FollowButton, GridPostList, HighlightStories, Loader, ShareModal } from "@/components/shared";
import UserContent from "@/components/shared/UserContent";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Play } from "lucide-react";

const Profile = () => {
  const { user } = useUserContext();
  const { id } = useParams()
  const { pathname } = useLocation()

  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)

  const { data: currentUser, isPending: isGettingUser } = useGetUserById(id || "")
  const { data: userFollowers } = useGetUserFollowers(id || "")
  const { data: userFollowings } = useGetUserFollowings(id || "")

  if (!currentUser || isGettingUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

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
          <AlertDialog>
            <AlertDialogTrigger>
              <img
                src={ currentUser.imageUrl || "/assets/icons/profile-placeholder.svg" }
                className="w-28 h-28 rounded-full"
              />
            </AlertDialogTrigger>
            <AlertDialogContent className={ cn("w-64 rounded-lg bg-dark-4 text-light-2", currentUser.stories.length > 0 ? "h-36" : "h-28") }>
              <Link to={ `/profile/${user.id}/edit` } className="flex items-center">
                <img src="/assets/icons/edit.svg"
                  width={ 20 } height={ 20 }
                  className="mr-2"
                />
                <p className="small-medium">{ `${currentUser.imageUrl ? "Update" : "Add"} Profile Picture` }</p>
              </Link>
              { currentUser.stories.length > 0 &&
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
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{ currentUser.name }</h1>
              <h2 className="text-gray-500">@{ currentUser.username }</h2>
            </div>

            <div className="flex gap-8 flex-wrap z-20">
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
            <Link to={ `/profile/${user.id}/edit` } className="flex-center gap-2 bg-dark-4 p-2 rounded-md w-1/2">
              <img src="/assets/icons/edit.svg" width={ 20 } height={ 20 } />
              <p className="small-medium">Edit profile</p>
            </Link>
          ) : (
            <div className="flex gap-3 items-center">
              <FollowButton followerId={ user.id } followingId={ currentUser.$id } />

              <Button
                asChild
                className="bg-light-2 text-black"
              >
                <Link to={ `/profile/${id}/chat` }>
                  Message
                </Link>
              </Button>
            </div>
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
            <p className="small-medium lg:base-medium">Share Profile</p>
          </Button>
        </div>

        <HighlightStories />
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
          element={ <GridPostList posts={ currentUser.posts } showStats={ false } showUser={ false } />
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