import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getOrders();
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

    const getOrders = () => {
        setLoading(true);
        const creds = getCredentials();
        if (!creds) {
            setError("Identifiants introuvables. Veuillez vous reconnecter.");
            setLoading(false);
            return;
        }

        axiosClient.get('/orders', { params: creds })
            .then(({ data }) => {
                setOrders(data.orders || []);
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Échec du chargement des commandes depuis Odoo');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const formatName = (field) => {
        if (!field) return '-';
        if (Array.isArray(field) && field.length > 1) {
            return field[1];
        }
        return field;
    }

    const formatState = (state) => {
        const stateMap = {
            'draft': 'Devis',
            'sent': 'Devis envoyé',
            'sale': 'Bon de commande',
            'done': 'Terminé',
            'cancel': 'Annulé'
        };
        const label = stateMap[state] || state;
        
        let bgColor = 'rgba(255,255,255,0.1)';
        let color = '#fff';
        if (state === 'sale' || state === 'done') {
            bgColor = 'rgba(16, 185, 129, 0.2)';
            color = '#34d399';
        } else if (state === 'cancel') {
            bgColor = 'rgba(239, 68, 68, 0.2)';
            color = '#f87171';
        }

        return (
            <span style={{ 
                background: bgColor, 
                color: color,
                padding: '4px 8px', 
                borderRadius: '6px', 
                fontSize: '0.8rem',
                fontWeight: '500',
                textTransform: 'uppercase'
            }}>
                {label}
            </span>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Devis & Commandes</h1>
                <Link to="/orders/new" className="btn-primary" style={{ width: 'auto', margin: 0 }}>Créer un devis</Link>
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
                ) : orders.length === 0 ? (
                    <div className="empty-state">Aucune commande trouvée.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Référence</th>
                                <th>Client</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                                    <td style={{ fontWeight: '500' }}>{o.name}</td>
                                    <td>{formatName(o.partner_id)}</td>
                                    <td>{o.date_order ? new Date(o.date_order).toLocaleDateString() : '-'}</td>
                                    <td style={{ fontWeight: '600' }}>{o.amount_total ? `${parseFloat(o.amount_total).toFixed(2)} €` : '-'}</td>
                                    <td>{formatState(o.state)}</td>
                                    <td>
                                        <div style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 'bold' }}>VOIR</div>
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
