import axios from 'axios';
import { axios_config, API_ENPOINT } from '../config';

const UserService = {
    getUsers: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/users`, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    // addProject: async (data: { name: string, owner: string | undefined }) => {
    //     try {
    //         const response = await axios.post(`${API_ENPOINT}/projects`, data, axios_config);
    //         return response.data;
    //     } catch (error: any) {
    //         return error.response.data;
    //     }
    // },
    // editProject: async (projectId: string, data: { name: string, owner: string | undefined }) => {
    //     try {
    //         const response = await axios.put(`${API_ENPOINT}/projects/${projectId}`, data, axios_config);
    //         return response.data;
    //     } catch (error: any) {
    //         return error.response.data;
    //     }
    // },
    // deleteProject: async (projectId: string) => {
    //     try {
    //         const response = await axios.delete(`${API_ENPOINT}/projects/${projectId}`, axios_config);
    //         return response.data;
    //     } catch (error: any) {
    //         return error.response.data;
    //     }
    // }
};

export default UserService;
