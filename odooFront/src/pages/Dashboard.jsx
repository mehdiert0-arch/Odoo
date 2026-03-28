import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div style={{ maxWidth: '900px' }}>
            <h1 className="page-title">Dashboard</h1>
            <div className="auth-card" style={{ maxWidth: 'none', padding: '3rem', marginTop: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f8fafc', fontWeight: '700' }}>
                    Welcome back, {user?.name}!
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '1.15rem', marginBottom: '2.5rem' }}>
                    You are successfully authenticated through the <strong>{user?.uid ? `Odoo (UID: ${user.uid})` : 'Laravel'}</strong> portal. 
                    This interface simplifies your ERP experience by focusing on the most critical business operations.
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                    <div className="card-vibe" style={{ padding: '2rem' }}>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: '#818cf8', fontSize: '1.3rem' }}>Partner Network</h3>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', lineHeight: '1.5' }}>Manage your Odoo partners and clients with a streamlined view.</p>
                    </div>
                    <div className="card-vibe" style={{ padding: '2rem' }}>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: '#ec4899', fontSize: '1.3rem' }}>Inventory Sync</h3>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', lineHeight: '1.5' }}>Track products and catalog updates in real-time with Odoo.</p>
                    </div>
                    <div className="card-vibe" style={{ padding: '2rem' }}>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: '#10b981', fontSize: '1.3rem' }}>Sales Flow</h3>
                        <p style={{ margin: 0, fontSize: '1rem', color: '#94a3b8', lineHeight: '1.5' }}>Convert quotations into orders faster than ever before.</p>
                    </div>
                </div>
            </div>
        </div >
    );
}
