// src/components/PrivateRoute/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ element }) => {
    const isAuthenticated = !!Cookies.get('access_token');
    return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
