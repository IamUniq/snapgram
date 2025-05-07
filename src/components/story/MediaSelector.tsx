import type React from "react"

import { Button } from "@/components/ui/button"
import { Camera } from "lucide-react"
import { useRef, useState } from "react"
import StoryUploader from "../shared/StoryUploader"

interface MediaSelectorProps {
    onMediaSelect: (mediaUrl: string, media: File) => void
    setMediaType: React.Dispatch<React.SetStateAction<string>>
}

export default function MediaSelector({ onMediaSelect, setMediaType }: MediaSelectorProps) {
    const [isCapturing, setIsCapturing] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const startCamera = async () => {
        try {
            setIsCapturing(true)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })

            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch (err) {
            console.error("Error accessing camera:", err)
            setIsCapturing(false)
        }
    }

    const stopCamera = () => {
        setIsCapturing(false);

        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;

            stream.getTracks().forEach((track) => {
                track.stop();
            });

            videoRef.current.srcObject = null;
        }
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current


            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext("2d")
            ctx?.drawImage(video, 0, 0)

            const imageUrl = canvas.toDataURL("image/jpeg")
            onMediaSelect(imageUrl, {} as File)

            // Stop the camera stream
            const stream = video.srcObject as MediaStream
            stream?.getTracks().forEach((track) => track.stop())
        }
    }

    return (
        <div className="flex-center w-full p-4">
            <div className="flex-center h-full gap-5">
                { isCapturing ? (
                    <div className="relative w-full aspect-[12/16] bg-black rounded-lg overflow-hidden">
                        <video ref={ videoRef } autoPlay playsInline className="w-full h-full object-cover" />
                        <canvas ref={ canvasRef } className="hidden" />

                        <Button
                            onClick={ capturePhoto }
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full w-12 h-12 border-2 border-white hover:bg-light-2 z-50"
                        >
                            <span className="sr-only">Take photo</span>
                        </Button>
                    </div>
                ) : (
                    <>
                        <div
                            onClick={ startCamera }
                            className="flex-center flex-col bg-dark-3 rounded-xl p-4 cursor-pointer"
                        >
                            <div className="file_uploader-box">
                                <Camera size={ 58 } className="text-[#877eff]/40" />

                                Camera
                            </div>
                        </div>

                        <StoryUploader onMediaSelect={ onMediaSelect } setMediaType={ setMediaType } />
                    </>
                ) }
            </div>
        </div>
    )
}
