import { Loader } from "@/components/shared";
import UserContent from "@/components/shared/UserContent";
import { useUserContext } from "@/context/AuthContext";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { data: users, isPending: isFetchingUsers } = useGetUsers();
  const { user } = useUserContext()

  if (!users || !user) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }

  const allUsers = users.documents.filter(doc => doc.$id !== user.id)

  return (
    <div className="user-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/people.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
      </div>

      {isFetchingUsers
        ? <Loader />
        : (
          <UserContent data={allUsers} loggedInUser={user.id} />
        )}
    </div>
  );
};

export default AllUsers;
