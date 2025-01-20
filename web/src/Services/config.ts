export const config = {
    headers: {
        'Access-Control-Allow-Origin': (import.meta.env.VITE_NODE_ENV == 'dev' ? '*' : ''),
        'Content-Type': 'application/json',
    }
};

export const API_ENPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
