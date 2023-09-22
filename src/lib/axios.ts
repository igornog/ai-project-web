import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://ai-upload-api.onrender.com',  
});
