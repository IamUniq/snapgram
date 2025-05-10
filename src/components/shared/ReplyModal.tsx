import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"

import { useGetCommentReplies } from "@/lib/react-query/queriesAndMutations"
import { cn } from "@/lib/utils"
import CommentForm from "../forms/CommentForm"
import CommentLine from "./CommentLine"
import Loader from "./Loader"
import React from "react"

interface ReplyModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    parentComment: {
        $id: string
        userId: string
        userName: string
        userImage: string;
        content: string
    }
    userId: string
}

const ReplyModal = ({ open, userId, setOpen, parentComment }: ReplyModalProps) => {
    const { data: replies, isPending: isGettingReplies } = useGetCommentReplies(parentComment.$id)

    return (
        <Sheet
            open={ open } onOpenChange={ () => setOpen(!open) }
        >
            <SheetContent side="bottom" className="w-full h-[70vh] overflow-y-scroll custom-scrollbar md:w-[70vw] bg-dark-2 rounded-t-xl mx-auto border-dark-4">
                <SheetHeader>
                    <SheetTitle aria-label={ `Replies for ${parentComment.$id}` }>Replies</SheetTitle>
                    <SheetDescription className="hidden">Replies for { parentComment.$id }</SheetDescription>
                </SheetHeader>

                <div className="flex items-center gap-4 my-6">
                    <img src={ parentComment.userImage } alt="comment creator" className="rounded-full w-12 h-12" />

                    <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-lg">{ parentComment.userName }</h3>
                        <p className="text-base">{ parentComment.content }</p>
                    </div>
                </div>
                { isGettingReplies ? (
                    <div className="w-full h-full flex-center">
                        <Loader />
                    </div>
                ) : !replies || replies.documents.length === 0
                    ? <p className="body-bold text-light-2 text-center h-[60%] flex-center">No replies yet</p>
                    : (
                        <ul className="mt-4 flex flex-col gap-3 ml-14 border-l border-gray-500 px-5">
                            { replies?.documents.map((comment, index) => (
                                <li key={ `${comment.$id}-${index}` }>
                                    <CommentLine
                                        userId={ userId }
                                        type="reply"
                                        comment={ comment }
                                    />
                                    <hr className={ cn("border-dark-4/75 w-full", {
                                        "hidden": (index + 1) === replies.total
                                    }) } />
                                </li>
                            )
                            ) }
                        </ul>
                    ) }

                <div className="w-[90%] fixed bottom-3">
                    <CommentForm type="reply" contentId={ parentComment.$id } creatorId={ parentComment.userId } />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ReplyModal