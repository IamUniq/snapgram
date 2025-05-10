import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader
} from "@/components/ui/sheet";
import { shareOptions } from "@/constants";
import { useGetUserFollowings } from "@/lib/react-query/queriesAndMutations";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { toast } from "sonner";
import Loader from "./Loader";

interface ShareModalProps {
    type: "posts" | "profile"
    userId: string;
    contentId: string;
    open: boolean;
    setOpen: (value: boolean) => void
}

type ShareOptions = 'copy' | 'share' | 'story' | 'download'

const ShareModal = ({ type, userId, contentId, open, setOpen }: ShareModalProps) => {
    const [searchValue, setSearchValue] = useState("")

    const shareActions = (action: ShareOptions) => {
        switch (action) {
            case 'copy':
                navigator.clipboard.writeText(`http://localhost:5173/${type}/${contentId}`)

                toast.success("Copied")
                break;

            default:
                break;
        }
    }

    const { data: userFollowings, isPending: isGettingUserFollowings } = useGetUserFollowings(userId);

    const searchResults = userFollowings?.documents.filter(following => following.username.includes(searchValue))


    return (
        <Sheet
            open={ open }
            onOpenChange={ setOpen }
        >
            <SheetContent
                side="bottom"
                aria-label="share post"
                showCloseButton={ false }
                className={ cn("w-full mx-auto md:w-[70vw] max-w-2xl bg-dark-2 rounded-t-xl border-dark-4 p-0",
                    searchResults && 'h-[50vh]') }
            >
                <SheetHeader className="flex-center p-4">
                    <div className="flex px-4 w-full rounded-lg bg-dark-4 max-w-[26rem] sm:max-w-[29rem]">
                        <img
                            src="/assets/icons/search.svg"
                            width={ 24 }
                            height={ 24 }
                            alt="search"
                        />
                        <Input
                            type="text"
                            placeholder="Search"
                            className="explore-search"
                            value={ searchValue }
                            onChange={ (e) => setSearchValue(e.target.value) }
                        />
                    </div>
                </SheetHeader>

                {/* TODO: Implement the share functionality when the chat system is up and running */ }
                <ul className="flex flex-wrap gap-6 w-full overflow-y-scroll custom-scrollbar mt-2 px-4">
                    { isGettingUserFollowings
                        ? <Loader />
                        : searchResults?.map(following => (
                            <li key={ following.$id } className="flex-center flex-col gap-2 cursor-pointer">
                                <img
                                    src={ following.imageUrl || "/assets/icons/profile-placeholder.svg" }
                                    width={ 48 }
                                    height={ 48 }
                                    alt="user avatar"
                                    className="rounded-full"
                                />

                                <p>{ following.username }</p>
                            </li>
                        ))
                    }
                </ul>

                <div className="absolute bottom-0 left-0 w-full flex overflow-x-auto whitespace-nowrap gap-2 custom-scrollbar bg-dark-2 border-t border-light-4 rounded-t-xl p-2 touch-pan-y">
                    { shareOptions.map(option => (
                        <div
                            key={ option.label }
                            className="inline-flex flex-col items-center gap-1 p-2 cursor-pointer min-w-[6.5rem] sm:min-w-28"
                        >
                            <div className="w-11 h-11 p-[10px] bg-gray-400 rounded-full">
                                <option.icon
                                    className="w-full h-full text-black"
                                    onClick={ () => shareActions(option.action as ShareOptions) }
                                />
                            </div>
                            <p className="text-[12px] md:text-sm font-medium text-light-2">{ option.label }</p>
                        </div>
                    )) }
                </div>

            </SheetContent>
        </Sheet>
    )
}

export default ShareModal;