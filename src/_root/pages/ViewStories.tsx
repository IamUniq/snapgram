import { Loader } from "@/components/shared"
import StoryPlayer from "@/components/story/StoryPlayer"
import { Button } from "@/components/ui/button"
import { useGetUserStories } from "@/lib/react-query/queriesAndMutations"
import { useNavigate, useParams } from "react-router-dom"

const ViewStories = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: stories, isPending: isGettingStories } = useGetUserStories(id || "")

    if (!stories || stories?.total === 0) {
        return (
            <div className="w-full h-[90vh] flex-center flex-col gap-4">
                <h1 className="text-xl font-semibold">User has not shared any story</h1>
                <Button
                    className="bg-primary-500 text-black"
                    onClick={ () => navigate(-1) }>
                    Go Back
                </Button>
            </div>)
    }

    const medias = stories.documents.map(story => {
        return {
            url: story.mediaUrl,
            type: story.type
        } as { url: string; type: "video" | 'text' | 'image' }
    })

    return (
        <div className="relative w-full flex-center h-[60vh] md:h-full">
            <div className="absolute top-7 left-6 flex items-center gap-1 text-sm cursor-pointer z-20" onClick={ () => navigate(-1) }>
                <img src="/assets/icons/back.svg" width={ 20 } height={ 20 } />
                <span>Go Back</span>
            </div>

            { isGettingStories ? (
                <div className="w-full h-full">
                    <Loader />
                </div>
            ) : (
                <StoryPlayer medias={ medias } />
            ) }
        </div>
    )
}

export default ViewStories