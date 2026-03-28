import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";

export default function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getProducts();
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

    const getProducts = () => {
        setLoading(true);
        const creds = getCredentials();
        if (!creds) {
            setError("Credentials not found. Please login again.");
            setLoading(false);
            return;
        }

        axiosClient.get('/products', { params: creds })
            .then(({ data }) => {
                setProducts(data.products || []);
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch products from Odoo');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    // Odoo Many2one fields often come as an array [id, "Name"]. We format them here.
    const formatCategory = (categ) => {
        if (!categ) return '-';
        if (Array.isArray(categ) && categ.length > 1) {
            return categ[1];
        }
        return categ;
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Products (Odoo)</h1>
                <Link to="/products/new" className="btn-primary" style={{ width: 'auto', margin: 0 }}>Add new</Link>
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
                ) : products.length === 0 ? (
                    <div className="empty-state">No products found.</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>List Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id} onClick={() => navigate(`/products/${p.id}`)}>
                                    <td style={{ fontWeight: '500' }}>{p.name}</td>
                                    <td>
                                        <span style={{ 
                                            background: 'rgba(255,255,255,0.1)', 
                                            padding: '4px 8px', 
                                            borderRadius: '6px', 
                                            fontSize: '0.8rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {p.type || '-'}
                                        </span>
                                    </td>
                                    <td>{formatCategory(p.categ_id)}</td>
                                    <td>{p.list_price ? `$${parseFloat(p.list_price).toFixed(2)}` : '-'}</td>
                                    <td>
                                        <div style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 'bold' }}>EDIT</div>
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
