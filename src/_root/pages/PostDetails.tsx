import { multiFormatDateString as formatDate } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

import { GridPostList, ImageView } from "@/components/shared";
import CommentsModal from "@/components/shared/CommentsModal";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useDeletePost, useGetPostById, useGetRelatedPosts } from "@/lib/react-query/queriesAndMutations";
import { useCommentContext } from "@/context/CommentsContext";

const PostDetails = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useUserContext();
  const { isCommentModalOpen } = useCommentContext()

  const { data: post, isPending: isGettingPost } = useGetPostById(id || "")

  const { data: relatedPosts, isPending: isGettingRelatedPosts } = useGetRelatedPosts(post?.$id || "", post?.tags)

  const { mutateAsync: deletePost, isPending: isDeletingPost } = useDeletePost()

  const handleDeletePost = async () => {
    await deletePost({ postId: post?.$id || "", imageId: post?.imageId })
    navigate(-1)
  }

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isCommentModalOpen && (
        <CommentsModal
          userId={user.id}
          postId={post?.$id || ""}
        />
      )}

      {isGettingPost || !post
        ? <Loader />
        : (
          <>
            <div className="post_details-card">
              <ImageView
                images={post.imageUrls}
                containerClassname="xl:w-[48%]"
                className="post_details-img"
              />

              <div className="post_details-info">
                <div className="flex flex-col gap-4 xl:h-[93%]">
                  <div className="flex-between w-full">
                    <Link
                      to={`/profile/${post.creator.$id}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={
                          post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
                        }
                        alt={post.creator.name}
                        className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                      />

                      <div className="flex flex-col">
                        <p className="base-medium lg:body-bold text-light-1">
                          {post.creator.name}
                        </p>
                        <div className="flex-center gap-2 text-light-3">
                          <p className="subtle-semibold lg:small-regular">
                            {formatDate(post.$createdAt)}
                          </p>
                          -
                          <p className="subtle-semibold lg:small-regular">
                            {post.location}
                          </p>
                        </div>
                      </div>
                    </Link>

                    <div className="flex-center">
                      <Link
                        to={`/update-post/${post.$id}`}
                        className={`${user.id !== post.creator.$id && "hidden"}`}
                      >
                        <img src="/assets/icons/edit.svg" alt="edit" width={24} height={24} />
                      </Link>
                      <Button
                        onClick={handleDeletePost}
                        variant="ghost"
                        disabled={isDeletingPost}
                        className={`ghost_details-delete_btn ${user.id !== post.creator.$id && "hidden"}`}
                      >
                        <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col w-full small-medium lg:base-regular h-full overflow-scroll custom-scrollbar">
                    <p className="whitespace-pre-line pr-1">{post.caption}</p>
                    <ul className="flex gap-1 mt-2">
                      {post?.tags.map((tag: string) => (
                        <li key={tag} className="text-light-3">
                          #{tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="w-full xl:h-[2%]">
                  <PostStats post={post} userId={user.id} comments={post.comments.length} />
                </div>
              </div>
            </div>

            <div className="w-full max-w-5xl">
              <hr className="border w-full border-dark-4/75" />

              <h3 className="body-bold md:h3-bold w-full my-10">
                More Related Posts
              </h3>

              {isGettingRelatedPosts || !relatedPosts
                ? <Loader />
                : <GridPostList posts={relatedPosts} />
              }
            </div>
          </>
        )}
    </div>
  )
};

export default PostDetails;
