"use client";
import React from "react";
import { Card } from "~/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDropzone } from "react-dropzone";
import { Presentation, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";

const MeetingCard = () => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        setError("No file selected.");
        return;
      }

      const file = acceptedFiles[0];
      setError(null);

      // Validate file
      if (!file) {
        setError("No file selected.");
        return;
      }

      if (!file.type.startsWith("audio/")) {
        setError("Invalid file type. Please upload an audio file (MP3 or WAV).");
        return;
      }

      try {
        setIsUploading(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90)); // Increment up to 90%
        }, 500);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(interval); // Stop simulation
        setProgress(100); // Set to 100% on completion

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Upload failed");
        }

        const data = await response.json();
        if (data.secure_url) {
          console.log("Upload successful:", data.secure_url);
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Upload error:", error);
        setError(error instanceof Error ? error.message : "Upload failed");
        setProgress(0);
      } finally {
        setIsUploading(false);
      }
    },
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
    },
    multiple: false,
    maxSize: 50_000_000, // 50MB
  });

  return (
    <Card className="col-span-2 flex flex-col items-center justify-center p-10">
      {isUploading ? (
        <div>
          <CircularProgressbar
            value={progress}
            text={`${Math.round(progress)}%`}            
            styles={buildStyles({
              pathColor: "#4CAF50",
              textColor: "#4CAF50",
            })}
          />
          <p className="text-sm text-gray-500 text-center">
            Uploading meeting...
          </p>
        </div>
      ) : (
        <>
          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}
          <Presentation className="h-10 w-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Create a new meeting
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyse your meeting with dinosys <br /> Powered by AI
          </p>
          <div className="mt-6" {...getRootProps()}>
            <Button>
              <Upload className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default MeetingCard;