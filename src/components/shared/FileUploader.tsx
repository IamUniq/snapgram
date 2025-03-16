import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Trash } from "lucide-react";

type FileUploaderProps = {
  fieldChange: (file: File[]) => void;
  mediaUrls: string[];
};

const FileUploader = ({ fieldChange, mediaUrls }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>(mediaUrls);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      const newFileUrls = [...fileUrls, ...acceptedFiles.map(file => URL.createObjectURL(file))]

      setFileUrls(newFileUrls);

      fieldChange(newFiles);
    },
    [files, fileUrls]
  );

  const removeFile = (index: number) => {
    const newFileUrls = [...fileUrls]
    const newFiles = [...files]

    if (index >= 0 && index < newFileUrls.length) {
      // Revoke the object URL to prevent memory leaks
      if (!mediaUrls.includes(newFileUrls[index])) {
        URL.revokeObjectURL(newFileUrls[index])
      }
      newFileUrls.splice(index, 1)
      setFileUrls(newFileUrls)
    }

    if (index < newFiles.length) {
      newFiles.splice(index, 1)
      setFiles(newFiles)
    }

    // Update the parent component
    fieldChange(newFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
  });

  return (
    <div
      className="flex-center flex-col bg-dark-3 rounded-xl"
    >
      {/* Image Preview Grid */}
      {fileUrls.length > 0 && (
        <PreviewImages fileUrls={fileUrls} removeFile={removeFile} />
      )}

      {/* DropZone Area*/}
      <div
        {...getRootProps()}
        className="flex-center flex-col cursor-pointer"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        <div className="file_uploader-box">
          {fileUrls.length === 0 && (
            <img
              src="/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt="file-upload"
            />
          )}
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            {fileUrls.length > 0 ? "Add more photos" : "Drag and Drop photo here"}
          </h3>
          <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

          {fileUrls.length === 0 && (
            <Button type="button" className="shad-button_dark_4">
              Select from computer
            </Button>
          )}
        </div>
      </div>

      {fileUrls.length > 0 && (
        <p className="text-center text-light-4 small-regular">
          {fileUrls.length} {fileUrls.length === 1 ? "image" : "images"} selected
        </p>
      )}
    </div>
  );
};

export default FileUploader;

const PreviewImages = (
  { fileUrls, removeFile }:
    { fileUrls: string[], removeFile: (index: number) => void }) => {
  return (
    <div className="mx-auto max-w-xs">
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {fileUrls.map((url, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="relative group flex-center h-60 lg:h-[280px] p-6">
                  <img
                    src={url}
                    className="file_uploader-img"
                  />

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute right-[42%] top-1/2 -translate-x-[42%] -translate-y-1/2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <Trash size={16} className="text-rose-500" />
                  </button>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {fileUrls.length > 1 && (
          <>
            <CarouselPrevious className="text-primary-500" />
            <CarouselNext className="text-primary-500" />
          </>
        )}
      </Carousel>
    </div>
  )
}