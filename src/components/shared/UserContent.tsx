import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import FollowButton from "./FollowButton"

const UserContent = ({ data, loggedInUser, className }: { data: any[], loggedInUser: string, className?: string }) => {

    return (
        <div className={cn("user-grid", className)}>
            {data.map((user) => (
                <div
                    key={user.$id}
                    className="w-48 h-48 2xl:w-40 2xl:h-40 bg-dark-2 rounded-3xl border border-dark-4 p-5 flex-center flex-col"
                >
                    <img
                        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        width={100}
                        height={100}
                        className="w-14 h-14 rounded-full"
                    />

                    <Link to={`/profile/${user.$id}`}>{user.name}</Link>
                    {/* <p className="text-xs font-medium text-light-4">Followed By JsMastery</p> */}

                    {loggedInUser !== user.$id && (
                        <div className="mt-4 z-20">
                            <FollowButton
                                followerId={loggedInUser}
                                followingId={user.$id}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default UserContent