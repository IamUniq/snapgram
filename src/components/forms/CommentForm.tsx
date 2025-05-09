import { useUserContext } from "@/context/AuthContext"
import { useCreateComment, useCreateReply } from "@/lib/react-query/queriesAndMutations"
import { Send } from "lucide-react"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { toast } from "sonner"

const CommentForm = ({ type, contentId, creatorId }: { type: 'comment' | 'reply'; contentId: string, creatorId: string }) => {
    const { user } = useUserContext()
    const [comment, setComment] = useState("")

    const { mutateAsync: createComment, isPending: isCreatingComment, isError: isCommentingError } = type === 'comment' ? useCreateComment() : useCreateReply()

    async function handleCommentSubmit(e: React.MouseEvent<HTMLFormElement> | React.KeyboardEvent<HTMLFormElement>) {
        e.preventDefault()

        const commentData = {
            commenterId: user.id,
            contentId: contentId,
            quote: comment
        }

        const newComment = await createComment({ data: commentData, creatorId })

        if (isCommentingError || !newComment) {
            toast.error("Could not create comment")
        }

        if (newComment) {
            setComment("")
        }
    }

    return (
        <div className="flex gap-3 items-center">
            <img
                src={ user.imageUrl || "/assets/icons/profile-placeholder.svg" }
                alt="profile-image"
                className="rounded-full w-12 h-12"
            />

            <form className="relative w-full md:w-[66%] xl:w-[70%]" onSubmit={ handleCommentSubmit }>
                <Input
                    type="text"
                    placeholder={ `Write your ${type}...` }
                    className="shad-input w-[94%]"
                    value={ comment }
                    onChange={ (e) => setComment(e.target.value) }
                />

                <Button
                    type="submit"
                    disabled={ isCreatingComment }
                    variant="ghost"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 z-50"
                >
                    <Send className=" text-yellow-500" />
                </Button>
            </form>
        </div>
    )
}

export default CommentForm