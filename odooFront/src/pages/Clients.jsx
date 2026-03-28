import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";

export default function Clients() {
    const navigate = useNavigate();
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
            setError("Identifiants introuvables. Veuillez vous reconnecter.");
            setLoading(false);
            return;
        }

        axiosClient.get('/clients', { params: creds })
            .then(({ data }) => {
                setClients(data.clients || []);
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Échec du chargement des clients depuis Odoo');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Clients (Odoo)</h1>
                <Link to="/clients/new" className="btn-primary" style={{ width: 'auto', margin: 0 }}>Ajouter un client</Link>
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
                    <div className="empty-state">Aucun client trouvé.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>E-mail</th>
                                <th>Téléphone</th>
                                <th>Localisation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(c => (
                                <tr key={c.id} onClick={() => navigate(`/clients/${c.id}`)}>
                                    <td>{c.name}</td>
                                    <td>{c.email || '-'}</td>
                                    <td>{c.phone || '-'}</td>
                                    <td>{c.city ? `${c.city}, ${c.street || ''}` : (c.street || '-')}</td>
                                    <td>
                                        <div style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 'bold' }}>MODIFIER</div>
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
