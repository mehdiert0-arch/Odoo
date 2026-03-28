import { useEffect, useState } from "react";
import { 
    Users, 
    ShoppingCart, 
    Package, 
    DollarSign, 
    TrendingUp, 
    Clock, 
    CheckCircle,
    ArrowUpRight,
    ArrowDownRight 
} from "lucide-react";
import axiosClient from "../api/axios";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalSales: '124,500.00',
        activeOrders: 14,
        newClients: 8,
        totalProducts: 142
    });

    const salesProgress = [65, 82, 45, 90, 70, 75, 95];

    return (
        <div className="dashboard-wrapper" style={{ animation: 'slideUp 0.6s ease-out' }}>
            <div className="page-header" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1 className="page-title">Vue d'ensemble opérationnelle</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Performance commerciale en temps réel depuis Odoo ERP.</p>
                </div>
                <div style={{ background: 'var(--input-bg)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={16} color="var(--primary-color)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Dernière synchro : À l'instant</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <StatCard 
                    title="Chiffre d'affaires" 
                    value={`${stats.totalSales} €`} 
                    subtitle="+12.5% depuis le mois dernier" 
                    icon={<DollarSign size={24} />} 
                    color="#6366f1"
                    trend="up"
                />
                <StatCard 
                    title="Commandes" 
                    value={stats.activeOrders} 
                    subtitle="Actuellement en devis" 
                    icon={<ShoppingCart size={24} />} 
                    color="#ec4899"
                    trend="up"
                />
                <StatCard 
                    title="Partenaires" 
                    value={stats.newClients} 
                    subtitle="Acquis cette semaine" 
                    icon={<Users size={24} />} 
                    color="#10b981"
                    trend="neutral"
                />
                <StatCard 
                    title="Inventaire" 
                    value={stats.totalProducts} 
                    subtitle="Articles en catalogue" 
                    icon={<Package size={24} />} 
                    color="#f59e0b"
                    trend="down"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                
                <div className="auth-card" style={{ maxWidth: 'none', padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Vitesse de vente hebdomadaire</h3>
                        <TrendingUp size={20} color="var(--text-secondary)" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '180px', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        {salesProgress.map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                <div style={{ 
                                    width: '100%', 
                                    height: `${h}%`, 
                                    background: i === 6 ? 'linear-gradient(to top, var(--primary-color), var(--secondary-color))' : 'rgba(99, 102, 241, 0.2)',
                                    borderRadius: '8px 8px 4px 4px',
                                    transition: 'height 1s ease'
                                }}></div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>J{i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="auth-card" style={{ maxWidth: 'none', padding: '2.5rem' }}>
                    <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.25rem' }}>Cycle de vie des commandes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <ProgressBar label="Devis" percent={70} color="#6366f1" />
                        <ProgressBar label="Commandes confirmées" percent={45} color="#10b981" />
                        <ProgressBar label="Facturées" percent={28} color="#ec4899" />
                        <ProgressBar label="Annulées" percent={5} color="#f43f5e" />
                    </div>
                </div>

            </div>

            <div className="auth-card" style={{ maxWidth: 'none', padding: '2rem', marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Commandes en cours</h3>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer' }}>Voir le rapport</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '12px 6px', fontWeight: '500', fontSize: '0.85rem' }}>REF</th>
                            <th style={{ padding: '12px 6px', fontWeight: '500', fontSize: '0.85rem' }}>PARTENAIRE</th>
                            <th style={{ padding: '12px 6px', fontWeight: '500', fontSize: '0.85rem' }}>ÉTAT</th>
                            <th style={{ padding: '12px 6px', fontWeight: '500', fontSize: '1.2rem', textAlign: 'right' }}>VALEUR</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.9rem' }}>
                        <RecentRow id="S0001" name="Azure Interior" status="sale" val="2,400.00" />
                        <RecentRow id="S0005" name="Gemini Furniture" status="draft" val="1,150.00" />
                        <RecentRow id="S0012" name="Ready Mat" status="sent" val="740.00" />
                        <RecentRow id="S0015" name="Deco Addict" status="sale" val="5,200.00" />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon, color, trend }) {
    return (
        <div className="card-vibe" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: color }}>
                {icon}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.2rem' }}>
                <div style={{ padding: '10px', background: `${color}20`, borderRadius: '12px' }}>
                    {icon}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>{title}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '800' }}>{value}</span>
                {trend === 'up' && <ArrowUpRight size={18} color="#10b981" />}
                {trend === 'down' && <ArrowDownRight size={18} color="#f43f5e" />}
            </div>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{subtitle}</p>
        </div>
    );
}

function ProgressBar({ label, percent, color }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ fontWeight: '500' }}>{label}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{percent}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: '10px' }}></div>
            </div>
        </div>
    );
}

function RecentRow({ id, name, status, val }) {
    const isSale = status === 'sale';
    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
            <td style={{ padding: '15px 6px', color: 'var(--primary-color)', fontWeight: '600' }}>{id}</td>
            <td style={{ padding: '15px 6px' }}>{name}</td>
            <td style={{ padding: '15px 6px' }}>
                <span style={{ 
                    background: isSale ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                    color: isSale ? '#10b981' : 'var(--text-secondary)',
                    fontSize: '0.7rem', padding: '4px 8px', borderRadius: '6px', fontWeight: '700'
                }}>
                    {status === 'sale' ? 'VENTE' : status === 'sent' ? 'DEVIS ENVOYÉ' : 'BROUILLON'}
                </span>
            </td>
            <td style={{ padding: '15px 6px', textAlign: 'right', fontWeight: '600' }}>{val} €</td>
        </tr>
    );
}
