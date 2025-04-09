import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader
} from "@/components/ui/sheet";
import { shareOptions } from "@/constants";
import { useModalContext } from "@/context/ModalContext";
import { useGetUserFollowings } from "@/lib/react-query/queriesAndMutations";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import Loader from "./Loader";
import { toast } from "sonner";

const ShareModal = ({ userId }: { userId: string }) => {
    const [searchValue, setSearchValue] = useState("")
    const { modalToOpen, setModalToOpen } = useModalContext()

    const postId = modalToOpen?.postId

    const onOpenChange = () => {
        if (!postId) {
            setModalToOpen(null)
        }

        modalToOpen?.type === 'DELETE'
            ? setModalToOpen(null)
            : setModalToOpen({ type: 'DELETE', postId })
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`http://localhost:5173/posts/${postId}`)

        toast.success("Copied")
    }

    const { data: userFollowings, isPending: isGettingUserFollowings } = useGetUserFollowings(userId);

    const searchResults = userFollowings?.documents.filter(following => following.username.includes(searchValue))

    return (
        <Sheet
            open={modalToOpen?.type === 'SHARE'}
            onOpenChange={onOpenChange}
        >
            <SheetContent
                side="bottom"
                aria-label="share post"
                className={cn("max-w-2xl overflow-y-scroll custom-scrollbar md:w-[70vw] bg-dark-2 rounded-t-xl mx-auto border-dark-4", searchResults && searchResults?.length > 4 ? "h-[70vh]" : 'h-[50vh] md:h-[40vh]')}
            >
                <SheetHeader className="!flex-center">
                    <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4  max-w-[26rem] sm:max-w-[29rem] overflow-scroll">
                        <img
                            src="/assets/icons/search.svg"
                            width={24}
                            height={24}
                            alt="search"
                        />
                        <Input
                            type="text"
                            placeholder="Search"
                            className="explore-search"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </SheetHeader>

                {/* TODO: Implement the share functionality when the chat system is up and running */}
                <ul className="flex flex-wrap gap-6 w-full overflow-y-scroll custom-scrollbar mt-6">
                    {isGettingUserFollowings
                        ? <Loader />
                        : searchResults?.map(following => (
                            <li key={following.$id} className="flex-center flex-col gap-2 cursor-pointer">
                                <img
                                    src={following.imageUrl || "/assets/icons/profile-placeholder.svg"}
                                    width={48}
                                    height={48}
                                    alt="user avatar"
                                    className="rounded-full"
                                />

                                <p>{following.username}</p>
                            </li>
                        ))
                    }
                </ul>

                <div className="w-full fixed bottom-3 flex !flex-row gap-2 overflow-x-scroll custom-scrollbar">
                    {shareOptions.map(option => (
                        <div
                            key={option.label}
                            className="flex-center flex-col gap-1 p-2 cursor-pointer w-[6.5rem] sm:w-28"
                        >
                            <option.icon
                                size={9}
                                className="w-10 h-10 p-2 bg-gray-400 text-black rounded-full"
                                onClick={
                                    option.label === "Copy link"
                                        ? copyToClipboard
                                        : () => { }}
                            />

                            <p className="text-[13px] font-medium text-light-2">{option.label}</p>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ShareModal;