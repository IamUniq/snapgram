import { useGetUserFollowings, useGetUserHighlights } from "@/lib/react-query/queriesAndMutations";
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

    switch (type) {
        case 'story':
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

    if (data.length === 0) return;

    return (
        <div className="flex items-start justify-start gap-6">
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
        </div>
    )
}

export default HighlightStories