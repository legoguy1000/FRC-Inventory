import axios from 'axios';
import { axios_config, API_ENPOINT } from '../config';
import { Part } from '../../../server/src/interfaces';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PartCreate = Optional<Omit<Part, | "createdAt" | "updatedAt">, 'id'>


export const PartService = {
    getParts: async (inventory: boolean = false) => {
        try {
            let params = new URLSearchParams({ inventory: `${inventory}` });
            const response = await axios.get(`${API_ENPOINT}/parts?${params}`, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    addPart: async (data: PartCreate) => {
        try {
            const response = await axios.post(`${API_ENPOINT}/parts/`, data, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    bulkAdd: async (data: PartCreate[]) => {
        try {
            const response = await axios.post(`${API_ENPOINT}/parts/bulk`, { parts: data }, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    editPart: async (partId: string, data: PartCreate) => {
        try {
            const response = await axios.put(`${API_ENPOINT}/parts/${partId}`, data, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    deletePart: async (partId: string) => {
        try {
            const response = await axios.delete(`${API_ENPOINT}/parts/${partId}`, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    getCategories: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/parts/categories`, axios_config);
            return response.data; axios_config
        } catch (error: any) {
            return error.response.data;
        }
    },
    getLocations: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/parts/locations`, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
};

// export default PartService;
