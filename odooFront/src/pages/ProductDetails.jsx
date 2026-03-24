import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        list_price: '',
        type: 'product',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const isNew = id === 'new';

    useEffect(() => {
        if (!isNew) {
            getProduct();
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

    const getProduct = () => {
        setLoading(true);
        const creds = getCredentials();

        axiosClient.get(`/products/${id}`, { params: creds })
            .then(({ data }) => {
                setProduct(data.product || {});
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch product details');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        setSaving(true);
        setError(null);
        
        // This simulates adding/updating. Since there is no store/update method in the ProductController.
        setTimeout(() => {
            setSaving(false);
            if (isNew) {
                setError("Creation method is not defined in ProductController yet, but this is how the UI would behave.");
            } else {
                setError("Update method is not defined in ProductController yet.");
            }
        }, 800);
    }
    
    // Odoo Many2one formats [id, 'name']
    const formatName = (field) => {
        if (Array.isArray(field) && field.length > 1) {
            return field[1];
        }
        return field || '-';
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <h1 className="page-title">{isNew ? 'New Product' : 'Product Details'}</h1>
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
                        <div className="form-group">
                            <label>Product Name</label>
                            <input 
                                value={product.name || ''} 
                                onChange={ev => setProduct({...product, name: ev.target.value})} 
                                type="text" 
                                placeholder="Enter product name" 
                                required 
                            />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label>List Price</label>
                                <input 
                                    value={product.list_price || ''} 
                                    onChange={ev => setProduct({...product, list_price: ev.target.value})} 
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00" 
                                />
                            </div>
                            <div className="form-group">
                                <label>Product Type</label>
                                <input 
                                    value={product.type || ''} 
                                    onChange={ev => setProduct({...product, type: ev.target.value})} 
                                    type="text" 
                                    placeholder="e.g. conus, service, product" 
                                />
                            </div>
                        </div>

                        {!isNew && (
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Category</h4>
                                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>{formatName(product.categ_id)}</div>
                                </div>
                                <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Unit of Measure</h4>
                                    <div style={{ color: '#fff', fontSize: '0.95rem' }}>{formatName(product.uom_id)}</div>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Description</label>
                            <textarea 
                                value={product.description || ''} 
                                onChange={ev => setProduct({...product, description: ev.target.value})}
                                placeholder="Product description"
                                rows="4"
                                style={{ 
                                    width: '100%', 
                                    padding: '12px 16px', 
                                    background: 'var(--input-bg)', 
                                    border: '1px solid var(--glass-border)', 
                                    borderRadius: '12px', 
                                    color: 'white', 
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    boxSizing: 'border-box'
                                }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn-primary" disabled={saving} type="submit" style={{ marginTop: 0 }}>
                                {saving ? 'Saving...' : 'Save Product'}
                            </button>
                            <button 
                                className="btn-primary" 
                                type="button" 
                                onClick={() => navigate(-1)} 
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
