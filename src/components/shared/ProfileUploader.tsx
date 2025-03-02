import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type ProfileUploaderProps = {
    fieldChange: (file: File[]) => void;
    mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState(mediaUrl);

    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles);
            fieldChange(acceptedFiles);
            setFileUrl(URL.createObjectURL(acceptedFiles[0]));
        },
        [file]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg", ".svg"],
        },
    });

    return (
        <div
            {...getRootProps()}
            className="flex-center max-w-[17rem] cursor-pointer"
        >
            <input
                {...getInputProps()}
                className="cursor-pointer"
            />
            <img
                src={fileUrl || "assets/icons/file-upload.svg"}
                alt="profile photo"
                width={90}
                height={90}
                className="rounded-full object-center"
            />

            <div className="text-blue-400 ms-2">
                {fileUrl ? "Change profile photo" : "Upload profile photo"}
            </div>

        </div>
    );
};

export default ProfileUploader;
