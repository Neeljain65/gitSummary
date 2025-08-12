'use client'
import { useUser } from "@clerk/nextjs";
import { Github } from "lucide-react";
import React from "react";
import useProjects from "~/hooks/use-projects";
import CommitLog from "./commit-log";
import AskQuestion from "./ask-question";
import MeetingCard from "./meeting-card";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Loader2, RefreshCw, ChevronDown } from "lucide-react";
const Dashboard = () => {
  const { user } = useUser();
  const { project, projectid } = useProjects();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { data: embeddingStatus, refetch: refetchEmbeddingStatus, isLoading: embeddingLoading } = api.project.getEmbeddingStatus.useQuery(
    { projectId: projectid || "" },
    { enabled: !!projectid }
  );
  const utils = api.useUtils();
  const refreshCommits = api.project.refreshCommits.useMutation({
    onSuccess: async () => {
      await utils.project.getCommits.invalidate({ projectId: projectid! });
    },
  });
  const generateEmbeddings = api.project.generateEmbeddings.useMutation({
    onSuccess: async () => {
      await refetchEmbeddingStatus();
    },
  });
  const commitsQuery = api.project.getCommits.useQuery({ projectId: projectid || "" }, { enabled: !!projectid });
  const commitsProcessing = refreshCommits.isPending;
  const embeddingsProcessing = generateEmbeddings.isPending;
  const embeddingsComplete = embeddingStatus?.isComplete;
  return (
    <div>
      <div className="flex items-center justify-between gap-y-4 flex-wrap">
        <div className="w-fit rounded-md bg-primary px-4 py-2 text-white">
          <div className="flex items-center">
<Github className="size-5 text-white" />
        <div className="ml-2"><p className="font-medium text-white">THis project is linked to {project?.githubUrl}</p></div>
          </div>
        
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs rounded-md border px-3 py-1 bg-white/5">
            {commitsQuery.isLoading || commitsProcessing ? (
              <span className="flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Commits processing…</span>
            ) : (
              <span>{commitsQuery.data?.length ?? 0} commits</span>
            )}
          </div>
          <div className="text-xs rounded-md border px-3 py-1 bg-white/5">
            {embeddingLoading ? (
              <span className="flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> Embeddings…</span>
            ) : embeddingsComplete ? (
              <span>Embeddings ready</span>
            ) : (
              <span>Waiting for embeddings</span>
            )}
          </div>
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              disabled={!projectid || commitsProcessing || embeddingsProcessing}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1"
            >
              {(commitsProcessing || embeddingLoading || embeddingsProcessing) ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <RefreshCw className="size-3" />
              )}
              Actions
              <ChevronDown className="size-3" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border bg-background p-1 shadow">
                <button
                  className="w-full rounded px-2 py-2 text-left text-sm hover:bg-accent"
                  disabled={!projectid || commitsProcessing}
                  onClick={() => {
                    setMenuOpen(false);
                    if (projectid) refreshCommits.mutate({ projectId: projectid });
                  }}
                >
                  {commitsProcessing ? 'Refreshing commits…' : 'Refresh commits'}
                </button>
                <button
                  className="w-full rounded px-2 py-2 text-left text-sm hover:bg-accent disabled:opacity-50"
                  disabled={!projectid || !project?.githubUrl || embeddingsProcessing}
                  onClick={() => {
                    setMenuOpen(false);
                    if (projectid && project?.githubUrl) {
                      generateEmbeddings.mutate({ projectId: projectid, repoUrl: project.githubUrl, gitHubToken: undefined });
                    }
                  }}
                >
                  {embeddingsProcessing ? 'Generating embeddings…' : 'Generate embeddings'}
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
       {/* Hide AskQuestion & MeetingCard until embeddings complete */}
        { (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {}<AskQuestion />
              <MeetingCard />
            </div>
          </div>
        )}
       
        <div className="flex items-center gap-x-2">
          <CommitLog />
          </div>
      
    </div>
  );
};

export default Dashboard;
