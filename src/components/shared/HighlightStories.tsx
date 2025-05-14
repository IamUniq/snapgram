import { useUserContext } from "@/context/AuthContext";
import { useGetUserFollowings } from "@/lib/react-query/queriesAndMutations";
import { Link } from "react-router-dom";

type CustomData = {
    id: string;
    imageUrl: string;
    username?: string;
    highlight?: string;
}[]

const HighlightStories = ({ type }: { type: 'highlight' | 'story' }) => {
    const { user: { id } } = useUserContext()
    const data: CustomData = []

    if (type === 'story') {
        const { data: userFollowings } = useGetUserFollowings(id || "")

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
    }

    if (data.length === 0) return;

    return (
        <div className="flex items-start justify-start gap-6">
            { data.map((user) => (
                <Link to={ `/profile/${user.id}/story` }
                    key={ user.id }
                    className="flex-center flex-col gap-2"
                >
                    <div className="w-16 h-16 outline outline-dark-4 rounded-full cursor-pointer overflow-hidden">
                        <img
                            src={ user.imageUrl || "/assets/icons/profile-placeholder.svg" }
                            className="w-full h-full object-cover rounded-full border-2 border-primary-500"
                        />

                    </div>
                    <p className="text-light-2 small-medium">
                        { user.username || user.highlight }
                    </p>
                </Link>
            )) }
        </div>
    )
}

export default HighlightStories