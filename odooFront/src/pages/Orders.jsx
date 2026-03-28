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
            setError("Credentials not found. Please login again.");
            setLoading(false);
            return;
        }

        axiosClient.get('/orders', { params: creds })
            .then(({ data }) => {
                setOrders(data.orders || []);
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch orders from Odoo');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Odoo Many2one fields often come as an array [id, "Name"]. We format them here.
    const formatName = (field) => {
        if (!field) return '-';
        if (Array.isArray(field) && field.length > 1) {
            return field[1];
        }
        return field;
    }

    const formatState = (state) => {
        const stateMap = {
            'draft': 'Quotation',
            'sent': 'Quotation Sent',
            'sale': 'Sales Order',
            'done': 'Locked',
            'cancel': 'Cancelled'
        };
        const label = stateMap[state] || state;
        
        let bgColor = 'rgba(255,255,255,0.1)';
        let color = '#fff';
        if (state === 'sale' || state === 'done') {
            bgColor = 'rgba(16, 185, 129, 0.2)'; // Green
            color = '#34d399';
        } else if (state === 'cancel') {
            bgColor = 'rgba(239, 68, 68, 0.2)'; // Red
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
                <h1 className="page-title">Sales Orders</h1>
                <Link to="/orders/new" className="btn-primary" style={{ width: 'auto', margin: 0 }}>Create Order</Link>
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
                    <div className="empty-state">No orders found.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order Ref</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                                    <td style={{ fontWeight: '500' }}>{o.name}</td>
                                    <td>{formatName(o.partner_id)}</td>
                                    <td>{o.date_order ? new Date(o.date_order).toLocaleString() : '-'}</td>
                                    <td style={{ fontWeight: '600' }}>{o.amount_total ? `$${parseFloat(o.amount_total).toFixed(2)}` : '-'}</td>
                                    <td>{formatState(o.state)}</td>
                                    <td>
                                        <div style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 'bold' }}>VIEW</div>
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
