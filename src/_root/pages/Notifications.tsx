import { Loader, NotificationCard } from "@/components/shared"
import { useUserContext } from "@/context/AuthContext"
import { useGetNotifications, useUpdateNotifications } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"

const Notifications = () => {
    const { user } = useUserContext()

    const { data: notifications, isPending: isGettingNotifications } = useGetNotifications(user.id)

    const unReadNotifications = notifications?.filter((notification) => notification.read === false).map((notification) => notification.$id)

    const { mutate: markAllAsRead } = useUpdateNotifications(unReadNotifications || [])

    useEffect(() => {
        if (unReadNotifications && unReadNotifications.length > 0) {
            markAllAsRead()
        }
    }, [])

    return (
        <div className="notifications-container">
            <div className="flex-between w-full max-w-2xl">
                <div className="flex gap-2 w-full max-w-5xl">
                    <img
                        src="/assets/icons/notification.svg"
                        width={36}
                        height={36}
                        alt="edit"
                        className="invert-white"
                    />
                    <h2 className="h3-bold md:h2-bold text-left w-full">Notifications</h2>
                </div>

                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="small-medium md:base-medium text-light-2">All</p>
                    <img
                        src="/assets/icons/filter.svg"
                        width={20}
                        height={20}
                        alt="filter"
                    />
                </div>
            </div>

            {!notifications || isGettingNotifications ? (
                <Loader />
            ) : notifications.length < 1 ? (
                <p className="body-bold text-light-3 text-center">Nothing has happened yet</p>
            )
                : (
                    <ul className="w-full flex flex-col max-w-2xl gap-7 mt-8">
                        {notifications?.map((notification) => (
                            <NotificationCard
                                key={notification.$id}
                                notification={notification}
                                userId={user.id}
                            />
                        ))}
                    </ul>
                )}

        </div>
    )
}

export default Notifications