import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css";

export default function AuthLayout() {
    const { token } = useAuth();

    if (token) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div id="auth-layout" className="layout-container">
            <div className="auth-card">
                <Outlet />
            </div>
        </div>
    );
}
