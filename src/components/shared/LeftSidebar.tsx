import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignoutAccount } from "@/lib/react-query/queriesAndMutations";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Settings } from "lucide-react"

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user } = useUserContext();
  const { mutate: signOut, isSuccess } = useSignoutAccount();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <nav className="leftsidebar gap-16">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        <Link
          to={`/profile/${user.id}`}
          className="relative flex gap-3 items-center"
        >
          <div
            className={cn("hidden absolute -left-10 top-1/2 -translate-y-1/2 w-7 h-12 rounded-r-full", {
              "bg-primary-500 flex": pathname === `/profile/${user
                .id}`
            })}
          />
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-14 h-14 rounded-full"
          />

          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-4">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={cn("group leftsidebar-link", {
                  "bg-primary-500": isActive,
                })}
              >
                <NavLink
                  to={link.route}
                  className="relative flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    width={24}
                    height={24}
                    className={cn("group-hover:invert-white", {
                      "invert-white": isActive,
                    })}
                  />

                  {link.label === 'Notifications' && (
                    <span className="bg-primary-500 rounded-full h-3 w-3 absolute right-44 top-[25%] group-hover:invert-white" />
                  )}

                  {link.label}

                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          variant={"ghost"}
          className="shad-button_ghost"
          onClick={() => signOut()}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>

        <Link
          to={`/profile/${user.id}/settings`}
          className={cn("flex gap-4 items-center p-4 group leftsidebar-link", {
            "bg-primary-500": pathname === `/profile/${user.id}/settings`,
          })}
        >
          <Settings
            className={cn("text-primary-500 group-hover:invert-white", {
              "invert-white": pathname === `/profile/${user.id}/settings`,
            })}
          />
          Settings
        </Link>
      </div>
    </nav>
  );
};

export default LeftSidebar;
