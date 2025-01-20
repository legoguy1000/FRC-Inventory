import axios from 'axios';
import { config, API_ENPOINT } from './config';
import { Part } from '../../../server/src/interfaces';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type PartCreate = Optional<Omit<Part, | "createdAt" | "updatedAt">, 'id'>


export const PartService = {
    getParts: async (inventory: boolean = false) => {
        try {
            let params = new URLSearchParams({ inventory: `${inventory}` });
            const response = await axios.get(`${API_ENPOINT}/parts?${params}`, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    addPart: async (data: PartCreate) => {
        try {
            const response = await axios.post(`${API_ENPOINT}/parts/`, data, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    bulkAdd: async (data: PartCreate[]) => {
        try {
            const response = await axios.post(`${API_ENPOINT}/parts/bulk`, { parts: data }, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    editPart: async (partId: string, data: PartCreate) => {
        try {
            const response = await axios.put(`${API_ENPOINT}/parts/${partId}`, data, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    deletePart: async (partId: string) => {
        try {
            const response = await axios.delete(`${API_ENPOINT}/parts/${partId}`, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    getCategories: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/parts/categories`, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
    getLocations: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/parts/locations`, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },
};

// export default PartService;
