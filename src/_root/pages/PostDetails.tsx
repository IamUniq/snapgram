import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { multiFormatDateString as formatDate } from "@/lib/utils";
import { useGetPostById, useGetRelatedPosts } from "@/lib/react-query/queriesAndMutations";

import { useUserContext } from "@/context/AuthContext";
import { useModalContext } from "@/context/ModalContext";
import { Button } from "@/components/ui/button";
import { GridPostList, ImageView, Loader, PostStats } from "@/components/shared";

const CommentsModal = React.lazy(() => import('@/components/shared/CommentsModal'))
const DeleteModal = React.lazy(() => import('@/components/shared/DeleteModal'))

const PostDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useUserContext();
  const { modalToOpen, setModalToOpen } = useModalContext()

  const { data: post, isPending: isGettingPost } = useGetPostById(id || "")

  const { data: relatedPosts, isPending: isGettingRelatedPosts } = useGetRelatedPosts(post?.$id || "", post?.tags)

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={ () => navigate(-1) }
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={ "/assets/icons/back.svg" }
            alt="back"
            width={ 24 }
            height={ 24 }
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      { modalToOpen?.postId === post?.$id && (
        modalToOpen?.type === 'COMMENT' ? (
          <CommentsModal userId={ user.id } />
        ) : modalToOpen?.type === 'DELETE' ? (
          <DeleteModal imageId={ post?.imageId } />
        ) : null
      ) }


      { isGettingPost || !post
        ? (
          <div className="flex-center w-full h-[90vh]"><Loader /></div>
        )
        : (
          <>
            <div className="post_details-card">
              <ImageView
                images={ post.imageUrls }
                containerClassname="xl:w-[48%]"
                className="post_details-img"
              />

              <div className="post_details-info">
                <div className="flex flex-col gap-4 xl:h-[93%]">
                  <div className="flex-between w-full">
                    <Link
                      to={ `/profile/${post.creator.$id}` }
                      className="flex items-center gap-3"
                    >
                      <img
                        src={
                          post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
                        }
                        alt={ post.creator.name }
                        className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                      />

                      <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                          { post.creator.name }
                        </p>
                        <p className="subtle-semibold lg:small-regular">
                          { formatDate(post.$createdAt) }
                        </p>
                        <p className="subtle-semibold lg:small-regular">
                          { post.location }
                        </p>
                      </div>
                    </Link>

                    <div className="flex-center">
                      <Link
                        to={ `/update-post/${post.$id}` }
                        className={ `${user.id !== post.creator.$id && "hidden"}` }
                      >
                        <img src="/assets/icons/edit.svg" alt="edit" width={ 24 } height={ 24 } />
                      </Link>
                      <Button
                        onClick={ () => setModalToOpen({ type: 'DELETE', postId: post.$id }) }
                        variant="ghost"
                        className={ `ghost_details-delete_btn ${user.id !== post.creator.$id && "hidden"}` }
                      >
                        <img src="/assets/icons/delete.svg" alt="delete" width={ 24 } height={ 24 } />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col w-full small-medium lg:base-regular h-full overflow-scroll custom-scrollbar">
                    <p className="whitespace-pre-line pr-1">{ post.caption }</p>
                    <ul className="flex gap-1 mt-2">
                      { post?.tags.map((tag: string) => (
                        <li key={ tag } className="text-light-3">
                          #{ tag }
                        </li>
                      )) }
                    </ul>
                  </div>
                </div>

                <div className="w-full xl:h-[2%]">
                  <PostStats post={ post } userId={ user.id } comments={ post.comments } />
                </div>
              </div>
            </div>

            <div className="w-full max-w-5xl">
              <hr className="border w-full border-dark-4/75" />

              <h3 className="body-bold md:h3-bold w-full my-10">
                More Related Posts
              </h3>

              { isGettingRelatedPosts || !relatedPosts
                ? (
                  <div className="w-full h-[4rem] flex-center">
                    <Loader />
                  </div>
                )
                : relatedPosts.length > 0 ? (
                  <GridPostList posts={ relatedPosts } />
                ) : (
                  <div className="text-sm font-medium">No related posts found</div>
                ) }
            </div>
          </>
        ) }
    </div>
  )
};

export default PostDetails;