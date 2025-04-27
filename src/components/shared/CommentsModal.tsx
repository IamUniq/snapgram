import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { useModalContext } from "@/context/ModalContext"

import { useGetPostComments } from "@/lib/react-query/queriesAndMutations"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import CommentForm from "../forms/CommentForm"
import CommentLine from "./CommentLine"
import Loader from "./Loader"

type CommentsModalProps = {
    userId: string;
}
const CommentsModal = ({ userId }: CommentsModalProps) => {
    const [postCreatorId, setPostCreatorId] = useState("")
    const { modalToOpen, setModalToOpen } = useModalContext()

    const postId = modalToOpen?.postId

    const { data: comments, isPending: isGettingComments } = useGetPostComments(postId!)

    useEffect(() => {
        if (comments && comments.length > 0) {
            setPostCreatorId(comments[0]?.post?.creator?.$id || "");
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

    if (isGettingComments) {
        return (
            <div className="w-full h-full flex-center">
                <Loader />
            </div>
        )
    }

    return (
        <Sheet
            open={ modalToOpen?.type === 'COMMENT' }
            onOpenChange={ onOpenChange }
        >
            <SheetContent side="bottom" className="w-full h-[70vh] overflow-y-scroll custom-scrollbar md:w-[70vw] bg-dark-2 rounded-t-xl mx-auto border-dark-4">
                <SheetHeader>
                    <SheetTitle aria-label={ `Comments for ${postId}` }>Comments</SheetTitle>
                    <SheetDescription className="hidden">Comments for { postId }</SheetDescription>
                </SheetHeader>
                { !comments || comments.length === 0
                    ? <p className="body-bold text-light-2 text-center h-[90%] flex-center">No comments yet</p>
                    : (
                        <ul className="mt-4 flex flex-col gap-3">
                            { comments?.map((comment, index) => (
                                <li key={ `${comment.$id}-${index}` }>
                                    <CommentLine
                                        userId={ userId }
                                        comment={ comment }
                                        type="comment"
                                    />
                                    <hr className={ cn("border-dark-4/75 w-full", {
                                        "hidden": (index + 1) === comments.length
                                    }) } />
                                </li>
                            )
                            ) }
                        </ul>
                    ) }

                <div className="w-[90%] fixed bottom-3">
                    <CommentForm type="comment" contentId={ postId || "" } creatorId={ postCreatorId } />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default CommentsModal