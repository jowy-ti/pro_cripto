import axios from 'axios';

const API_URL = 'http://back:8081';

export const login = async (userName, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            userName,
            password,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const register = async (userName, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            userName,
            password,
        });
        return response;  
    } catch (error) {
        throw error;
    }
};

export const isAuthenticated = async (page) => {
    try {
        const response = await axios.get(`${API_URL}${page}`, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
};

export const logout = async () =>{
    try {
        const response = await axios.post('/logout', {}, {withCredentials: true});
        return response;
    } catch (error) {
        throw error;
    }
};