import React from 'react';
import { api } from '~/trpc/react';
import { useLocalStorage } from 'usehooks-ts';

const useProjects = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  const [projectid, setProjectId] = useLocalStorage('projectId', ''); // Change null to ''
  const project = projects?.find((project) => project.id === projectid) || { name: '', id: '', createdAt: new Date(), updatedAt: new Date(), githubUrl: null, deletedAt: null }; // Default if not found
  return { projects, project, projectid, setProjectId };
};

export default useProjects;