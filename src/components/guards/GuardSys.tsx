import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

export const AuthGuard = () => {
    const { isAuthenticated } = useAuthStore(); 
    if (!isAuthenticated) {
        return <Navigate to="/login" replace={true} />; 
    } 
    return <Outlet />;
}

export const GuestGuard = () => {
    const { isAuthenticated } = useAuthStore(); 
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace={true} />;
    }
    return <Outlet />;
}