import { notificationIcons } from "@/constants";
import { cn, multiFormatDateString as formatDate } from "@/lib/utils";
import { Models } from "appwrite";

const NotificationCard = ({ notification, index }: { notification: Models.Document, index: number }) => {
    // console.log(notification);

    return (
        <div className='flex justify-between items-center w-full border-b border-dark-4 pb-4'>
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
                            <span className="capitalize">{notification.user.username}</span>{" "}

                            {notification.type}d your post{" "}
                            <span className="">
                                "{notification.post.caption.split(" ").slice(0, 2).join(" ")}..."
                            </span>
                        </div>

                        <div className="text-light-4">{formatDate(notification.$createdAt)}</div>
                    </div>
                </div>
            </div>

            <div className={cn("w-5 h-5 rounded-full", index % 2 === 0 ? "bg-red" : "bg-green-500")} />
        </div>
    )
}

export default NotificationCard