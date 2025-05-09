import React, { useRef } from "react";

type FileUploaderProps = {
    onMediaSelect: (mediaUrl: string, media: File) => void;
    setMediaType: React.Dispatch<React.SetStateAction<string>>
};

const StoryUploader = ({ setMediaType, onMediaSelect }: FileUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setMediaType(file.type)
            onMediaSelect(url, file)
        }
    }

    return (
        <div
            className="flex-center flex-col bg-dark-3 rounded-xl p-1"
        >
            <input
                type="file"
                ref={ fileInputRef }
                onChange={ handleFileChange }
                accept="image/*,video/*"
                className="hidden"
            />
            <div onClick={ () => fileInputRef.current?.click() } className="file_uploader-box cursor-pointer">
                <img
                    src="/assets/icons/file-upload.svg"
                    width={ 96 }
                    height={ 77 }
                    alt="file-upload"
                />

                <p>
                    Upload From Device
                </p>
            </div>
        </div>
    );
};

export default StoryUploader;