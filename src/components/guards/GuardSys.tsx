import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

export const AuthGuard = () => {
    const isAuth = useAuthStore(state => state.isAuthenticated);    
    if (!isAuth) {
        return <Navigate to="/login" replace={true} />; 
    } 
    return <Outlet />;
}

export const GuestGuard = () => {
    const isAuth = useAuthStore(state => state.isAuthenticated);
    if (isAuth) {
        return <Navigate to="/dashboard" replace={true} />;
    }
    return <Outlet />;
}