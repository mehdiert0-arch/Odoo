import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axios";

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getClients();
    }, []);

    const getCredentials = () => {
        const token = localStorage.getItem('ACCESS_TOKEN');
        if (!token) return null;
        try {
            const decoded = atob(token);
            const semicolonIndex = decoded.indexOf(':');
            if (semicolonIndex === -1) return null;
            const login = decoded.substring(0, semicolonIndex);
            const password = decoded.substring(semicolonIndex + 1);
            return { login, password };
        } catch (e) {
            return null;
        }
    }

    const getClients = () => {
        setLoading(true);
        const creds = getCredentials();
        if (!creds) {
            setError("Credentials not found. Please login again.");
            setLoading(false);
            return;
        }

        axiosClient.get('/clients', { params: creds })
            .then(({ data }) => {
                setClients(data.clients || []);
            })
            .catch(err => {
                console.warn(err);
                // Fallback to mock data to see UI without Odoo
                setClients([
                    { id: 1, name: "Alice Smith", email: "alice@example.com", phone: "+123456789", city: "New York", street: "5th Ave" },
                    { id: 2, name: "Bob Johnson", email: "bob@example.com", phone: "+987654321", city: "London", street: "Baker St" },
                    { id: 3, name: "Creative Studios Ltd", email: "contact@creativestudios.com", phone: "+1122334455", city: "Paris", street: "Rue de Rivoli" },
                    { id: 4, name: "David Wilson", email: "david.w@example.com", phone: "+5566778899", city: "Sydney", street: "George St" },
                ]);
                setError("Odoo is not available. Showing mock data for demonstration.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Clients (Odoo)</h1>
                <Link to="/clients/new" className="btn-primary" style={{ width: 'auto', margin: 0 }}>Add new</Link>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="data-table-container">
                {loading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="empty-state">No clients found.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.email || '-'}</td>
                                    <td>{c.phone || '-'}</td>
                                    <td>{c.city ? `${c.city}, ${c.street || ''}` : (c.street || '-')}</td>
                                    <td>
                                        <Link style={{ marginRight: '1rem', color: '#c084fc' }} to={`/clients/${c.id}`}>View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
