import axios from 'axios';
import { axiosHttp, API_ENPOINT } from '../config';
import { Part } from '../../../server/src/interfaces';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PartCreate = Optional<Omit<Part, | "createdAt" | "updatedAt">, 'id'>


export const PartService = {
    getParts: async (inventory: boolean = false) => {
        try {
            let params = new URLSearchParams({ inventory: `${inventory}` });
            const response = await axiosHttp.get(`parts?${params}`);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    addPart: async (data: PartCreate) => {
        try {
            const response = await axiosHttp.post(`parts/`, data);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    bulkAdd: async (data: PartCreate[]) => {
        try {
            const response = await axiosHttp.post(`parts/bulk`, { parts: data });
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    editPart: async (partId: string, data: PartCreate) => {
        try {
            const response = await axiosHttp.put(`parts/${partId}`, data);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    deletePart: async (partId: string) => {
        try {
            const response = await axiosHttp.delete(`parts/${partId}`);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    getCategories: async () => {
        try {
            const response = await axiosHttp.get(`parts/categories`);
            return response.data; axiosHttp
        } catch (error: any) {
            return error.response.data;
        }
    },
    getLocations: async () => {
        try {
            const response = await axiosHttp.get(`parts/locations`);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
};

// export default PartService;
