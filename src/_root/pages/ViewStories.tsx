import { Loader } from "@/components/shared"
import StoryPlayer from "@/components/story/StoryPlayer"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserStories, useViewStory } from "@/lib/react-query/queriesAndMutations"
import { useNavigate, useParams } from "react-router-dom"

const ViewStories = () => {
    const { user } = useUserContext()
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: stories, isPending: isGettingStories } = useGetUserStories(id || "")
    const { mutate: viewStory } = useViewStory()

    if (!id) {
        return (
            <div className="w-full h-[90vh] flex-center flex-col gap-4">
                <h1 className="text-xl font-semibold">User Not Found</h1>
                <Button
                    className="bg-primary-500 text-black"
                    onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            </div>
        )
    }

    if (!stories || stories?.total === 0) {
        return (
            <div className="w-full h-[90vh] flex-center flex-col gap-4">
                <Loader />
            </div>)
    }


    const medias = stories.documents.map(story => {
        return {
            storyId: story.$id,
            mediaId: story.mediaId,
            mediaUrl: story.mediaUrl,
            textContent: JSON.parse(story.mediaText),
            type: story.mediaType,
            views: story.views,
            createdAt: story.$createdAt,
            userId: id,
            isHighlighted: story.highlight,
            username: story.user.username,
            userImage: story.user.imageUrl
        }
    })

    const initialIndex = medias.findIndex((media) => !media.views.includes(user.id));
    const startIndex = initialIndex === -1 ? 0 : initialIndex;


    const handleViewStory = (storyId: string, views: string[]) => {
        let newViews = [...views];

        const hasViewed = newViews.includes(user.id);

        if (hasViewed) {
            return;
        } else {
            newViews.push(user.id);
            viewStory({ storyId, viewsArray: newViews })
        }
    }

    return (
        <div className="relative w-full h-[74vh] md:h-[90vh]">
            {isGettingStories ? (
                <div className="w-full h-full">
                    <Loader />
                </div>
            ) : (
                <StoryPlayer
                    type="story"
                    medias={medias}
                    userId={user.id}
                    onView={handleViewStory}
                    initialIndex={startIndex}
                />
            )}
        </div>
    )
}

export default ViewStories