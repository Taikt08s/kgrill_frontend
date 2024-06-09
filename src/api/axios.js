import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL || 'https://kgrill-backend.onrender.com/api/v1';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});



export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/signin', {
            email: credentials.email,
            password: credentials.password,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};



export const refreshToken = async () => {
    try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) {
            throw new Error('Refresh token is missing');
        }
        const response = await axiosInstance.post('/auth/refresh-token', {
            refreshToken: refreshToken
        }, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        const { accessToken } = response.data;
        Cookies.set('access_token', accessToken, { secure: true });
        return accessToken;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) {
            throw new Error('Refresh token is missing');
        }
        const response = await axiosInstance.post('/auth/logout', {
            refreshToken: refreshToken
        }, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        if (response.status === 200) {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            return true;
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default axiosInstance;