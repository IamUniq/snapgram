import { useHighlightStory } from '@/lib/react-query/queriesAndMutations';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Loader } from '../shared';

interface HighlightStoryProps {
    currentUser: string;
    userId: string;
    contentId: string;
    mediaId: string;
    mediaUrl: string;
    openModal: boolean;
    type: "video" | "image" | "text"
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const HighlightStory = ({ currentUser, contentId, mediaId, mediaUrl, type, openModal, setOpenModal }: HighlightStoryProps) => {
    const [highlightName, setHighlightName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync: highlightStory, isPending: isHighlightingStory } = useHighlightStory();

    const highlight = async () => {
        console.log("Highlighting story", {
            storyId: contentId,
            userId: currentUser,
            title: highlightName,
            mediaId,
            mediaUrl,
        })
        try {
            if (type === 'text') {
                setError("Text stories cannot be highlighted.");
                return;
            }

            const highlightedStory = await highlightStory({
                storyId: contentId,
                userId: currentUser,
                title: highlightName,
                mediaType: type,
                mediaId,
                mediaUrl,
            });

            if (!highlightedStory || highlightedStory.title === '') {
                setError("Failed to highlight. Please try again.");
                return;
            }

            setHighlightName("");
            toast.success("Story added to highlights")
            setOpenModal(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to add story to highlights");
        }
    }

    useEffect(() => {
        if (highlightName.trim()) {
            setError(null);
        }
    }, [highlightName])

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogContent className='bg-dark-4 max-w-md rounded-lg'>
                <DialogHeader>
                    <DialogTitle>Add to Highlights</DialogTitle>
                    <DialogDescription className="sr-only"></DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-2'>
                    <Label className='text-base'>Highlight Title:</Label>
                    <Input
                        type='text'
                        value={highlightName}
                        onChange={(e) => setHighlightName(e.target.value)}
                        placeholder='Monday sales'
                        className='shad-input'
                    />

                    {(!isHighlightingStory && error) && <p className='text-red ml-1 text-sm'>{error}</p>}
                </div>

                <Button
                    disabled={isHighlightingStory || !highlightName.trim()}
                    className='bg-primary-500 text-dark-1' onClick={highlight}>
                    {isHighlightingStory ? <Loader /> : "Highlight"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default HighlightStory