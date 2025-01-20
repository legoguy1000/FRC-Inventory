import axios from 'axios';
import { config, API_ENPOINT } from './config';
import { Project } from '../../../server/src/interfaces';

const ProjectService = {
    getProjects: async () => {
        return (await axios.get(`${API_ENPOINT}/projects`, config)).data;
    },
    addProject: async (data: { name: string, owner: string | undefined }) => {
        return (await axios.post(`${API_ENPOINT}/projects`, data, config)).data;
    },
    editProject: async (projectId: string, data: { name: string, owner: string | undefined }) => {
        return (await axios.put(`${API_ENPOINT}/projects/${projectId}`, data, config)).data;
    }
};

export default ProjectService;
