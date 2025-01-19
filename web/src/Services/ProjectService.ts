import axios from 'axios';

const ProjectService = {
    getProjects: async () => {
        return await axios.get('localhost:3000/projects')
    }
};

export default ProjectService;
