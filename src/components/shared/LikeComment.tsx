import { useLikeComment } from '@/lib/react-query/queriesAndMutations';
import { checkIsLiked } from '@/lib/utils';
import React, { useState } from 'react'

type LikeCommentProps = {
    userId: string;
    commentId: string;
    postLikes: string[]
}

const LikeComment = ({ userId, commentId, postLikes }: LikeCommentProps) => {
    const [likes, setLikes] = useState<string[]>(postLikes)
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
        likeComment({ contentId: commentId, likesArray: newLikes });
    }
    return (
        <div className="flex items-center place-items-start">
            <img
                src={
                    checkIsLiked(likes, userId)
                        ? "/assets/icons/liked.svg"
                        : "/assets/icons/like.svg"
                }
                alt="like"
                width={ 20 }
                height={ 20 }
                onClick={ handleLikeComment }
                className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium ml-1">
                { likes.length }
            </p>
        </div>
    )
}

export default LikeComment