import axios from 'axios';
import { axiosHttp, API_ENPOINT } from '../config';

const UserService = {
    getUsers: async () => {
        try {
            const response = await axiosHttp.get(`users`);
            return response.data;
        } catch (error: any) {
            console.log(error)
            return error.response;
        }
    },
    // addProject: async (data: { name: string, owner: string | undefined }) => {
    //     try {
    //         const response = await axiosHttp.post(`projects`, data);
    //         return response.data;
    //     } catch (error: any) {
    //         return error.response.data;
    //     }
    // },
    // editProject: async (projectId: string, data: { name: string, owner: string | undefined }) => {
    //     try {
    //         const response = await axiosHttp.put(`projects/${projectId}`, data);
    //         return response.data;
    //     } catch (error: any) {
    //         return error.response.data;
    //     }
    // },
    // deleteProject: async (projectId: string) => {
    //     try {
    //         const response = await axiosHttp.delete(`projects/${projectId}`);
    //         return response.data;
    //     } catch (error: any) {
    //         return error.response.data;
    //     }
    // }
};

export default UserService;
