import { useGetUserFollowings, useGetUserHighlights, useGetUserStories } from "@/lib/react-query/queriesAndMutations";
import { Plus, User2 } from "lucide-react";
import { Link } from "react-router-dom";

interface HighlightStoriesProps {
    type: 'highlight' | 'story';
    userId: string
}

type CustomData = {
    id: string;
    imageUrl: string;
    username?: string;
    highlight?: string;
}[]

const HighlightStories = ({ type, userId }: HighlightStoriesProps) => {
    const data: CustomData = []
    let userHasStory = false

    switch (type) {
        case 'story':
            const { data: userStories } = useGetUserStories(userId)
            const { data: userFollowings } = useGetUserFollowings(userId || "")
            if (!userFollowings) return;

            const userWithStories = userFollowings.documents.filter(
                (following) => typeof following.stories === 'number' && following.stories >= 1
            );

            const followings = userWithStories.map(user => ({
                id: user.$id,
                imageUrl: user.imageUrl,
                username: user.username,
            }))

            data.push(...followings)
            if (userStories && userStories.total > 0) {
                userHasStory = true
            }
            break;

        case 'highlight':
            const { data: userHighlights } = useGetUserHighlights(userId)
            if (!userHighlights) return;

            const highlights = userHighlights.documents.map(highlight => ({
                id: highlight.$id,
                imageUrl: "",
                highlight: highlight.title,
            }))

            data.push(...highlights)
            break;

        default:
            break;
    }

    return (
        <div className="flex-start gap-6 md:gap-10">
            {type === 'story' && userHasStory && (
                <Link
                    to={`/profile/${userId}/story`}
                    className="relative cursor-pointer overflow-hidden flex flex-col gap-2 items-center"
                >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 via-yellow-200 to-violet-500"></div>

                    <p className="text-light-2 small-medium">
                        Your story
                    </p>
                </Link>
            )}

            {data.map((item) => (
                <Link to={type === 'story'
                    ? `/profile/${userId}/story`
                    : `/profile/${userId}/highlights/${item.highlight?.replace(/\s+/g, '-').toLowerCase()}`
                }
                    key={item.id}
                    className="flex-center flex-col gap-2"
                >
                    <div className="w-16 h-16 outline outline-dark-4 rounded-full cursor-pointer overflow-hidden">
                        {type === 'highlight' ? (
                            <div className="flex-center w-full h-full">{item.highlight?.charAt(0)}</div>
                        ) : (
                            <img
                                src={item.imageUrl || "/assets/icons/profile-placeholder.svg"}
                                className="w-full h-full object-cover rounded-full"
                            />
                        )}


                    </div>
                    <p className="text-light-2 small-medium">
                        {item.username || item.highlight}
                    </p>
                </Link>
            ))}

            {type === 'story' && (
                <Link to="/create-story"
                    className="relative cursor-pointer overflow-hidden flex flex-col gap-2 items-center"
                >
                    <User2 className="w-16 h-16 border-2 border-gray-700 rounded-full p-2" />
                    <div className="bg-black absolute bottom-6 right-1">
                        <Plus className="w-6 h-6 border-2 border-gray-700 rounded-full" />
                    </div>
                    <p className="text-light-2 small-medium">
                        Add story
                    </p>
                </Link>
            )}
        </div>
    )
}

export default HighlightStories