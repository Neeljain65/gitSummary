'use client'
import { useUser } from "@clerk/nextjs";
import { Github } from "lucide-react";
import React from "react";
import useProjects from "~/hooks/use-projects";
import CommitLog from "./commit-log";
const Dashboard = () => {
  const { user } = useUser();
  const {project} = useProjects  ();
  return (
    <div>
      <div className="flex items-center justify-between gap-y-4 flex-wrap">
        <div className="w-fit rounded-md bg-primary px-4 py-2 text-white">
          <div className="flex items-center">
<Github className="size-5 text-white" />
        <div className="ml-2"><p className="font-medium text-white">THis project is linked to {project?.githubUrl}</p></div>
          </div>
        
        </div>
        <div className="flex items-center gap-x-2">
          <CommitLog />
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
