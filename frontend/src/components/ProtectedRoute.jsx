import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-brand-cream">
                <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-brand-dark font-black tracking-widest uppercase text-sm">Loading Application...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
