import React from 'react';
import { Navigate } from 'react-router-dom';

const getUserRole = (decodedPayload) => {
    try {
        const role = decodedPayload.role; // Assuming the role is stored in the 'role' field
        return role;
    } catch (error) {
        console.error('Invalid payload:', error);
        return null;
    }
};

const PrivateRoute = ({ element, requiredRoles }) => {
    const decodedPayload = JSON.parse(localStorage.getItem('decoded_payload'));

    if (!decodedPayload) {
        return <Navigate to="/login" />;
    }

    const userRole = getUserRole(decodedPayload);

    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return element;
};

export default PrivateRoute;
