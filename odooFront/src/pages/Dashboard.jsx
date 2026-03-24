import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: '700', background: 'linear-gradient(to right, #818cf8, #c084fc)', flex: 1, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Dashboard
            </h1 >
            <div className="auth-card" style={{ maxWidth: 'none', padding: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f8fafc' }}>
                    Welcome back, {user?.name}!
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    You are successfully logged in through the {user?.uid ? `Odoo (UID: ${user.uid})` : 'Laravel'} backend proxy.
                    This dashboard is a protected area of your application.
                </p>
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#818cf8' }}>User Profile</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>View and edit your profile settings.</p>
                    </div>
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#818cf8' }}>Odoo Integration</h3>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Manage data and sync with Odoo resources.</p>
                    </div>
                </div>
            </div>
        </div >
    );
}
