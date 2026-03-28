import { Navigate, Outlet, NavLink } from "react-router-dom";
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
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/clients">Clients (Odoo)</NavLink>
                    <NavLink to="/products">Products (Odoo)</NavLink>
                    <NavLink to="/orders">Orders (Odoo)</NavLink>
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
