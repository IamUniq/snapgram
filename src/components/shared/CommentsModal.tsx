import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { useCommentContext } from "@/context/CommentsContext"

import { useGetComments } from "@/lib/react-query/queriesAndMutations"
import CommentForm from "../forms/CommentForm"
import CommentsPanel from "./CommentsPanel"
import { cn } from "@/lib/utils"

const CommentsModal = ({ userId, postId }: { userId: string; postId: string }) => {
    const { isCommentModalOpen, setCommentModalOpen } = useCommentContext()

    const { data: comments } = useGetComments(postId)
    return (
        <Sheet open={isCommentModalOpen} onOpenChange={setCommentModalOpen}>
            <SheetContent side="bottom" className="w-full h-[70vh] overflow-y-scroll custom-scrollbar lg:w-[50vw] bg-dark-2 rounded-t-xl mx-auto border-dark-4">
                <SheetHeader>
                    <SheetTitle>Comments</SheetTitle>
                </SheetHeader>
                {!comments || comments.documents.length === 0
                    ? <p className="body-bold text-light-2 text-center h-[90%] flex-center">No comments yet</p>
                    : (
                        <div className="mt-4 flex flex-col gap-3">
                            {comments?.documents.map((comment, index) => (
                                <>
                                    <CommentsPanel
                                        key={comment.$id}
                                        userId={userId}
                                        comment={comment}
                                    />
                                    <hr className={cn("border-dark-4/75 w-full", {
                                        "hidden": (index + 1) === comments.total
                                    })} />
                                </>
                            ))}
                        </div>
                    )}

                <div className="w-[90%] fixed bottom-3">
                    <CommentForm postId={postId} />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CommentsModal