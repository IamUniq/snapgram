import { Loader } from "@/components/shared"
import StoryPlayer from "@/components/story/StoryPlayer"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserHighlightsByTitle } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"

const ViewHighlights = () => {
    const { user } = useUserContext()
    const { id, title } = useParams()

    const { data, isLoading: isGettingHighlights } = useGetUserHighlightsByTitle(id || "", title || "")

    if (!id || !title || !data || data.length === 0) {
        return (
            <div className="w-full h-[90vh] flex-center flex-col gap-4">
                <Loader />
            </div>
        )
    }

    const highlights = data.map(item => ({
        storyId: item.$id,
        userId: id,
        mediaId: item.mediaId,
        type: item.mediaType,
        mediaUrl: item.mediaUrl
    }))

    return (
        <div className="relative w-full h-[74vh] md:h-[90vh]">
            {isGettingHighlights ? (
                <div className="w-full h-full">
                    <Loader />
                </div>
            ) : (
                <StoryPlayer
                    type="highlight"
                    medias={highlights}
                    userId={user.id}
                    initialIndex={0}
                />
            )}
        </div>
    )
}

export default ViewHighlights