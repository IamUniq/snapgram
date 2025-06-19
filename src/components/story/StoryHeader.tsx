import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Loader } from "../shared";

interface StoryHeaderProps {
    isPending: boolean;
    onClose: () => void
    onPost?: () => void
}

export default function StoryHeader({ isPending, onClose, onPost }: StoryHeaderProps) {
    return (
        <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="icon" className="text-white mx-4 items-center" onClick={onClose}>
                <img src="/assets/icons/back.svg" width={25} height={25} />
                <span>Back</span>
            </Button>

            <div className="flex items-center space-x-4">
                {onPost && (
                    <Button
                        onClick={onPost}
                        disabled={isPending}
                        className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white rounded-full px-6"
                    >
                        {!isPending ? (
                            <>
                                Share
                                <Send className="ml-2 h-4 w-4" />
                            </>
                        ) : <Loader />
                        }
                    </Button>
                )}
            </div>
        </div>
    )
}
