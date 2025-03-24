import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { useModalContext } from "@/context/ModalContext"

import { cn } from "@/lib/utils"
import { Models } from "appwrite"
import { useEffect, useState } from "react"
import CommentForm from "../forms/CommentForm"
import CommentsPanel from "./CommentsPanel"

type CommentsModalProps = {
    userId: string;
    comments: Models.DocumentList<Models.Document> | undefined;
}
const CommentsModal = ({ userId, comments }: CommentsModalProps) => {
    const [postCreatorId, setPostCreatorId] = useState("")
    const { modalToOpen, setModalToOpen } = useModalContext()

    const postId = modalToOpen?.postId

    useEffect(() => {
        if (comments && comments.documents.length > 0) {
            setPostCreatorId(comments.documents[0]?.post?.creator?.$id || "");
        } else {
            setPostCreatorId("");
        }
    }, [comments, postId]);

    const onOpenChange = () => {
        if (!postId) {
            setModalToOpen(null)
        }

        modalToOpen?.type === 'COMMENT'
            ? setModalToOpen(null)
            : setModalToOpen({ type: 'COMMENT', postId })
    }

    return (
        <Sheet
            open={modalToOpen?.type === 'COMMENT'}
            onOpenChange={onOpenChange}
        >
            <SheetContent side="bottom" className="w-full h-[70vh] overflow-y-scroll custom-scrollbar md:w-[70vw] bg-dark-2 rounded-t-xl mx-auto border-dark-4">
                <SheetHeader>
                    <SheetTitle aria-label={`Comments for ${postId}`}>Comments</SheetTitle>
                    <SheetDescription className="hidden">Comments for {postId}</SheetDescription>
                </SheetHeader>
                {!comments || comments.documents.length === 0
                    ? <p className="body-bold text-light-2 text-center h-[90%] flex-center">No comments yet</p>
                    : (
                        <div className="mt-4 flex flex-col gap-3">
                            {comments?.documents.map((comment, index) => (
                                <>
                                    <CommentsPanel
                                        key={`${comment.$id}-${index}`}
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
                    <CommentForm postId={postId || ""} postCreatorId={postCreatorId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CommentsModal