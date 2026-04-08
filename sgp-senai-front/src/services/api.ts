import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api' // O endereço que definimos no Java
});

export default api;