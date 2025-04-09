import HighlightStories from "@/components/shared/HighlightStories";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserContent from "@/components/shared/UserContent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading
  } = useGetRecentPosts();


  const { user } = useUserContext()
  const { data: users, isPending: isFetchingUsers, isError: isFetchingFailed } = useGetUsers(10);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <HighlightStories />
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          {posts?.length === 0 ?
            (
              <div className="flex-center flex-col gap-4">
                <h2 className="text-lg text-center">What's a social media platform without any pictures.</h2>
                <Button asChild className="bg-primary-500">
                  <Link to='/create-post'>Be the first to shine</Link>
                </Button>
              </div>
            ) : (isPostLoading || !posts) ? (
              <Skeleton className="post-card h-64" />
            ) : (
              <ul className="flex flex-col flex-1 gap-9 w-full">
                {posts.map((post: Models.Document, index: number) => (
                  <PostCard
                    key={`post${index}-${post.$id}`}
                    post={post}
                  />
                ))}
              </ul>
            )}
        </div>
      </div>

      <div className="home-creators">
        <h2 className="h3-bold md:h2-bold text-left w-full">Top Creators</h2>

        {isFetchingUsers
          ? <Loader />
          : isFetchingFailed
            ? <p className="text-light-4">Network Error</p>
            : (
              <UserContent
                loggedInUser={user.id}
                data={users?.documents!}
                className="justify-center"
              />
            )}

      </div>
    </div>
  );
};

export default Home;
