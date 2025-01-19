import axios from 'axios';
var config = {
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
};
const PartService = {
    getParts: async () => {
        return (await axios.get('http://localhost:3000/parts', config)).data
    },
    getPart: async (id: string | undefined) => {
        return (await axios.get(`http://localhost:3000/parts/${id}`, config)).data
    }
};

export default PartService;
