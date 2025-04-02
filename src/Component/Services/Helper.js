import axios from "axios";
import { getToken } from "../Localstorage";

export const BASE_URL = 'http://localhost:8080';
export const PRIVATE_URL = 'http://localhost:8080/index';

export const publicAxios = axios.create({
    baseURL:BASE_URL
})

export const privateAxios = axios.create({
    baseURL:PRIVATE_URL,
    headers:{
        'Content-Type':'application/json'
    }
});

privateAxios.interceptors.request.use(
    async config =>{
        const token = await getToken();
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)