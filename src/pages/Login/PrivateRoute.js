import React from 'react';
import { Navigate } from 'react-router-dom';

// Function to get role from the decoded payload
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
    // Retrieve decoded payload from localStorage
    const decodedPayload = JSON.parse(localStorage.getItem('decoded_payload'));

    if (!decodedPayload) {
        // If decodedPayload is not found, redirect to login page
        return <Navigate to="/login" />;
    }

    const userRole = getUserRole(decodedPayload);

    if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        // If requiredRoles are specified and userRole is not in the requiredRoles, redirect to unauthorized page
        return <Navigate to="/unauthorized" />;
    }

    // Render the protected element if all conditions are met
    return element;
};

export default PrivateRoute;
