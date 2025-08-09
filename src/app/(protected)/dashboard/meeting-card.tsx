"use client";
import React from "react";
import { Card } from "~/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDropzone } from "react-dropzone";
import { Presentation, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import useProjects from "~/hooks/use-projects";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const MeetingCard = () => {
  const project = useProjects();
  const processMeeting = useMutation({
    mutationFn: async (data: { meetingUrl: string; projectId: string; meetingId: string }) => {
      const { meetingUrl, projectId, meetingId } = data;
      const response = await axios.post("/api/process-meeting", {
        meetingUrl,
        projectId,
        meetingId,
      });
      return response.data;
    },
  });

  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();
  const uploadMeeting = api.project.uploadMeeting.useMutation();

  const { getRootProps, getInputProps } = useDropzone({
  onDrop: async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      setError("No file selected.");
      return;
    }

    const file = acceptedFiles[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    if (!file.type.startsWith("audio/")) {
      setError("Invalid file type. Please upload an audio file (MP3 or WAV).");
      return;
    }

    if (file.name.length > 100) {
      setError("File name is too long. Maximum length is 100 characters.");
      return;
    }

    if (!project.projectid) {
      setError("No project selected. Please select a project first.");
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", project.projectid); // Add projectId to formData

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const data = await response.json();
      if (!data.secure_url) {
        throw new Error("Invalid response: secure_url is missing.");
      }
      if (!data.meetingId) {
        throw new Error("Invalid response: meetingId is missing.");
      }

      setProgress(100);

      uploadMeeting.mutate(
        {
          projectId: project.projectid,
          title: file.name,
          meetingUrl: data.secure_url,
        },
        {
          onSuccess: (meeting) => {
            toast.success("Meeting uploaded successfully");
            router.push("/meetings");
            processMeeting.mutate({
              meetingUrl: data.secure_url,
              projectId: project.projectid,
              meetingId: meeting.id,
            });
          },
          onError: (error) => {
            console.error("Error uploading meeting:", error);
            toast.error("Failed to save meeting. Please try again.");
          },
        }
      );
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
  maxSize: 50_000_000,
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
          <p className="text-sm text-gray-500 text-center">Uploading meeting...</p>
        </div>
      ) : (
        <>
          {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}
          <Presentation className="h-10 w-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Create a new meeting</h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyse your meeting with dinosys <br /> Powered by AI
          </p>
          <div className="mt-6" {...getRootProps()}>
            <Button disabled={!project.projectid}>
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