import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { useModalContext } from "@/context/ModalContext"

import { useGetComments } from "@/lib/react-query/queriesAndMutations"
import CommentForm from "../forms/CommentForm"
import CommentsPanel from "./CommentsPanel"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const CommentsModal = ({ userId, postId }: { userId: string; postId: string }) => {
    const [postCreatorId, setPostCreatorId] = useState("")
    const { modalToOpen, setModalToOpen } = useModalContext()

    const onOpenChange = () => {
        modalToOpen === 'COMMENT'
            ? setModalToOpen(null)
            : setModalToOpen('COMMENT')
    }

    const { data: comments } = useGetComments(postId)

    useEffect(() => {
        if (comments) {
            setPostCreatorId(comments.documents[0].post.creator.$id)
        }
    }, [comments])
    return (
        <Sheet open={modalToOpen === 'COMMENT'} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="w-full h-[70vh] overflow-y-scroll custom-scrollbar md:w-[70vw] bg-dark-2 rounded-t-xl mx-auto border-dark-4">
                <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                    <SheetDescription className="hidden">Comments for {postId}</SheetDescription>
                </SheetHeader>
                {!comments || comments.documents.length === 0
                    ? <p className="body-bold text-light-2 text-center h-[90%] flex-center">No comments yet</p>
                    : (
                        <div className="mt-4 flex flex-col gap-3">
                            {comments?.documents.map((comment, index) => (
                                <>
                                    <CommentsPanel
                                        key={index + comment.commenter.name}
                                        userId={userId}
                                        comment={comment}
                                    />
                                    <hr className={cn("border-dark-4/75 w-full", {
                                        "hidden": (index + 1) === comments.total
                                    })} />
                                </>
                            )
                            )}
                        </div>
                    )}

                <div className="w-[90%] fixed bottom-3">
                    <CommentForm postId={postId} postCreatorId={postCreatorId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CommentsModal