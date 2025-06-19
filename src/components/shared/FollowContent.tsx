import { useGetUserFollowers, useGetUserFollowings } from "@/lib/react-query/queriesAndMutations"
import { Link, useParams } from "react-router-dom"
import FollowButton from "./FollowButton"

const FollowContent = ({ loggedInUser, type }: { loggedInUser: string; type: 'follower' | 'following' }) => {
    const { id } = useParams()
    const data = []

    switch (type) {
        case 'follower':
            const { data: userFollowers } = useGetUserFollowers(id || "")

            if (!userFollowers) return;
            data.push(...userFollowers.documents)
            break;

        case 'following':
            const { data: userFollowings } = useGetUserFollowings(id || "")

            if (!userFollowings) return;
            data.push(...userFollowings.documents)
            break;

        default:
            break;
    }

    return (
        <div className="w-full px-2">
            {data.map((user) => (
                <div
                    key={user.$id}
                    className="w-full h-20 bg-dark-2 border-b border-dark-4 flex items-center justify-between"
                >
                    <Link to={`/profile/${user.$id}`} className="flex items-center gap-1">
                        <img
                            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                            width={100}
                            height={100}
                            className="w-10 h-10 rounded-full"
                        />

                        <p className="text-sm">{user.name}</p>
                    </Link>

                    <FollowButton
                        followerId={loggedInUser}
                        followingId={user.$id}
                    />
                </div>
            ))}
        </div>
    )
}

export default FollowContent