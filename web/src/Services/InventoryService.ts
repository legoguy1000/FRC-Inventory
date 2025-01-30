import axios from 'axios';
import { axiosHttp, API_ENPOINT } from '../config';

const InventoryService = {
    getInvetory: async () => {
        try {
            const response = await axiosHttp.get(`inventory`);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
};

export default InventoryService;
