import { cn, multiFormatDateString as formatDate } from "@/lib/utils";
import { ArrowLeftCircle, ArrowRightCircle, Repeat2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import StoryPlayerMenu from "./StoryPlayerMenu";

interface StoryPlayerProps {
    type: "story" | "highlight";
    medias: {
        storyId: string;
        mediaUrl: string;
        mediaId: string;
        type: "video" | "text" | "image";
        userId: string;
        textContent?: any;
        views?: string[];
        isHighlighted?: boolean;
        createdAt?: string;
        username?: string;
        userImage?: string;
    }[];
    userId: string;
    onView?: (storyId: string, views: string[]) => void
    initialIndex: number;
}

const DISPLAY_DURATION = 5000;

const StoryPlayer = ({ medias, type, userId, onView, initialIndex }: StoryPlayerProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);

    const current = medias[currentIndex]

    useEffect(() => {
        if (userId !== current.userId && current.views && !current.views.includes(userId)) {
            onView && onView(current.storyId, current.views);
        }

        if (current.type === 'video') {
            const video = videoRef.current;
            if (!video) return;

            const updateProgress = () => {
                if (video.duration) {
                    const percent = (video.currentTime / video.duration) * 100;
                    setProgress(percent);
                }
            };

            video.addEventListener("timeupdate", updateProgress);
            if (isPaused) {
                video.pause();
            } else {
                video.play();
            }
            return () => video.removeEventListener("timeupdate", updateProgress);
        } else {
            let timeout: NodeJS.Timeout;
            let interval: NodeJS.Timeout;

            if (!isPaused) {
                timeout = setTimeout(handleNext, DISPLAY_DURATION);

                const step = DISPLAY_DURATION / 100;
                let p = 0;
                interval = setInterval(() => {
                    p += 1;
                    setProgress(p);
                }, step);
            }

            return () => {
                clearTimeout(timeout);
                clearInterval(interval);
            };
        }
    }, [currentIndex]);

    useEffect(() => {
        if (current.type === 'video' && videoRef.current) {
            if (isPaused) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch((e) => console.warn("Playback error:", e));
            }
        }
    }, [isPaused, currentIndex]);


    const handlePrevious = () => {
        const hasPrevious = currentIndex > 0;

        if (hasPrevious) {
            setShowOverlay(false)
            setCurrentIndex((prev) => prev - 1);
            setProgress(0)
        }
    };

    const handleNext = () => {
        const hasNext = currentIndex < medias.length - 1;

        if (hasNext) {
            setCurrentIndex((prev) => prev + 1);
            setProgress(0)
        } else {
            setShowOverlay(true);
        }
    };

    const handleReplay = () => {
        setCurrentIndex(0);
        setProgress(0)
        setShowOverlay(false);
        videoRef.current?.play();
    };

    return (
        <div className="relative flex items-start justify-center w-full h-full mt-2 md:mt-10">
            {/* PROGRESS BARS */}
            <div className="absolute top-0 flex flex-col gap-3 w-full max-w-md mx-auto z-10">
                <div className="flex items-center gap-2 w-full">
                    {medias.map((_, index) => {
                        const isActive = index === currentIndex;
                        const isViewed = index < currentIndex;

                        return (
                            <div
                                key={index}
                                className="h-1 rounded flex-1 bg-white/20 overflow-hidden"
                            >
                                <div
                                    className="h-full bg-light-2 transition-all duration-300"
                                    style={{
                                        width: isViewed ? "100%" : isActive ? `${progress}%` : "0%",
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>

                {type === 'story' && (
                    <div className="flex items-center justify-between w-full px-3">
                        <div className="flex items-center gap-1">
                            <Link to={`/profile/${current.userId}`}>
                                <img
                                    src={current.userImage || "/assets/icons/profile-placeholder.svg"}
                                    className="w-9 h-9 rounded-full"
                                />
                            </Link>

                            <h3 className="text-base text-light-2">
                                {current.username}

                                <span className="mx-2">-</span>

                                <span className="text-xs">{formatDate(current.createdAt)}</span>
                            </h3>
                        </div>

                        <StoryPlayerMenu
                            {...current}
                            currentUser={userId}
                            isHighlighted={current.isHighlighted}
                            onMenuOpen={() => setIsPaused(true)}
                            onMenuClose={() => setIsPaused(false)}
                        />
                    </div>
                )}
            </div>

            {medias.length > 1 && (
                <>
                    <Button className="absolute left-0 sm:left-[6rem] md:left-0 lg:left-[10rem] xl:left-[16rem] top-1/2 -translate-y-1/2 w-16 h-16 z-20 shadow-none" asChild>
                        <ArrowLeftCircle onClick={handlePrevious} className={cn("cursor-pointer text-gray-50", {
                            "text-light-2/50": currentIndex === 0,
                        })} />
                    </Button>

                    <Button
                        disabled={currentIndex === medias.length - 1}
                        className="absolute right-0 sm:right-[6rem] md:right-0 lg:right-[10rem] xl:right-[16rem] top-1/2 -translate-y-1/2 w-16 h-16 z-20 shadow-none"
                        asChild
                    >
                        <ArrowRightCircle size={28} onClick={handleNext} className={cn("cursor-pointer text-gray-50", {
                            "text-light-2/50": currentIndex === medias.length - 1,
                        })} />
                    </Button>
                </>
            )}

            <div className="relative flex-center w-full h-full overflow-hidden bg-dark-4 max-w-md mx-auto">
                {current.type === "video" && (
                    <video
                        ref={videoRef}
                        src={current.mediaUrl}
                        controls={false}
                        autoPlay
                        onEnded={handleNext}
                        className="w-full object-cover mt-24"
                        playsInline
                    />
                )}

                {current.type === "image" && (
                    <img
                        src={current.mediaUrl}
                        className="w-full h-auto object-cover"
                        alt="Story"
                    />
                )}

                {current.type === "text" && (
                    <div
                        className="flex-center w-full h-full px-4 whitespace-pre-line border border-light-1/55"
                        style={{ ...current.textContent.style }}>
                        {current.textContent.content || "Hello There"}
                    </div>
                )}

                {showOverlay && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
                        <Button
                            onClick={handleReplay}
                            className="flex px-4 py-2 bg-white text-black hover:bg-gray-300 transition"
                        >
                            <Repeat2 /> Replay
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StoryPlayer