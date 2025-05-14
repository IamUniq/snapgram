import { useModalContext } from "@/context/ModalContext";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked, cn } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const ShareModal = React.lazy(() => import('./ShareModal'))

type PostStatsProps = {
  post: Models.Document;
  userId: string;
  comments?: number;
  showComments?: boolean
};

const PostStats = ({ post, userId, comments, showComments = true }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const { setModalToOpen } = useModalContext()

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false)

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent<HTMLOrSVGImageElement>) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost(hasLiked
      ? { postId: post.$id, likesArray: newLikes }
      : { postId: post.$id, likesArray: newLikes, targetId: post.creator.$id, userId }
    );
  };

  const handleSavePost = (e: React.MouseEvent<HTMLOrSVGImageElement>) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);

      return;
    }

    savePost({ postId: post.$id, userId: userId, targetId: post.creator.$id });
    setIsSaved(true);
  };

  const handleSharePost = (e: React.MouseEvent<HTMLOrSVGImageElement>) => {
    e.stopPropagation();

    setShareModalIsOpen(true);
  }

  return (
    <div className="flex justify-between items-center z-20">
      { shareModalIsOpen &&
        <ShareModal
          type="posts"
          userId={ userId }
          contentId=""
          open={ shareModalIsOpen }
          setOpen={ setShareModalIsOpen }
        />
      }
      <div className="flex gap-3">
        <div className="flex-center gap-2">
          <img
            src={
              checkIsLiked(likes, userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"
            }
            alt="like"
            width={ 20 }
            height={ 20 }
            onClick={ handleLikePost }
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">{ likes.length }</p>
        </div>

        <div className="flex-center gap-1">
          <img
            src={ "/assets/icons/share.svg" }
            alt="share"
            width={ 22 }
            height={ 22 }
            onClick={ handleSharePost }
            className="cursor-pointer"
          />
          <p className="small-medium lg:base-medium">0</p>
        </div>

        { showComments && (
          <div className="flex-center gap-2">
            <img
              src={ "/assets/icons/chat.svg" }
              alt="comment"
              width={ 20 }
              height={ 20 }
              onClick={ () => setModalToOpen({ type: 'COMMENT', postId: post.$id }) }
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{ comments || 0 }</p>
          </div>
        ) }
      </div>

      <div className={ cn("flex gap-2", {
        "ml-3": showComments === false
      }) }>
        { isSavingPost || isDeletingSavedPost ? (
          <Loader />
        ) : (
          <img
            src={ isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg" }
            alt="save"
            width={ 20 }
            height={ 20 }
            onClick={ handleSavePost }
            className="cursor-pointer"
          />
        ) }
      </div>
    </div>
  );
};

export default PostStats;
