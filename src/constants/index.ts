import { ArrowDownToLine, CircleFadingPlus, Link, Share2 } from "lucide-react";

export const sidebarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/reels",
    label: "Reels",
  },
  {
    imgURL: "/assets/icons/people.svg",
    route: "/all-users",
    label: "People",
  },
  {
    imgURL: "/assets/icons/notification.svg",
    route: "/notifications",
    label: "Notifications",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create Post",
  },
];

export const bottombarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create",
  },
];

export const shareOptions = [
  {
    label: "Copy link",
    icon: Link,
  },
  {
    label: "Share",
    icon: Share2,
  },
  {
    label: "Add To Story",
    icon: CircleFadingPlus,
  },
  {
    label: "Download",
    icon: ArrowDownToLine,
  },
];

export const notificationIcons:{[key: string]: string} = {
  like: "/assets/icons/like.svg",
  comment: "/assets/icons/chat.svg",
  follow: "/assets/icons/follow.svg",
  share: "/assets/icons/share.svg",
  newPost: "/assets/icons/gallery-add.svg",
  save: "/assets/icons/save.svg",
}