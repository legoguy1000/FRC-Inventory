import axios from 'axios';
import { config, API_ENPOINT } from './config';

const ProjectService = {
    getProjects: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/projects`, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    addProject: async (data: { name: string, owner: string | undefined }) => {
        try {
            const response = await axios.post(`${API_ENPOINT}/projects`, data, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    editProject: async (projectId: string, data: { name: string, owner: string | undefined }) => {
        try {
            const response = await axios.put(`${API_ENPOINT}/projects/${projectId}`, data, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    deleteProject: async (projectId: string) => {
        try {
            const response = await axios.delete(`${API_ENPOINT}/projects/${projectId}`, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
};

export default ProjectService;
