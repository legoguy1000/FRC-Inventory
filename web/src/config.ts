import axios from "axios";
import { useSession } from "./components/SessionContext";
declare const window: any;

export const API_ENPOINT = window.BASE_URL;
export const GOOGLE_OAUTH_ENABLED = window.GOOGLE_OAUTH_ENABLED;
export const WEBSITE_TITLE = window.WEBSITE_TITLE;

export const axiosHttp = axios.create({
    baseURL: `${API_ENPOINT}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosHttp.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosHttp.interceptors.response.use(
    (response) => {
        //const url = response.config.url;

        //setLocalStorageToken(token);
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            //(`unauthorized :)`);
            localStorage.removeItem("token");
            //removeLocalStorageToken
            //window.location.href = "/login";
        }
        // else if (error.response.status === 403) {
        //     //(`unauthorized :)`);
        //     localStorage.removeItem("token");
        //     setToken("");
        //     //removeLocalStorageToken
        //     //window.location.href = "/login";
        // }
        return Promise.reject(error);
    }
);
