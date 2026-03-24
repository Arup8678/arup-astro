import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import {
    FileText, Wallet, CreditCard, Copy, Star, LogOut,
    Sparkles, TrendingUp, ChevronRight, Moon, Sun, Hash, Hand, Scan
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div style={{
        background: '#0f0f14', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 16, padding: '1.25rem 1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        transition: 'border-color 0.2s',
    }}
        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
        onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
    >
        <div style={{ width: 36, height: 36, background: `rgba(${color}, 0.1)`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={17} style={{ color: `rgb(${color})` }} />
        </div>
        <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#8a8aa8' }}>{label}</div>
    </div>
);

const QuickLink = ({ icon, label, desc, link }) => (
    <Link to={link} style={{
        background: '#0f0f14', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 14, padding: '1.25rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
        textDecoration: 'none', transition: 'all 0.2s',
    }}
        onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'; e.currentTarget.style.background = 'rgba(212,175,55,0.02)'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.background = '#0f0f14'; }}
    >
        <div style={{ width: 44, height: 44, background: 'rgba(212,175,55,0.08)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
            {icon}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
            <div style={{ fontSize: '0.75rem', color: '#8a8aa8', marginTop: '0.15rem' }}>{desc}</div>
        </div>
        <ChevronRight size={16} color="#8a8aa8" />
    </Link>
);

const TABS = ['overview', 'reports', 'transactions', 'upgrade'];

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [tab, setTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, reportsRes, txRes] = await Promise.all([
                    axios.get('/user/profile'),
                    axios.get('/user/reports'),
                    axios.get('/payment/transactions'),
                ]);
                setUser(profileRes.data.user);
                setReports(reportsRes.data.reports);
                setTransactions(txRes.data.transactions);
            } catch (err) {
                toast.error('Session expired. Please log in again.');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const copyRef = () => {
        navigator.clipboard.writeText(user?.referralCode || '');
        toast.success('Referral code copied!');
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }} className="animate-float">🔮</div>
            <div style={{ color: '#d4af37', fontFamily: 'Outfit', fontWeight: 600 }}>Loading your cosmic profile...</div>
        </div>
    );

    const planBadge = user?.subscription?.plan?.toUpperCase() || 'FREE';

    return (
        <div style={{ minHeight: '100vh', padding: '4rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
            {/* Top header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800 }}>
                            Welcome, <span style={{ color: '#d4af37' }}>{user?.name}</span>
                        </h1>
                        <span className="badge badge-gold">{planBadge}</span>
                    </div>
                    <p style={{ color: '#8a8aa8', fontSize: '0.875rem' }}>Your cosmic command centre</p>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                    <LogOut size={15} /> Logout
                </button>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <StatCard icon={Wallet} label="Wallet Balance" value={`₹${user?.walletBalance || 0}`} color="212,175,55" />
                <StatCard icon={FileText} label="Total Reports" value={reports.length} color="99,102,241" />
                <StatCard icon={CreditCard} label="Transactions" value={transactions.length} color="14,165,233" />
                <StatCard icon={Star} label="Referral Bonus" value={`₹${user?.referralBonus || 0}`} color="34,197,94" />
            </div>

            {/* Referral Banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.06), rgba(124,58,237,0.04))',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: 16, padding: '1.25rem 1.5rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem',
            }}>
                <div>
                    <div style={{ fontSize: '0.72rem', color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Your Referral Code</div>
                    <div style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 900, color: '#d4af37', letterSpacing: '0.1em' }}>{user?.referralCode}</div>
                    <div style={{ fontSize: '0.75rem', color: '#8a8aa8', marginTop: '0.25rem' }}>Earn ₹20 wallet credit for each successful signup</div>
                </div>
                <button onClick={copyRef} className="btn btn-outline" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem', flexShrink: 0 }}>
                    <Copy size={14} /> Copy Code
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 0, marginBottom: '2rem', overflowX: 'auto' }}>
                {TABS.map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: '0.75rem 1.25rem',
                        borderBottom: `2px solid ${tab === t ? '#d4af37' : 'transparent'}`,
                        background: 'none', border: 'none',
                        borderBottomWidth: 2,
                        borderBottomStyle: 'solid',
                        borderBottomColor: tab === t ? '#d4af37' : 'transparent',
                        color: tab === t ? '#d4af37' : '#8a8aa8',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                        textTransform: 'capitalize', fontFamily: 'Inter',
                        transition: 'color 0.2s', whiteSpace: 'nowrap',
                    }}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {tab === 'overview' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    <QuickLink icon="♈" label="Kundali Generator" desc="Generate your Vedic birth chart" link="/kundali" />
                    <QuickLink icon="🌙" label="Daily Horoscope" desc="Read today's cosmic predictions" link="/horoscope" />
                    <QuickLink icon="#" label="Numerology" desc="Decode your life path numbers" link="/numerology" />
                    <QuickLink icon="🖐" label="AI Palm Reading" desc="Upload & analyze your palm" link="/palm-reading" />
                    <QuickLink icon="🔍" label="AI Face Reading" desc="Personality & wealth indicators" link="/face-reading" />
                    <QuickLink icon="✦" label="Upgrade Plan" desc="Access full reports & PDF downloads" link="#" />
                </div>
            )}

            {/* Reports */}
            {tab === 'reports' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {reports.length === 0 ? (
                        <div style={{ background: '#0f0f14', borderRadius: 18, padding: '4rem', textAlign: 'center', color: '#4a4a6a' }}>
                            <FileText size={40} style={{ marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 500 }}>No reports yet. Generate your first reading!</p>
                        </div>
                    ) : (
                        reports.map(r => (
                            <div key={r._id} style={{
                                background: '#0f0f14', border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 14, padding: '1.25rem 1.5rem',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>{r.type} Report</div>
                                    <div style={{ fontSize: '0.75rem', color: '#8a8aa8', marginTop: '0.2rem' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</div>
                                </div>
                                <span className={`badge ${r.isPaid ? 'badge-gold' : ''}`} style={!r.isPaid ? { background: 'rgba(255,255,255,0.04)', color: '#8a8aa8', border: '1px solid rgba(255,255,255,0.06)' } : {}}>
                                    {r.tier?.toUpperCase()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Transactions */}
            {tab === 'transactions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {transactions.length === 0 ? (
                        <div style={{ background: '#0f0f14', borderRadius: 18, padding: '4rem', textAlign: 'center', color: '#4a4a6a' }}>
                            <CreditCard size={40} style={{ marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 500 }}>No transactions yet.</p>
                        </div>
                    ) : (
                        transactions.map(t => (
                            <div key={t._id} style={{
                                background: '#0f0f14', border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 14, padding: '1.25rem 1.5rem',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.description || t.type}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#8a8aa8', marginTop: '0.2rem' }}>{new Date(t.createdAt).toLocaleDateString('en-IN')}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'Outfit', fontWeight: 700, color: '#d4af37' }}>₹{t.amount}</div>
                                    <div style={{ fontSize: '0.72rem', color: t.status === 'success' ? '#22c55e' : '#f59e0b', textTransform: 'capitalize' }}>{t.status}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Upgrade */}
            {tab === 'upgrade' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                    {[
                        {
                            name: 'Mini Report', price: '₹11', plan: 'mini', badge: null,
                            features: ['One detailed report', '7-day access', 'PDF download']
                        },
                        {
                            name: 'Full Report', price: '₹21', plan: 'full', badge: 'Popular',
                            features: ['All reports', '30-day access', 'PDF downloads', 'Career & love analysis', 'Vedic remedies']
                        },
                        {
                            name: 'Premium Bundle', price: '₹51', plan: 'premium', badge: 'Best Value',
                            features: ['Everything in Full', 'AI Palm + Face reading', 'Gemstone guide', 'VIP support', '2026 predictions']
                        },
                    ].map(p => (
                        <div key={p.plan} style={{
                            background: p.badge === 'Popular' ? 'rgba(212,175,55,0.04)' : '#0f0f14',
                            border: `1.5px solid ${p.badge === 'Popular' ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.06)'}`,
                            borderRadius: 20, padding: '2rem',
                            display: 'flex', flexDirection: 'column', gap: '1.25rem',
                            position: 'relative',
                        }}>
                            {p.badge && (
                                <div className="badge badge-gold" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>{p.badge}</div>
                            )}
                            <div>
                                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{p.name}</div>
                                <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 900, color: p.badge === 'Popular' ? '#d4af37' : '#f0f0f8' }}>{p.price}</div>
                            </div>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                                {p.features.map(f => (
                                    <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: '#c0c0d8' }}>
                                        <span style={{ color: '#d4af37', flexShrink: 0 }}>✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Choose {p.name}</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
