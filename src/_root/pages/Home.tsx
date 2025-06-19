import { HighlightStories } from "@/components/shared";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserContent from "@/components/shared/UserContent";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading
  } = useGetRecentPosts();

  const { user } = useUserContext()
  const { data: users, isPending: isFetchingUsers, isError: isFetchingFailed } = useGetUsers(2);

  return (
    <div className="flex min-h-screen w-full">
      <div className="home-container">
        <div className="mt-7 md:mt-0">
          <HighlightStories type="story" userId={user.id} />
        </div>

        <div className="home-posts pb-28 lg:pb-0">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          {!posts || posts?.length === 0 || isPostLoading ?
            (
              <Skeleton className="post-card h-64">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full bg-dark-4" />
                  <Skeleton className="w-32 h-4 rounded-full bg-dark-4" />
                </div>
              </Skeleton>
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

      <div className="home-creators px-6">
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
