import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getFileView } from '@/lib/appwrite/api/posts';
import { MoreVertical } from 'lucide-react';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader } from '../shared';

const HighlightStory = React.lazy(() => import('./HighlightStory'));
const ShareModal = React.lazy(() => import('../shared/ShareModal'));

interface StoryPlayerMenuProps {
    currentUser: string;
    userId: string;
    storyId: string;
    mediaId: string;
    mediaUrl: string;
    type: "video" | "text" | "image";
    isHighlighted?: boolean;
    onMenuOpen: () => void;
    onMenuClose: () => void;
}

const StoryPlayerMenu = (props: StoryPlayerMenuProps) => {
    const { currentUser, userId, mediaId, type, isHighlighted, onMenuClose, onMenuOpen } = props;

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [openHighlightModal, setOpenHighlightModal] = useState(false);

    useEffect(() => {
        if (openHighlightModal || openShareModal) {
            onMenuOpen();
        } else if (!dropdownOpen) {
            onMenuClose();
        }
    }, [openHighlightModal, openShareModal, dropdownOpen]);


    const downloadFile = () => {
        const downloadUrl = getFileView(mediaId)

        if (!downloadUrl.data) {
            toast.error("Failed to download story")
            console.error(downloadUrl.error);
            return;
        }

        console.log(downloadUrl.data)

        const link = document.createElement('a');
        link.href = downloadUrl.data;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={(open) => {
                setDropdownOpen(open);
                open ? onMenuOpen() : onMenuClose();
            }}>
                <DropdownMenuTrigger asChild className='cursor-pointer'>
                    <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" className='bg-dark-2 mr-7'>
                    <DropdownMenuItem onClick={() => setOpenShareModal(true)}>Share</DropdownMenuItem>
                    {type !== 'text' && (
                        <>
                            <DropdownMenuItem onClick={downloadFile}>Download</DropdownMenuItem>
                            {(currentUser === userId && !isHighlighted) && (
                                <DropdownMenuItem onClick={() => setOpenHighlightModal(true)}>
                                    Add to Highlights
                                </DropdownMenuItem>
                            )}
                        </>
                    )}

                </DropdownMenuContent>
            </DropdownMenu>

            {openHighlightModal && (
                <Suspense fallback={
                    <div className='flex-center h-44 w-full'>
                        <Loader />
                    </div>
                }>
                    <HighlightStory
                        {...props}
                        contentId={props.storyId}
                        openModal={openHighlightModal}
                        setOpenModal={setOpenHighlightModal}
                    />
                </Suspense>
            )}

            {openShareModal && (
                <Suspense fallback={
                    <div className='flex-center h-44 w-full'>
                        <Loader />
                    </div>
                }>
                    <ShareModal
                        type="story"
                        userId={userId}
                        contentId={userId}
                        open={openShareModal}
                        setOpen={setOpenShareModal}
                    />
                </Suspense>
            )
            }
        </>
    )
}

export default StoryPlayerMenu