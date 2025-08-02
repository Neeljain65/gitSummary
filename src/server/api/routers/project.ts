import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure.input(
    z.object({
      repoUrl: z.string(),
      projectName: z.string(),
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

})
