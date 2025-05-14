import { MoreVertical, Repeat2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { multiFormatDateString as formatDate } from "@/lib/utils";

interface StoryPlayerProps {
    medias: {
        id: string;
        url: string;
        textContent: any;
        type: "video" | "text" | "image";
        views: string[];
        createdAt: string;
        userId?: string;
        username: string;
        userImage?: string;
    }[];
    userId: string;
    onView: (storyId: string, views: string[]) => void
    initialIndex: number;
}

const DISPLAY_DURATION = 5000;

const StoryPlayer = ({ medias, userId, onView, initialIndex }: StoryPlayerProps) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const current = medias[currentIndex]

    useEffect(() => {
        if (userId !== current.userId && !current.views.includes(userId)) {
            onView(current.id, current.views);
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
            return () => video.removeEventListener("timeupdate", updateProgress);
        } else {
            timerRef.current = setTimeout(() => {
                handleNext();
            }, DISPLAY_DURATION);

            const step = DISPLAY_DURATION / 100;
            let p = 0;

            const progressInterval = setInterval(() => {
                p += 1;
                setProgress(p);
            }, step);

            return () => {
                clearTimeout(timerRef.current!);
                clearInterval(progressInterval);
            };
        }
    }, [currentIndex]);

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
            {/* PROGRESS BARS */ }
            <div className="absolute top-0 flex flex-col gap-3 w-full max-w-md mx-auto z-10">
                <div>
                    { medias.map((_, index) => {
                        const isActive = index === currentIndex;
                        const isViewed = index < currentIndex;

                        return (
                            <div key={ index } className="h-1 rounded flex-1 bg-white/20 overflow-hidden">
                                <div
                                    className="h-full bg-light-3 transition-all duration-300"
                                    style={ {
                                        width: isViewed ? "100%" : isActive ? `${progress}%` : "0%",
                                    } }
                                />
                            </div>
                        )
                    }) }
                </div>

                <div className="flex items-center justify-between w-full px-3">
                    <div className="flex items-center gap-1">
                        <Link to={ `/profile/${current.userId}` }>
                            <img
                                src={ current.userImage || "/assets/icons/profile-placeholder.svg" }
                                className="w-9 h-9 rounded-full"
                            />
                        </Link>

                        <h3 className="text-base text-light-2">
                            { current.username }

                            <span className="mx-2">-</span>

                            <span className="text-xs">{ formatDate(current.createdAt) }</span>
                        </h3>
                    </div>

                    <MoreVertical />
                </div>
            </div>

            <div className="relative flex-center w-full h-full overflow-hidden bg-dark-4 max-w-md mx-auto">
                { current.type === "video" && (
                    <video
                        ref={ videoRef }
                        src={ current.url }
                        controls={ false }
                        autoPlay
                        onEnded={ handleNext }
                        className="w-full object-cover"
                        playsInline
                    />
                ) }

                { current.type === "image" && (
                    <img
                        src={ current.url }
                        className="w-full h-auto object-cover"
                        alt="Story"
                    />
                ) }

                { current.type === "text" && (
                    <div className="flex-center w-full h-full px-4 whitespace-pre-line border border-light-1/55" style={ { ...current.textContent.style } }>
                        { current.textContent.content || "Hello There" }
                    </div>
                ) }

                { showOverlay && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
                        <Button
                            onClick={ handleReplay }
                            className="flex px-4 py-2 bg-white text-black hover:bg-gray-300 transition"
                        >
                            <Repeat2 /> Replay
                        </Button>
                    </div>
                ) }
            </div>
        </div>
    );
};

export default StoryPlayer