import axios from 'axios';

var config = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
};
const ProjectService = {
    getProjects: async () => {
        return (await axios.get('http://localhost:3000/projects', config)).data;
    }
};

export default ProjectService;
