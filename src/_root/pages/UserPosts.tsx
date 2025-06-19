import { useGetCurrentUser } from '@/lib/react-query/queriesAndMutations';
import { Loader, GridPostList } from "@/components/shared"

const UserPosts = () => {
    const { data: currentUser } = useGetCurrentUser()

    if (!currentUser) {
        return (
            <div className="w-full h-full flex-center">
                <Loader />
            </div>
        )
    }

    console.log(currentUser)

    return (
        <>
            {currentUser.posts.length === 0 && (
                <p className="text-light-4">No liked posts</p>
            )}

            <GridPostList posts={currentUser.posts} showStats={true} showUser={false} />
        </>
    )
}

export default UserPosts