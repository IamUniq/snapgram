import { useUserContext } from "@/context/AuthContext"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"

type GridPostListProps = {
    posts: Models.Document[] | undefined
    showUser?: boolean
    showStats?: boolean
    showComments?: boolean
}
const GridPostList = ({ posts, showUser = true, showStats = true, showComments = false }: GridPostListProps) => {
    const { user } = useUserContext()

    return (
        <ul className="grid-container">
            {posts ? posts.map((post) => (
                <li key={post.$id} className="relative w-full sm:w-72 md:w-full h-80 lg:w-72 lg:h-7w-72">
                    <Link to={`/posts/${post.$id}`} className="grid-post_link">
                        <img src={post.imageUrls[0]} alt="post" className="w-full h-full object-cover" />
                    </Link>

                    <div className="grid-post_user">
                        {showUser && (
                            <div className="flex items-center justify-start gap-2 flex-1">
                                <img src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="creator" className="h-8 w-8 rounded-full" />
                                <p className="line-clamp-1">{post.creator.name}</p>
                            </div>
                        )}

                        {showStats && (
                            <PostStats
                                post={post}
                                userId={user.id}
                                showComments={showComments}
                            />
                        )}
                    </div>
                </li>
            )) : (
                <div className="flex-center">No posts available</div>
            )}
        </ul>
    )
}

export default GridPostList