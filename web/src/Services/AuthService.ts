import axios from 'axios';
import { config, API_ENPOINT } from './config';

const AuthService = {
    isLoggedIn: function () {
        return false;
    },
    loginWithGoogle: async (code: string) => {
        try {
            const response = await axios.post(`${API_ENPOINT}/auth/redirect/google`, { code: code }, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },

};

export default AuthService;
