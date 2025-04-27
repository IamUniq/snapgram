import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString as formatDate } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import CommentsModal from "./CommentsModal";
import ImageView from "./ImageView";
import PostStats from "./PostStats";
import { useModalContext } from "@/context/ModalContext";

type PostCardProps = {
  post: Models.Document;
};
const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const { modalToOpen } = useModalContext()

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={ `/profile/${post.creator.$id}` }>
            <img
              src={
                post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
              }
              alt={ post.creator.name }
              className="rounded-full w-12 lg:h-12"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              { post.creator.name }
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                { formatDate(post.$createdAt) }
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                { post.location }
              </p>
            </div>
          </div>
        </div>

        <Link
          to={ `/update-post/${post.$id}` }
          className={ `${user.id !== post.creator.$id && "hidden"}` }
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={ 20 } height={ 20 } />
        </Link>
      </div>

      { modalToOpen?.type === 'COMMENT' && modalToOpen.postId === post.$id && (
        <CommentsModal userId={ user.id } />
      ) }

      <div className="mt-4">
        <Link to={ `posts/${post.$id}` } className="small-medium lg:base-medium py-5">
          <p className="line-clamp-4 whitespace-pre-line">
            { post.caption }
          </p>
          <ul className="flex gap-1 mt-2">
            { post?.tags.map((tag: string) => (
              <li key={ tag } className="text-light-3">
                #{ tag }
              </li>
            )) }
          </ul>
        </Link>

        <ImageView images={ post.imageUrls } containerClassname="pt-5" className="post-card_img" />
      </div>

      <PostStats post={ post } userId={ user.id } comments={ post.comments } />
    </div>
  );
};

export default PostCard;