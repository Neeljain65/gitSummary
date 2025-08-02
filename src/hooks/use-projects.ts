import React from 'react'
import { api } from '~/trpc/react'
import {useLocalStorage} from 'usehooks-ts'
const useProjects = () => {
 const {data: projects}= api.project.getProjects.useQuery();
  const [projectid, setProjectId] = useLocalStorage('projectId', null);
  const project = projects?.find((project) => project.id === projectid);
 return{
  projects, 
  project,
  projectid,
  setProjectId,
 }
}

export default useProjects