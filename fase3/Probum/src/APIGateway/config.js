let api_access_point = process.env.API_AP || 'http://localhost:8000';
const apiRoute = (route) => api_access_point + route;

export {
    api_access_point,
    apiRoute
}