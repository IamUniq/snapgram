import { useUserContext } from "@/context/AuthContext"
import { Input } from "../ui/input"
import { Send } from "lucide-react"
import { useState } from "react"
import { useCreateComment } from "@/lib/react-query/queriesAndMutations"
import { useToast } from "@/hooks/use-toast"
import { Button } from "../ui/button"

const CommentForm = ({ postId }: { postId: string }) => {
    const { user } = useUserContext()
    const [comment, setComment] = useState("")

    const { toast } = useToast()

    const { mutateAsync: createComment, isPending: isCreatingComment, isError: isCommentingError } = useCreateComment(postId)

    async function handleCommentSubmit() {
        const commentData = {
            commenterId: user.id,
            postId: postId,
            quote: comment
        }

        const newComment = await createComment(commentData)

        if (isCommentingError || !newComment) {
            toast({
                title: "Could not create comment",
            })
        }

        if (newComment) {
            setComment("")
        }
    }

    return (
        <div className="flex gap-3 items-center">
            <img
                src={user.imageUrl}
                alt="profile-image"
                width={42}
                height={42}
                className="rounded-full"
            />

            <div className="relative w-full">
                <Input
                    type="text"
                    placeholder="Write your comment..."
                    className="shad-input w-[94%]"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <Button
                    disabled={isCreatingComment}
                    variant="ghost"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 z-50"
                    onClick={handleCommentSubmit}
                >
                    <Send className=" text-yellow-500" />
                </Button>
            </div>
        </div>
    )
}

export default CommentForm