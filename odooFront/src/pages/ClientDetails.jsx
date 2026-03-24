import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axios";

export default function ClientDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const isNew = id === 'new';

    useEffect(() => {
        if (!isNew) {
            getClient();
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

    const getClient = () => {
        setLoading(true);
        const creds = getCredentials();

        axiosClient.get(`/clients/${id}`, { params: creds })
            .then(({ data }) => {
                setClient(data.client || {});
            })
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to fetch client details');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        setSaving(true);
        setError(null);
        
        // This simulates adding/updating. Since there is no store/update method in the ClientController.
        // I will mock this request for UI completeness.
        setTimeout(() => {
            setSaving(false);
            if (isNew) {
                setError("Creation method is not defined in ClientController yet, but this is how the UI would behave.");
            } else {
                setError("Update method is not defined in ClientController yet.");
            }
        }, 800);
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <h1 className="page-title">{isNew ? 'Add Client' : 'Client Details'}</h1>
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
                            <label>Name</label>
                            <input 
                                value={client.name || ''} 
                                onChange={ev => setClient({...client, name: ev.target.value})} 
                                type="text" 
                                placeholder="Enter full name" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                value={client.email || ''} 
                                onChange={ev => setClient({...client, email: ev.target.value})} 
                                type="email" 
                                placeholder="Enter email address" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input 
                                value={client.phone || ''} 
                                onChange={ev => setClient({...client, phone: ev.target.value})} 
                                type="text" 
                                placeholder="Enter phone number" 
                            />
                        </div>
                        <div className="form-group">
                            <label>Street</label>
                            <input 
                                value={client.street || ''} 
                                onChange={ev => setClient({...client, street: ev.target.value})} 
                                type="text" 
                                placeholder="Enter street address" 
                            />
                        </div>
                        <div className="form-group">
                            <label>City</label>
                            <input 
                                value={client.city || ''} 
                                onChange={ev => setClient({...client, city: ev.target.value})} 
                                type="text" 
                                placeholder="Enter city" 
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn-primary" disabled={saving} type="submit" style={{ marginTop: 0 }}>
                                {saving ? 'Saving...' : 'Save Changes'}
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
