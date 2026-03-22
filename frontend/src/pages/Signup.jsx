import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Sparkles, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', referralCode: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/auth/register', formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Welcome to Quantum Within! Your journey begins.');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const perks = ['Free Kundali generation', 'Daily horoscope access', 'Numerology calculator', 'AI reading previews'];

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem 1.5rem',
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(124,58,237,0.12), transparent), #07070a',
            position: 'relative', overflow: 'hidden',
        }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#0f0f14', color: '#f0f0f8', border: '1px solid rgba(212,175,55,0.2)' } }} />

            <div style={{ position: 'absolute', top: '20%', right: '10%', width: 280, height: 280, background: 'rgba(124,58,237,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '15%', left: '8%', width: 220, height: 220, background: 'rgba(212,175,55,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', maxWidth: 860, width: '100%', alignItems: 'start' }}>
                {/* Benefits panel */}
                <div className="animate-fade" style={{ padding: '1rem 0' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        marginBottom: '2rem',
                    }}>
                        <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg,#d4af37,#b8860b)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={18} color="#07070a" />
                        </div>
                        <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>QUANTUM WITHIN</span>
                    </div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                        Join <span className="glow-text">50,000+</span> cosmic seekers today.
                    </h2>
                    <p style={{ color: '#8a8aa8', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                        Create your free account and unlock the mysteries written in the stars, your palm lines, and the numbers of your birth.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {perks.map(perk => (
                            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <CheckCircle size={17} color="#d4af37" />
                                <span style={{ color: '#c0c0d8', fontSize: '0.875rem' }}>{perk}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="animate-fade stagger-2" style={{
                    background: '#0f0f14',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: 24,
                    padding: '2.5rem 2rem',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
                }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.35rem', textAlign: 'center' }}>Create Account</h3>
                    <p style={{ color: '#8a8aa8', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.75rem' }}>Free forever — upgrade when ready</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Full Name</label>
                            <input type="text" required placeholder="Arjun Sharma"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Email Address</label>
                            <input type="email" required placeholder="name@example.com"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Password (min. 6 chars)</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPass ? 'text' : 'password'} required minLength={6} placeholder="Create a strong password"
                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    style={{ paddingRight: '3rem' }} />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a8aa8', padding: 4 }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Referral Code <span style={{ fontWeight: 400, textTransform: 'none', color: '#4a4a6a' }}>(Optional)</span></label>
                            <input type="text" placeholder="e.g. XJ492K"
                                value={formData.referralCode} onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })} />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                            {loading ? 'Creating Profile...' : <><span>Create Free Account</span> <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.855rem', color: '#8a8aa8' }}>
                        Already have an account? <Link to="/login" style={{ color: '#d4af37', fontWeight: 700 }}>Sign in</Link>
                    </p>
                    <p style={{ marginTop: '1rem', fontSize: '0.68rem', color: '#4a4a6a', textAlign: 'center', lineHeight: 1.6 }}>
                        By signing up you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
