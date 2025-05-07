import { useState } from "react"
import StoryEditor from "@/components/story/StoryEditor"
import MediaSelector from "@/components/story/MediaSelector"
import { StoryProvider } from "@/context/StoryContext"
import { useNavigate } from "react-router-dom"
import StoryHeader from "@/components/story/StoryHeader"
import { useCreateStory } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "sonner"

export default function CreateStoryPage() {
    const { user } = useUserContext();
    const navigate = useNavigate()
    const [isCreatingStory, setIsCreatingStory] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState<{ url: string; media: File } | null>(null)
    const [mediaType, setMediaType] = useState("")

    const { mutateAsync: createStory, isPending: isSavingStory } = useCreateStory()

    const handleMediaSelect = (mediaUrl: string, media: File) => {
        setSelectedMedia({ url: mediaUrl, media })
        setIsCreatingStory(true)
    }

    const handleClose = () => {
        if (window.confirm("Discard your story?")) {
            navigate(-1)
        }
    }

    const handlePost = async () => {
        console.log("Posting story...", selectedMedia)
        const story = await createStory({ userId: user.id, media: selectedMedia?.media! })

        if (story) {
            toast.success("SUCCESS")
            navigate(-1)
        }
    }

    return (
        <div className="flex w-full">
            <StoryProvider>
                <div className="bg-black flex flex-col justify-between h-full w-full">
                    <StoryHeader
                        onClose={ handleClose }
                        isPending={ isSavingStory }
                        onPost={ isCreatingStory ? handlePost : undefined }
                    />

                    <main className="flex-center w-full h-full">
                        { !isCreatingStory ? (
                            <MediaSelector setMediaType={ setMediaType } onMediaSelect={ handleMediaSelect } />
                        ) : (
                            <StoryEditor mediaType={ mediaType } mediaUrl={ selectedMedia?.url! } />
                        ) }
                    </main>
                </div>
            </StoryProvider>
        </div>
    )
}
