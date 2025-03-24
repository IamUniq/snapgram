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
            "image/*": [".png", ".jpeg", ".jpg"],
        },
    });

    return (
        <div
            {...getRootProps()}
            className="flex-center max-w-[16rem] gap-4 cursor-pointer"
        >
            <input
                {...getInputProps()}
                className="cursor-pointer"
            />
            <div className="h-32 w-32 rounded-full flex-center bg-dark-4">
                <img
                    src={fileUrl || "/assets/icons/file-upload.svg"}
                    alt="profile photo"
                    width={100}
                    height={100}
                    className="w-full h-full rounded-full object-scale-down object-center"
                />
            </div>

            <Button type="button" variant="outline">
                {fileUrl ? "Change" : "Upload"}
            </Button>
        </div>
    );
};

export default ProfileUploader;
