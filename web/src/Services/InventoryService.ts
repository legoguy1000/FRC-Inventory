import axios from 'axios';
import { axios_config, API_ENPOINT } from '../config';

const InventoryService = {
    getInvetory: async () => {
        try {
            const response = await axios.get(`${API_ENPOINT}/inventory`, axios_config);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    }
};

export default InventoryService;
