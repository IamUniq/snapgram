import HighlightStories from "@/components/shared/HighlightStories";
import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import UserContent from "@/components/shared/UserContent";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

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

          {isPostLoading || !posts ? (
            <Loader />
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
            ? <p className="text-light-4">Failed to fetch users</p>
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
