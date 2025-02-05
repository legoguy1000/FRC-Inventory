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
    addUser: async (data: { email: string }) => {
        try {
            const response = await axiosHttp.post(`users`, data);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    disableUser: async (userId: string) => {
        try {
            const response = await axiosHttp.post(`users/${userId}/disable`);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    enableUser: async (userId: string) => {
        try {
            const response = await axiosHttp.post(`users/${userId}/enable`);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    editUser: async (userId: string, data: { email: string }) => {
        try {
            const response = await axiosHttp.put(`users/${userId}`, data);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
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
