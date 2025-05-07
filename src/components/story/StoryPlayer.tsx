import { Repeat2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";

interface StoryPlayerProps {
    medias: {
        url: string;
        type: "video" | "text" | "image";
    }[]
}

const DISPLAY_DURATION = 5000;

const StoryPlayer = ({ medias }: StoryPlayerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const current = medias[currentIndex]

    useEffect(() => {
        if (current.type !== 'video') return;

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
    }, [currentIndex]);

    useEffect(() => {
        if (current.type === "video") return;

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
        <div className="relative mt-48">
            {/* PROGRESS BARS */ }
            <div className="absolute top-10 flex-center gap-2 w-full">
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

            <div className="relative flex-center w-full h-[20rem] overflow-hidden bg-dark-4 max-w-md mx-auto">
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
                    <div className="p-6 text-center text-xl font-medium leading-relaxed">
                        { current.url }
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