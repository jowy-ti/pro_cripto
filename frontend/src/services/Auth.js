import axios from 'axios';

const API_URL = 'http://localhost:5000';

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

export const logout = () =>{
    //localStorage.removeItem('token');
};














export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const user = JSON.parse(atob(token.split('.')[1]));
        return user;
    }
    return null;
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