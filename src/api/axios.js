import axios from 'axios';
import Cookies from 'js-cookie';
import { compactDecrypt, importJWK } from 'jose';

// Function to decode access token
const decodeAccessToken = async (accessToken, base64Secret) => {
    try {
        // Decode the Base64 secret key
        const secret = atob(base64Secret); // Decode Base64
        // Convert secret to Uint8Array
        const key = new TextEncoder().encode(secret);
        // Decrypt the access token (JWE)
        const { plaintext } = await compactDecrypt(accessToken, key);
        // Parse the plaintext into JSON object
        const decodedPayload = JSON.parse(new TextDecoder().decode(plaintext));
        return decodedPayload;
    } catch (error) {
        console.error('Error decoding access token:', error);
        throw error;
    }
};

const API_URL = process.env.REACT_APP_API_URL || 'https://kgrill-backend.onrender.com/api/v1';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
});

axiosInstance.interceptors.request.use(
    (config) => {
        const tokenHeaderPayload = localStorage.getItem('access_token_header_payload');
        const tokenSignature = Cookies.get('access_token_signature');

        if (tokenHeaderPayload && tokenSignature) {
            const fullToken = `${tokenHeaderPayload}.${tokenSignature}`;
            config.headers['Authorization'] = `Bearer ${fullToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/auth/signin', {
            email: credentials.email,
            password: credentials.password,
        });

        if (!response.data.data || !response.data.data['access_token']) {
            throw new Error('Access token is missing in the response');
        }

        const accessToken = response.data.data['access_token'];
        const refreshToken = response.data.data['refresh_token'];

        // Decode access token to get payload
        const decodedPayload = await decodeAccessToken(accessToken, 'NDc0OTM5MThhZDgyM2Q1NTc5ZGRiZmE4OTRjYjUxMTY=');

        // Store tokens and decoded payload in localStorage and cookies
        storeTokensAndPayload(accessToken, refreshToken, decodedPayload);

        return decodedPayload; // Return decoded payload
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};


export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
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

        const newAccessToken = response.data.data['access_token'];

        if (!newAccessToken) {
            throw new Error('New access token is missing in the response');
        }

        // Decode new access token to get payload
        const decodedPayload = await decodeAccessToken(newAccessToken, 'TIOPkmCHITnbApumTo0G1qDdZHdGl0oN');

        // Store tokens and decoded payload in localStorage and cookies
        storeTokensAndPayload(newAccessToken, refreshToken, decodedPayload);

        return decodedPayload; // Return decoded payload
    } catch (error) {
        console.error('Error during token refresh:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
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
            clearTokensAndPayload();
            return true;
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
        return false;
    }
};

// Helper function to store tokens and payload in localStorage and cookies
const storeTokensAndPayload = (accessToken, refreshToken, decodedPayload) => {
    // Split the access token
    const tokenParts = accessToken.split('.');
    const tokenHeaderPayload = `${tokenParts[0]}.${tokenParts[1]}`;
    const tokenSignature = tokenParts[2];

    // Store header.payload in localStorage
    localStorage.setItem('access_token_header_payload', tokenHeaderPayload);

    // Store signature in cookies
    Cookies.set('access_token_signature', tokenSignature, { secure: true, sameSite: 'strict' });

    // Store refresh token in localStorage
    localStorage.setItem('refresh_token', refreshToken);

    // Store decoded payload in localStorage
    localStorage.setItem('decoded_payload', JSON.stringify(decodedPayload));
};

// Helper function to clear tokens and payload from localStorage and cookies
const clearTokensAndPayload = () => {
    localStorage.removeItem('access_token_header_payload');
    localStorage.removeItem('refresh_token');
    Cookies.remove('access_token_signature');
    localStorage.removeItem('decoded_payload');
};

export default axiosInstance;
