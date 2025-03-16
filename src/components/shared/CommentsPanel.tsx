import { useDeleteComment, useLikeComment } from "@/lib/react-query/queriesAndMutations"
import { checkIsLiked, cn, multiFormatDateString as formatDate } from "@/lib/utils"
import { Models } from "appwrite"
import { UndoDot } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const CommentsPanel = (
    { userId, comment }:
        { userId: string, comment: Models.Document }
) => {
    const [readMore, setReadMore] = useState(false)
    const [likes, setLikes] = useState<string[]>(comment.likes)

    const { mutate: likeComment } = useLikeComment();

    const handleLikeComment = (e: React.MouseEvent<HTMLOrSVGImageElement>) => {
        e.stopPropagation();

        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId);

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId);
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes)
        likeComment({ commentId: comment.$id, likesArray: newLikes });
    }

    return (
        <div className="flex items-start gap-2 w-full">
            <img
                src={comment.commenter.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt={comment.commenter.name}
                className="rounded-full w-10 h-10"
            />

            <div className="flex flex-col gap-2 w-[84%]">
                <div className="flex flex-wrap gap-1 w-full">
                    <Link
                        to={`/all-users/${comment.commenter.$id}`}
                        className="base-regular text-light-3 whitespace-nowrap"
                    >
                        {comment.commenter.name}
                    </Link>

                    <p className="base-regular w-full">
                        <span className={cn("text-light-1", {
                            "line-clamp-3": comment.quote.length > 100 && !readMore
                        })}>
                            {comment.quote}
                        </span>

                        {comment.quote.length > 100 && (
                            <span onClick={() => setReadMore(!readMore)} className={cn("small-regular cursor-pointer text-light-3", {
                                "ml-2": readMore
                            })}>
                                {readMore ? "See less" : "Read more"}
                            </span>
                        )}

                    </p>
                </div>

                <div className="flex items-center gap-3 subtle-semibold">
                    <p className=" text-light-3">
                        {formatDate(comment.$createdAt)}
                    </p>

                    <div className="flex items-center gap-1 cursor-pointer">
                        <UndoDot size={18} className="text-yellow-500" />
                        Reply
                    </div>
                </div>
            </div>

            <div className="flex items-center place-items-start">
                <img
                    src={
                        checkIsLiked(likes, userId)
                            ? "/assets/icons/liked.svg"
                            : "/assets/icons/like.svg"
                    }
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikeComment}
                    className="cursor-pointer"
                />
                <p className="small-medium lg:base-medium ml-1">
                    {likes.length}
                </p>
            </div>
        </div>
    )
}

export default CommentsPanel