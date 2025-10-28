import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const AuthGuard = ({ children }) => {
    const { user } = useSelector((state) => state.users)

    return (
        user ? <Outlet /> : <Navigate to='login' />

    );
}

export default AuthGuard;
