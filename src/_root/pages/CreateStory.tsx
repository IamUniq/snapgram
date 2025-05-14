import MediaSelector from "@/components/story/MediaSelector"
import StoryHeader from "@/components/story/StoryHeader"
import TextEditorContainer from "@/components/story/TextEditorContainer"
import { useUserContext } from "@/context/AuthContext"
import { useStory } from "@/context/StoryContext"
import { useCreateStory } from "@/lib/react-query/queriesAndMutations"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function CreateStoryPage() {
    const { user } = useUserContext();
    const navigate = useNavigate()

    const { text } = useStory()

    const [isCreatingStory, setIsCreatingStory] = useState(false)
    const [selectedMedia, setSelectedMedia] = useState<{ url: string; media: File } | null>(null)
    const [mediaType, setMediaType] = useState<"text" | "video" | "image" | "">("")

    const { mutateAsync: createStory, isPending: isSavingStory } = useCreateStory()

    const handleMediaSelect = (mediaUrl: string, media: File) => {
        setSelectedMedia({ url: mediaUrl, media })
        setIsCreatingStory(true)
    }

    const handleTextSelect = () => {
        setMediaType('text');
        setIsCreatingStory(true)
    }

    const isVideo = mediaType.toLowerCase().includes("video")

    const handleClose = () => {
        if (window.confirm("Discard your story?")) {
            navigate(-1)
        }
    }

    const handlePost = async () => {
        const story = await createStory({
            userId: user.id,
            ...((selectedMedia && selectedMedia.media) ?
                { media: selectedMedia?.media }
                : {}
            ),
            ...(text.content !== ''
                ? { text: JSON.stringify(text) }
                : {}
            )
        })

        if (story) {
            toast.success("Story has been shared")
            navigate(-1)
        }
    }

    return (
        <div className="flex-center flex-1 h-[53vh] lg:h-[89vh] w-full">
            <div className="bg-black flex flex-col justify-between h-full w-full">
                <StoryHeader
                    onClose={ handleClose }
                    isPending={ isSavingStory }
                    onPost={ isCreatingStory ? handlePost : undefined }
                />

                <section className="flex-center w-full h-full">
                    { !isCreatingStory && (
                        <MediaSelector
                            setMediaType={ setMediaType } onMediaSelect={ handleMediaSelect }
                            onTextSelect={ handleTextSelect }
                        />
                    )
                    }

                    { (isCreatingStory && mediaType !== "") && (mediaType === 'text' ? (
                        <TextEditorContainer />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center w-full h-[60%] m-auto">
                            { isVideo ? (
                                <video src={ selectedMedia?.url! } autoPlay loop muted playsInline className="max-h-full max-w-full object-contain" />
                            ) : (
                                <img
                                    src={ selectedMedia?.url || "/placeholder.svg" }
                                    alt="Story media"
                                    className="max-h-full max-w-full object-contain"
                                />
                            ) }
                        </div>
                    )
                    ) }
                </section>
            </div>
        </div>
    )
}
