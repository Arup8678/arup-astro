import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/auth/login', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Welcome back to Quantum Within!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1.5rem',
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.12), transparent), #07070a',
            position: 'relative', overflow: 'hidden',
        }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#0f0f14', color: '#f0f0f8', border: '1px solid rgba(212,175,55,0.2)' } }} />

            {/* Orbs */}
            <div style={{ position: 'absolute', top: '20%', left: '5%', width: 300, height: 300, background: 'rgba(124,58,237,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '5%', width: 250, height: 250, background: 'rgba(212,175,55,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <div className="animate-fade" style={{
                background: '#0f0f14',
                border: '1px solid rgba(212,175,55,0.15)',
                borderRadius: 24,
                padding: '3rem 2.5rem',
                width: '100%', maxWidth: 420,
                position: 'relative',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 56, height: 56, margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                        borderRadius: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(212,175,55,0.3)',
                    }}>
                        <Sparkles size={24} color="#07070a" />
                    </div>
                    <h1 style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Welcome Back</h1>
                    <p style={{ color: '#8a8aa8', fontSize: '0.875rem' }}>Continue your cosmic journey</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email Address</label>
                        <input
                            type="email" required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.78rem', color: '#d4af37' }}>Forgot Password?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'} required
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a8aa8', padding: 4 }}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin-slow 0.6s linear infinite', display: 'inline-block' }} />
                                Initializing...
                            </span>
                        ) : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Unlock Dashboard <ArrowRight size={16} /></span>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#8a8aa8' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#d4af37', fontWeight: 700 }}>Begin your journey →</Link>
                    </p>
                </div>

                {/* Disclaimer */}
                <p style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: '#4a4a6a', textAlign: 'center', lineHeight: 1.6 }}>
                    By continuing, you agree to our Terms & Conditions and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default Login;
