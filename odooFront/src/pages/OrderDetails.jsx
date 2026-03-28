import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [order, setOrder] = useState({
        partner_id: '',
        order_lines: []
    });
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isNew) {
            getOrder();
        } else {
            // Load clients and products for dropdowns when creating an order
            loadDependencies();
            
            // Add initial empty line
            setOrder(prev => ({
                ...prev,
                order_lines: [{ product_id: '', quantity: 1, price_unit: 0 }]
            }));
        }
    }, [id]);

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

    const loadDependencies = async () => {
        setLoading(true);
        const creds = getCredentials();
        try {
            const [clientsRes, productsRes] = await Promise.all([
                axiosClient.get('/clients', { params: creds }),
                axiosClient.get('/products', { params: creds })
            ]);
            setClients(clientsRes.data.clients || []);
            setProducts(productsRes.data.products || []);
        } catch (err) {
            setError('Failed to load customers or products.');
        } finally {
            setLoading(false);
        }
    };

    const getOrder = () => {
        setLoading(true);
        const creds = getCredentials();

        axiosClient.get(`/orders/${id}`, { params: creds })
            .then(({ data }) => {
                setOrder(data.order || {});
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch order details');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        setSaving(true);
        setError(null);
        
        if (!isNew) {
            setTimeout(() => {
                setSaving(false);
                setError("Update method is not defined in OrderController yet.");
            }, 800);
            return;
        }

        const creds = getCredentials();
        if (!creds) {
            setError("Credentials missing.");
            setSaving(false);
            return;
        }

        // Validate partner
        if (!order.partner_id) {
            setError("Please select a customer.");
            setSaving(false);
            return;
        }

        // Validate lines
        const validLines = order.order_lines.filter(l => l.product_id && l.quantity > 0);
        if (validLines.length === 0) {
            setError("Please add at least one valid product line.");
            setSaving(false);
            return;
        }

        const payload = {
            login: creds.login,
            password: creds.password,
            partner_id: parseInt(order.partner_id),
            order_lines: validLines.map(l => ({
                product_id: parseInt(l.product_id),
                quantity: parseFloat(l.quantity),
                price_unit: parseFloat(l.price_unit)
            }))
        };

        axiosClient.post('/orders', payload)
            .then(() => {
                navigate('/orders');
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to create order');
                setSaving(false);
            });
    }

    const addLine = () => {
        setOrder(prev => ({
            ...prev,
            order_lines: [...prev.order_lines, { product_id: '', quantity: 1, price_unit: 0 }]
        }));
    };

    const removeLine = (index) => {
        setOrder(prev => {
            const newLines = [...prev.order_lines];
            newLines.splice(index, 1);
            return { ...prev, order_lines: newLines };
        });
    };

    const updateLine = (index, field, value) => {
        setOrder(prev => {
            const newLines = [...prev.order_lines];
            newLines[index] = { ...newLines[index], [field]: value };
            
            // Auto-fill price if product is selected
            if (field === 'product_id' && value) {
                const selectedProd = products.find(p => p.id === parseInt(value));
                if (selectedProd && selectedProd.list_price) {
                    newLines[index].price_unit = selectedProd.list_price;
                }
            }
            
            return { ...prev, order_lines: newLines };
        });
    };

    const formatName = (field) => {
        if (Array.isArray(field) && field.length > 1) {
            return field[1];
        }
        return field || '-';
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <h1 className="page-title">{isNew ? 'Create New Order' : `Order Details: ${order.name || ''}`}</h1>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <div className="auth-card" style={{ maxWidth: '100%' }}>
                    <form onSubmit={onSubmit}>
                        
                        {isNew ? (
                            <div className="form-group">
                                <label>Customer</label>
                                <select 
                                    value={order.partner_id || ''} 
                                    onChange={ev => setOrder({...order, partner_id: ev.target.value})} 
                                    required
                                    style={{
                                        width: '100%', padding: '12px 16px', background: 'var(--input-bg)',
                                        border: '1px solid var(--glass-border)', borderRadius: '12px',
                                        color: 'white', fontSize: '1rem', boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="">-- Select Customer --</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Customer</h4>
                                    <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '500' }}>{formatName(order.partner_id)}</div>
                                </div>
                                <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status / Order Date</h4>
                                    <div style={{ color: '#fff', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                                        {order.state || '-'} {order.date_order ? `(${new Date(order.date_order).toLocaleDateString()})` : ''}
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total Amount</h4>
                                    <div style={{ color: '#34d399', fontSize: '1.2rem', fontWeight: '600' }}>
                                        {order.amount_total ? `$${parseFloat(order.amount_total).toFixed(2)}` : '$0.00'}
                                    </div>
                                </div>
                                {order.note && (
                                    <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Notes</h4>
                                        <div style={{ color: '#fff', fontSize: '0.9rem' }}>{order.note}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {isNew && (
                            <div style={{ marginTop: '2rem' }}>
                                <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.2rem' }}>Order Lines</h3>
                                
                                {order.order_lines.map((line, idx) => (
                                    <div key={idx} style={{ 
                                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', 
                                        alignItems: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)',
                                        padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        <div>
                                            <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)'}}>Product</label>
                                            <select 
                                                value={line.product_id || ''} 
                                                onChange={ev => updateLine(idx, 'product_id', ev.target.value)}
                                                style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                                                required
                                            >
                                                <option value="">-- Product --</option>
                                                {products.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)'}}>Quantity</label>
                                            <input 
                                                type="number" min="1" step="0.1" 
                                                value={line.quantity} 
                                                onChange={ev => updateLine(idx, 'quantity', ev.target.value)}
                                                style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={{display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: 'var(--text-secondary)'}}>Unit Price</label>
                                            <input 
                                                type="number" min="0" step="0.01" 
                                                value={line.price_unit} 
                                                onChange={ev => updateLine(idx, 'price_unit', ev.target.value)}
                                                style={{ width: '100%', padding: '8px', background: 'var(--input-bg)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: '#fff' }}
                                                required
                                            />
                                        </div>
                                        <div style={{ marginTop: '1.2rem' }}>
                                            <button type="button" onClick={() => removeLine(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    type="button" 
                                    onClick={addLine}
                                    style={{ background: 'rgba(99, 102, 241, 0.2)', border: '1px dashed #6366f1', color: '#818cf8', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', width: '100%', fontWeight: '500' }}
                                >
                                    + Add Line Item
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                            <button className="btn-primary" disabled={saving} type="submit" style={{ marginTop: 0 }}>
                                {saving ? 'Processing...' : (isNew ? 'Create Order' : 'Save Changes')}
                            </button>
                            <button 
                                className="btn-primary" 
                                type="button" 
                                onClick={() => navigate('/orders')} 
                                style={{ marginTop: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                Go Back
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
