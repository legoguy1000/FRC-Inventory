import axios from 'axios';
import { config, API_ENPOINT } from './config';

const ProjectService = {
    getProjects: async () => {
        return (await axios.get(`${API_ENPOINT}/projects`, config)).data;
    }
};

export default ProjectService;
