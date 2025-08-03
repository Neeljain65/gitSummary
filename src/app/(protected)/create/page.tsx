'use client'
import { on } from 'events';
import { FormInput } from 'lucide-react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/react';

type forminput ={
    projectName : string;
    repoUrl : string;
    gitHubToken? : string;
}

const page = () => {
    const { register, handleSubmit, reset } = useForm<forminput >();
    const createProject = api.project.createProject.useMutation()
    function onSubmit(data: forminput) {
        console.log(data);
        createProject.mutate({
            projectName: data.projectName,
            repoUrl: data.repoUrl,
            gitHubToken: data.gitHubToken,
        },{
            onSuccess: () => {
                reset();
                alert("Project created successfully!");
            }
        , onError: (error) => {
                console.error("Error creating project:", error);
                alert("Failed to create project. Please try again.");
            }
        } );
        // Here you can handle the form submission, e.g., send data to an API
    }
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
            <h1>Link you Github Repo</h1>
            <div className='flex flex-col items-center justify-center gap-4'>
                <form onSubmit={handleSubmit(onSubmit)}>
                   
                   <Input required {...register("projectName")} placeholder="Enter your Project Name" className='w-96' />
                   <Input required {...register("repoUrl")} placeholder="Enter your Github Repo URL" className='w-96' />
                   <Input {...register("gitHubToken")} placeholder="Enter your Github Token (optional)" className='w-96' />
                   <button disabled={createProject.isPending} type="submit" className='bg-blue-500 text-white px-4 py-2 mt-2 rounded'>Submit</button>
                </form>
            </div>
    </div>
  )
}

export default page
