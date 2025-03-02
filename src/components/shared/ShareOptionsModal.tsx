import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { shareOptions } from "@/constants";
import { useShareContext } from "@/context/SharePostContext";
import { X } from "lucide-react";
import { useState } from 'react';

const ShareOptionsModal = ({ id, caption }: { id: string; caption: string }) => {
    const { isShareModalOpen, setShareModalOpen } = useShareContext();

    const [searchValue, setSearchValue] = useState("")

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`http://localhost:5173/posts/${id}`)
    }

    return (
        <AlertDialog
            open={isShareModalOpen}
            onOpenChange={(newValue) => setShareModalOpen(newValue)}
        >
            <AlertDialogContent aria-label="Share Options" className="overflow-hidden">
                <AlertDialogHeader>
                    <AlertDialogTitle className="hidden">Share By:</AlertDialogTitle>
                    <AlertDialogDescription className="hidden">Share post to your friends</AlertDialogDescription>
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

                    <X
                        size={25}
                        className="absolute -top-2 right-0 text-black cursor-pointer bg-primary-500 p-1 rounded-b-md hover:bg-primary-600 transition-colors duration-300 ease-in-out"
                        onClick={() => setShareModalOpen(false)}
                    />
                </AlertDialogHeader>

                <div className="flex gap-2" >
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
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ShareOptionsModal;