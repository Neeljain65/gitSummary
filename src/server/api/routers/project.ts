import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { polling } from "~/lib/github";

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
    await polling(project.id);
    console.log("Project created and polling started:");
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
  

})
