import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast, Toaster } from 'react-hot-toast';
import { Users, FileText, CreditCard, BarChart3, ToggleLeft, ToggleRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || user.role !== 'admin') return <Navigate to="/" />;

    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [tab, setTab] = useState('dashboard');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [dashRes, usersRes, reportsRes, txRes] = await Promise.all([
                    axios.get('/admin/dashboard'),
                    axios.get('/admin/users'),
                    axios.get('/admin/reports'),
                    axios.get('/admin/transactions'),
                ]);
                setStats(dashRes.data.stats);
                setUsers(usersRes.data.users);
                setReports(reportsRes.data.reports);
                setTransactions(txRes.data.transactions);
            } catch (err) {
                toast.error('Failed to load admin data.');
            }
        };
        fetchAll();
    }, []);

    const toggleUser = async (id) => {
        try {
            const res = await axios.patch(`/admin/users/${id}/status`);
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.user.isActive } : u));
            toast.success(res.data.message);
        } catch { toast.error('Action failed'); }
    };

    return (
        <div className="min-h-screen py-12 px-6 max-w-7xl mx-auto">
            <Toaster position="top-right" />
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold">Admin <span className="text-primary">Control Panel</span></h1>
                    <p className="text-text-dim mt-1">Quantum Within — Platform Management</p>
                </div>
                <span className="bg-primary/10 text-primary border border-primary/30 text-xs font-bold px-4 py-2 rounded-full">ADMIN</span>
            </div>

            {/* Stat Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { icon: Users, label: 'Total Users', value: stats.totalUsers },
                        { icon: FileText, label: 'Total Reports', value: stats.totalReports },
                        { icon: CreditCard, label: 'Transactions', value: stats.totalTransactions },
                        { icon: BarChart3, label: 'Revenue', value: `₹${stats.totalRevenue}` },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="glass mystical-border p-5 rounded-xl">
                            <Icon size={20} className="text-primary mb-2" />
                            <div className="text-3xl font-black">{value}</div>
                            <div className="text-xs text-text-dim mt-1">{label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-800 pb-2">
                {['dashboard', 'users', 'reports', 'transactions'].map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 ${tab === t ? 'border-primary text-primary' : 'border-transparent text-text-dim hover:text-text-main'
                            }`}
                        style={{ background: 'none' }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Users Tab */}
            {tab === 'users' && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse glass rounded-xl overflow-hidden text-sm">
                        <thead>
                            <tr style={{ background: 'rgba(212,175,55,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th className="p-4 text-left text-text-dim font-semibold">Name</th>
                                <th className="p-4 text-left text-text-dim font-semibold">Email</th>
                                <th className="p-4 text-left text-text-dim font-semibold">Plan</th>
                                <th className="p-4 text-left text-text-dim font-semibold">Wallet</th>
                                <th className="p-4 text-left text-text-dim font-semibold">Joined</th>
                                <th className="p-4 text-left text-text-dim font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                    <td className="p-4 font-medium">{u.name}</td>
                                    <td className="p-4 text-text-dim">{u.email}</td>
                                    <td className="p-4"><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{u.subscription?.plan}</span></td>
                                    <td className="p-4">₹{u.walletBalance}</td>
                                    <td className="p-4 text-text-dim">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button onClick={() => toggleUser(u._id)} className="bg-transparent border-none cursor-pointer">
                                            {u.isActive
                                                ? <ToggleRight size={22} className="text-green-500" />
                                                : <ToggleLeft size={22} className="text-gray-600" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reports Tab */}
            {tab === 'reports' && (
                <div className="flex flex-col gap-3">
                    {reports.map(r => (
                        <div key={r._id} className="glass p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                            <div>
                                <div className="font-bold capitalize">{r.type} — {r.tier}</div>
                                <div className="text-xs text-text-dim">{r.user?.name} ({r.user?.email})</div>
                            </div>
                            <div className="text-xs text-text-dim">{new Date(r.createdAt).toLocaleDateString()}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Transactions Tab */}
            {tab === 'transactions' && (
                <div className="flex flex-col gap-3">
                    {transactions.map(t => (
                        <div key={t._id} className="glass p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                            <div>
                                <div className="font-bold">{t.description || t.type}</div>
                                <div className="text-xs text-text-dim">{t.user?.name} — {t.razorpayOrderId?.slice(0, 16) || 'N/A'}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-primary">₹{t.amount}</div>
                                <div className={`text-xs ${t.status === 'success' ? 'text-green-500' : 'text-yellow-500'}`}>{t.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {tab === 'dashboard' && (
                <div className="glass p-8 rounded-2xl text-center">
                    <p className="text-text-dim mb-4">Platform overview stats shown above. Switch tabs to manage users, reports, and payments.</p>
                    <p className="text-xs text-text-dim italic">Total revenue includes only completed purchase transactions.</p>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
