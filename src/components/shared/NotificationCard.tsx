import { notificationIcons } from "@/constants";
import { cn, multiFormatDateString as formatDate } from "@/lib/utils";
import { Models } from "appwrite";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ notification, userId }: { notification: Models.Document; userId: string }) => {
    const navigate = useNavigate();

    const notificationTexts = (
        { username, caption, type }:
            { username: string; caption: string; type: string; }
    ) => {
        const text: { [key: string]: string } = {
            like: "liked your post",
            comment: "commented on your post",
            follow: "followed you",
            // mention: "mentioned you in a comment",
            share: "shared your post",
            newPost: "has a new post",
            save: "saved your post"
        }

        return `${username} ${text[type]}${(type === 'like' || type === 'comment') && caption
            ? ` "${caption.split(" ").slice(0, 2).join(" ")}..."`
            : ""
            }`;

    }
    return (
        <div
            className='flex justify-between items-center w-full border-b border-dark-4 pb-4 cursor-pointer'
            onClick={() => {
                if (notification.type === 'follow') {
                    navigate(`/profile/${notification.user.$id}`);
                } else {
                    navigate(`/posts/${notification.post.$id}`);
                }
            }}
        >
            <div className='flex gap-4 lg:gap-8 items-center'>
                <div className="bg-dark-4 rounded-full p-2 w-8 h-8 flex-center">
                    <img
                        src={notificationIcons[notification.type]}
                        alt={notification.type}
                        width={20}
                        height={20}
                        className="object-contain object-center"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <img
                        src={notification.user.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        width={56}
                        height={56}
                        alt="user"
                        className="rounded-full"
                    />
                    <div className="flex flex-col">
                        <div className="text-light-1">
                            {notificationTexts({
                                username: notification.user.username,
                                caption: notification?.post?.caption || "",
                                type: notification.type
                            })}
                        </div>

                        <div className="text-light-4">{formatDate(notification.$createdAt)}</div>
                    </div>
                </div>
            </div>

            {notification.type !== 'follow' ? (
                <div className={cn("w-3 h-3 rounded-full", {
                    "bg-green-500": notification.read === false
                })}
                />
            ) : (
                <FollowButton followerId={userId} followingId={notification.user.$id} />
            )}

        </div>
    )
}

export default NotificationCard