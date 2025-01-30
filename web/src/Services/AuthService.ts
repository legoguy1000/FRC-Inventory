import axios from 'axios';
import { axiosHttp, API_ENPOINT } from '../config';

interface AuthResponse {
    message: string;
    token: string;
    error: boolean;
}

const AuthService = {
    isLoggedIn: function () {
        return false;
    },
    loginWithGoogle: async (code: string): Promise<AuthResponse> => {
        try {
            const response = await axiosHttp.post(`auth/redirect/google`, { code: code });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },

};

export default AuthService;
