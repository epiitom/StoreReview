import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL:API_BASE_URL,
});

//Add tokens to request
api.interceptors.request.use((config)=>{
      const token = localStorage.getItem('token');
      if(token){
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
});

//Auth api
export const authAPI ={
    register:(userData) => api.post('/auth/register',userData),
    login: (credentials) => api.post('/auth/login', credentials),
    updatePassword: (passwordData) => api.put('/auth/update-password', passwordData),
}
// user API (Admin only)

export const userAPI ={
    getUsers:(filter) => api.get('/users',{params:filter }),
    createUser:(userData => api.post('/user',userData)),
    getUserById:(id) => api.get(`/user/${id}`),
};
// Store API
export const storeAPI = {
    getStores: (filters) => api.get('/stores/getstore', { params: filters }),
    createStore: (storeData) => api.post('/stores/createstore', storeData),
    getMyStore: () => api.get('/stores/my-store'),
    getStoreOwner: () => api.get('/stores/store-owners'),
    getMyStoreRatings: () => api.get('/stores/my-store/ratings'),
};
export const ratingAPI = {
    submitRating: (ratingData) => api.post('/ratings', ratingData),
    updateRating: (id, ratingData) => api.put(`/ratings/${id}`, ratingData),
    getAllRatings: () => api.get('/ratings'),
};
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
};

export default api;