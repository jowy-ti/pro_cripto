const API_URL = 'http://10.4.41.37:8081';//;'http://localhost:5000'

export const login = async (userName, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userName, password}),
        });
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseText = await response.text();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return {status: response.status, data: responseText};
    } catch (error) {
        console.log('error');
        throw error;
    }
};

export const register = async (userName, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userName, password}),
        });
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseText = await response.text();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return {status: response.status, data: responseText};
    } catch (error) {
        console.log('error');
        throw error;
    }
};

export const isAuthenticated = async (page) => {
    try {
        const response = await fetch(`${API_URL}${page}`, {
            method: 'GET',
            credentials: 'include',
        });
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        //const responseText = await response.json();//.json()
        //console.log(`Response status: ${response.status}, Data: ${responseText}`);
        const responseText = await response.text();
        return {status: response.status, data: responseText};
        //return {status: 200, data: "successful"};
    } catch (error) {
        console.log('error');
        throw error;
    }
};

export const logout = async () =>{

    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });
        //if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        const responseText = await response.text();//.json()
        console.log(`Response status: ${response.status}, Data: ${responseText}`);
        return {status: response.status, data: responseText};
    } catch (error) {
        console.log('error');
        throw error;
    }
};