import {Octokit} from "octokit";
import axios from "axios";
import { db } from "~/server/db";
import { aiSummarizeCommits } from "./gemini";
export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

type Response={
    commitHashes: string;
    commitMessages: string;
    commitAuthor: string;
    commitAvatar: string;
    commitDate: string;
}
export const getCommitHashes = async (githubUrl: string):Promise<Response[]>  => {
    const [owner, repo] = githubUrl.split('/').slice(-2);
    if (!owner || !repo) {
        throw new Error("Invalid GitHub URL");
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo
    });
    const sortedCommits = data.sort((a:any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any;
    return sortedCommits.map((commit: any) => ({
        commitHashes: commit.sha,
        commitMessages: commit.commit.message,
        commitAuthor: commit.commit.author.name,
        commitAvatar: commit.author?.avatar_url || '',
       commitDate: commit.commit?.author.date??""
    }));
};

export const polling = async(projectId: string)=>{
    const {project,githubUrl}= await fetchProjectGithubUrl(projectId);
    if (!githubUrl) {
        throw new Error("Project does not have a GitHub URL");
    }
    // console.log("Polling started for project:step1", projectId, githubUrl);
    const commitHashes = await getCommitHashes(githubUrl);
    console.log("Polling started for project:step2", projectId, commitHashes);
    const unProcessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
    console.log("Unprocessed commits:", unProcessedCommits);
    if (!project) {
        throw new Error("Project not found");
    }
    const summariesRes = await Promise.allSettled(unProcessedCommits.map(async (commit) => {
        return summarizeCommits(githubUrl!, commit.commitHashes);
    }));
    const summaries = summariesRes.map((res, index) => {
        if (res.status === 'fulfilled') {
            return res.value as string;
        }
        return ""

    });
    // console.log(unProcessedCommits,"summaries");
    const commit = await db.commit.createMany({
        data: summaries.map((summary, index)=>({
            projectId: projectId,
            commitHash: unProcessedCommits[index]!.commitHashes,
            commitMessage: unProcessedCommits[index]!.commitMessages,
            commitauthorName: unProcessedCommits[index]!.commitAuthor,
            commitauthorAvatar: unProcessedCommits[index]!.commitAvatar,
            commitDate: unProcessedCommits[index]!.commitDate,
            summary,
        })),
        skipDuplicates: true,
    });
    return commit;
    // return unProcessedCommits;




};

async function summarizeCommits(githubUrl: string, commitHashes: string) {
    //get the diff and parse
    // console.log(`${githubUrl}/commit/${commitHashes}.diff`)
   const {data} = await axios.get(`${githubUrl}/commit/${commitHashes}.diff`,{
       headers: {
           'accept': 'application/vnd.github.v3.diff',
       },
   });
    return await aiSummarizeCommits(data);

}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId: projectId,
        },
    });
    const unProcessedCommits = commitHashes.filter((commit)=>!processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHashes));
    return unProcessedCommits;
};
const fetchProjectGithubUrl = async (projectId: string) => {
    const project = await db.project.findUnique({
        where: { id: projectId },
        select: { githubUrl: true },
    })
    return { project, githubUrl: project?.githubUrl };
};

