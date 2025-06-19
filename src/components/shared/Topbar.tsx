import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { LogIn } from "lucide-react";

const Topbar = () => {
  const navigate = useNavigate();
  const { mutate: signOut, isSuccess } = useSignoutAccount();
  const { user } = useUserContext();

  const isNotLoggedIn = user.id === ""

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          {!isNotLoggedIn ? (
            <>
              <Button
                variant={"ghost"}
                className="shad-button_ghost"
                onClick={() => signOut()}
              >
                <img src="/assets/icons/logout.svg" alt="logout" />
              </Button>

              <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                <img
                  src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex-center gap-1"
            >
              Log In<LogIn color="#877eff" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Topbar;