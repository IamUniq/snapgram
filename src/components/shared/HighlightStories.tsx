import { useUserContext } from "@/context/AuthContext";
import { useGetUserFollowings } from "@/lib/react-query/queriesAndMutations";
import { Link } from "react-router-dom";

type CustomData = {
    id: string;
    imageUrl: string;
    username: string;
}[]

const HighlightStories = ({ type }: { type: 'highlight' | 'story' }) => {
    const { user: { id } } = useUserContext()
    const data: CustomData = []

    if (type === 'story') {
        const { data: userFollowings } = useGetUserFollowings(id || "")

        if (!userFollowings) return;

        const userWithStories = userFollowings.documents.filter((following) => following.stories && following.stories === 0)

        const followings = userWithStories.map(user => ({
            id: user.$id,
            imageUrl: user.imageUrl,
            username: user.username,
        }))

        data.push(...followings)
    }

    if (data.length === 0) return;

    return (
        <div className="flex gap-6">
            { data.map((user) => (
                <Link to={ `/profile/${id}/story` }
                    key={ user.id }
                    className="flex-center flex-col gap-2"
                >
                    <div className="w-16 h-16 outline outline-dark-4 rounded-full cursor-pointer overflow-hidden">
                        <img
                            src={ user.imageUrl || "/assets/icons/profile-placeholder.svg" }
                            className="w-full h-full object-cover rounded-full"
                        />

                    </div>
                    <p className="text-light-2 small-medium">{ user.username }</p>
                </Link>
            )) }
        </div>
    )
}

export default HighlightStories