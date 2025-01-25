export const config = {
    headers: {
        'Access-Control-Allow-Origin': (import.meta.env.VITE_APP_NODE_ENV == 'dev' ? '*' : undefined),
        'Content-Type': 'application/json',
    },
    params: {}
};

export const API_ENPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
