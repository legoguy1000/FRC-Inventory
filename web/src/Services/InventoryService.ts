import axios from 'axios';
import { config, API_ENPOINT } from './config';

const InventoryService = {
    getInvetory: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/inventory`, config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
};

export default InventoryService;
