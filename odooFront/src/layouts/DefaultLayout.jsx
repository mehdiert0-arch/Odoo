import { Navigate, Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css";

export default function DefaultLayout() {
    const { token, user, setUser, setToken } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = async (ev) => {
        ev.preventDefault();
        // Laravel's AuthController didn't show a logout route in the snippet, but let's clear local state
        setUser(null);
        setToken(null);
    }

    return (
        <div id="default-layout" className="layout-container">
            <aside className="sidebar">
                <nav>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/clients">Clients (Odoo)</Link>
                    <Link to="/products">Products (Odoo)</Link>
                    <Link to="/orders">Orders (Odoo)</Link>
                </nav>
            </aside>
            <div className="main-content">
                <header className="main-header">
                    <div className="user-info">
                        Welcome, {user?.name}
                    </div>
                    <div>
                        <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
                    </div>
                </header>
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
