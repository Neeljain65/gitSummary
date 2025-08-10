import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { polling } from "~/lib/github";
import { indexGithubRepo } from "~/lib/github-loader";
import { MeetingStatus } from "@prisma/client";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(
    z.object({
      projectName: z.string(),
      repoUrl: z.string(),
      gitHubToken: z.string().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    const project = await ctx.db.project.create({
      data: {
        githubUrl: input.repoUrl,
        name: input.projectName,
        
        userToProject:{
          create:{
            userId: ctx.user.userId!,
          }
        }
        
      },
    });
    
    // Process embeddings in the background - don't await
    indexGithubRepo(project.id, input.repoUrl, input.gitHubToken)
      .then(() => {
        console.log(`Embeddings completed for project ${project.id}`);
        return polling(project.id);
      })
      .catch((error: any) => {
        console.error(`Error processing embeddings for project ${project.id}:`, error);
      });
    
    console.log("Project created, embedding processing started in background");
    return project;
  }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        userToProject: {
          some: {
            userId: ctx.user.userId!,
          },
        },
      },  
     
    });
    
 
  }),
  getCommits : protectedProcedure.input(
    z.object({
      projectId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    polling(input.projectId).then().catch(console.error);
    const commits = await ctx.db.commit.findMany({
      where: {
        projectId: input.projectId,
      },
      orderBy: {
        commitDate: 'desc',
      },
    });
    return commits;
  }),
  
  getEmbeddingStatus: protectedProcedure.input(
    z.object({
      projectId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const totalEmbeddings = await ctx.db.sourceCodeEmbedding.count({
      where: {
        projectId: input.projectId,
      },
    });
    
    // For simplicity, if embeddings exist in the table, they're considered processed
    // In a production app, you might want to add a status field to track processing state
    return {
      total: totalEmbeddings,
      processed: totalEmbeddings,
      isComplete: totalEmbeddings > 0,
      progress: totalEmbeddings > 0 ? 100 : 0,
    };
  }),
  saveAnswer: protectedProcedure.input(
    z.object({
      projectId: z.string(),
      question: z.string(),
      fileReferences: z.any(),
      answer: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const question = await ctx.db.question.create({
      data: {
        question: input.question,
        answer: input.answer,
        userId: ctx.user.userId!,
        projectId: input.projectId,
        fileReferences: input.fileReferences,
      },
    });
    return question;
  }),
  uploadMeeting: protectedProcedure.input(
    z.object({
      projectId: z.string(),
      title: z.string(),
      meetingUrl: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const meeting = await ctx.db.meeting.create({
      data: {
        meetingUrl: input.meetingUrl,
        projectId: input.projectId ,
        title: input.title,
        status: MeetingStatus.PROCESSING,
      },
    });
    return meeting;
  }),
  getMeetings: protectedProcedure.input(
    z.object({
      projectId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const meetings = await ctx.db.meeting.findMany({
      where: {
        projectId: input.projectId,
      },
      include: {
        Issue: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return meetings;
  }),
  getMeetingById: protectedProcedure.input(
    z.object({
      meetingId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const meeting = await ctx.db.meeting.findUnique({
      where: {
        id: input.meetingId,
      },
      include: {
        Issue: true,
      },
    });
    return meeting;
  }),
  getQuestions : protectedProcedure.input(
    z.object({
      projectId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const questions = await ctx.db.question.findMany({
      where: {
        projectId: input.projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
    return questions;
  })
});


