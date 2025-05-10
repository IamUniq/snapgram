import { Button } from "@/components/ui/button";
import { useFollowUser, useIsFollowingUser, useUnFollowUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type FollowButtonProps = {
    followerId: string;
    followingId: string;
    className?: string;
}
const FollowButton = ({ followerId, followingId, className }: FollowButtonProps) => {
    const [isCurrentlyFollowing, setIsCurrentlyFollowing] = useState(false)

    const { data: isFollowingUser } = useIsFollowingUser({ followerId, followingId })

    useEffect(() => {
        if (isFollowingUser !== undefined) {
            setIsCurrentlyFollowing(isFollowingUser.isFollowing);
        }
    }, [isFollowingUser])

    const { mutateAsync: followUser, isPending: isFollowingPending } = useFollowUser({ followingId, followerId: followerId })
    const { mutateAsync: unFollowUser, isPending: isUnFollowingUser } = useUnFollowUser({ followingId, followerId: followerId })

    const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()

        if (!isCurrentlyFollowing) {
            const follow = await followUser()

            if (follow?.success !== undefined) {
                setIsCurrentlyFollowing(true)
            }
        } else {
            const unFollow = await unFollowUser()

            if (unFollow?.success === true) {
                setIsCurrentlyFollowing(false)
            }
        }
    }

    return (
        <Button
            variant="ghost"
            className={ cn("bg-primary-500", className) }
            onClick={ handleFollow }
        >
            {
                (isFollowingPending || isUnFollowingUser)
                    ? <Loader />
                    : isCurrentlyFollowing
                        ? "Unfollow"
                        : "Follow"
            }
        </Button>
    )
}

export default FollowButton