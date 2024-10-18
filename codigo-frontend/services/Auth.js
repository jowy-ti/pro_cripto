import axios from 'axios';

const API_URL = '???????????????????';

export const login = async (userName, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            userName,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        }
        return null;
    } catch (error) {
        throw error.response.data;
    }
    
};

export const register = async (userName, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            userName,
            password,
        });
        return response.data;  
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = () =>{
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const user = JSON.parse(atob(token.split('.')[1]));
        return user;
    }
    return null;
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; //True = Exists token
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const setAuthToken = () => {
    const token = getAuthToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};