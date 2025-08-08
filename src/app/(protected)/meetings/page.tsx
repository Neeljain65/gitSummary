"use client";
import React from "react";
import useProjects from "~/hooks/use-projects";
import MeetingCard from "../dashboard/meeting-card";
import { api } from "~/trpc/react";
import Link from "next/link"; // Update to next/link for App Router
import { Badge } from "~/components/ui/badge";



const Meetings = () => {
  const { project } = useProjects();
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    project?.id
      ? { projectId: project.id }
      : (undefined as any),
    { enabled: !!project?.id, refetchInterval: 4000 }
  );

  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>
      <h1 className="text-xl font-semibold">Meetings</h1>
      {meetings && meetings.length === 0 && (
        <div className="text-gray-500 mt-2">No meetings found.</div>
      )}
      {isLoading && (
        <div className="text-gray-500 mt-2">Loading...</div>
      )}
      <ul className="divide-y divide-gray-200">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex items-center justify-between py-5 gap-x-6"
          >
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/meetings/${meeting.id}`} className="text-sm font-semibold">
                  {meeting.title}
                </Link>
                {meeting.status === "PROCESSING" && (
                  <Badge className="bg-yellow-500 text-white">
                    Processing...
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-gray-500 gap-x-2">
                <p className="whitespace-nowrap">
                    {meeting.createdAt.toLocaleDateString()}
                </p>
                <p className="truncate">
                    {meeting.Issue.length} issues
                </p>
              </div>
            </div>
            <div className="flex items-center flex-none gap-x-4">
                <Link href={`/meetings/${meeting.id}`} className="text-sm font-semibold">
                    View Meeting
                </Link>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Meetings;