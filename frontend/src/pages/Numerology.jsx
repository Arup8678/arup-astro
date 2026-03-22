import React, { useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Hash, User, Calendar, Unlock } from 'lucide-react';

const Numerology = () => {
    const [formData, setFormData] = useState({ fullName: '', dateOfBirth: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post('/numerology/calculate', formData);
            setResult(data.result);
            toast.success('Numerology calculated!');
        } catch (err) {
            toast.error('Failed to calculate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const NUM_CARDS = [
        { key: 'lifePathNumber', label: 'Life Path', desc: 'Your core purpose' },
        { key: 'destinyNumber', label: 'Destiny', desc: 'Your life mission' },
        { key: 'personalityNumber', label: 'Personality', desc: 'How others see you' },
        { key: 'luckyNumber', label: 'Lucky', desc: 'Your fortune number' },
    ];

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1.5rem 4rem', maxWidth: 1000, margin: '0 auto' }}>
            <div className="animate-fade page-header">
                <div className="badge badge-gold" style={{ marginBottom: '1rem' }}><Hash size={11} /> Sacred Numbers</div>
                <h1><span className="glow-text">Numerology</span> Calculator</h1>
                <p>Discover the sacred numbers hidden in your name and birth date using the ancient Pythagorean system.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {/* Form */}
                <div className="animate-fade" style={{
                    background: '#0f0f14', border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: 22, padding: '2.5rem',
                }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700, color: '#d4af37', marginBottom: '1.75rem' }}>Your Details</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                                <User size={13} color="#d4af37" /> Full Name
                            </label>
                            <input type="text" required placeholder="As per birth certificate"
                                value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                            <p style={{ fontSize: '0.72rem', color: '#4a4a6a', marginTop: '0.35rem' }}>Use your full name for accurate results</p>
                        </div>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                                <Calendar size={13} color="#d4af37" /> Date of Birth
                            </label>
                            <input type="date" required value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                        </div>
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}>
                            {loading ? '⟳ Decoding Cosmic Numbers...' : 'Reveal My Numbers ✦'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                {result ? (
                    <div className="animate-fade" style={{
                        background: '#0f0f14', border: '1px solid rgba(212,175,55,0.15)',
                        borderRadius: 22, padding: '2.5rem',
                        display: 'flex', flexDirection: 'column', gap: '1.25rem',
                    }}>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800 }}>{formData.fullName}'s Numbers</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {NUM_CARDS.map(({ key, label, desc }) => (
                                <div key={key} style={{
                                    background: '#07070a', border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: 14, padding: '1.25rem', textAlign: 'center',
                                }}>
                                    <div style={{ fontFamily: 'Outfit', fontSize: '2.5rem', fontWeight: 900, color: '#d4af37', lineHeight: 1 }}>{result[key]}</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.4rem' }}>{label}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#8a8aa8', marginTop: '0.2rem' }}>{desc}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1.25rem' }}>
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Life Path Meaning</div>
                            <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: '#c0c0d8' }}>{result.lifePathMeaning}</p>
                        </div>

                        <div style={{ background: '#07070a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                            <div style={{ fontSize: '2rem', flexShrink: 0 }}>🎨</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{result.luckyColor}</div>
                                <div style={{ fontSize: '0.72rem', color: '#8a8aa8' }}>Your Lucky Color</div>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: '#8a8aa8', fontStyle: 'italic' }}>{result.freeSummary}</p>

                        {!result.fullReport && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(212,175,55,0.05))',
                                border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, padding: '1.5rem', textAlign: 'center',
                            }}>
                                <Unlock size={18} color="#d4af37" style={{ marginBottom: '0.75rem' }} />
                                <p style={{ fontSize: '0.8rem', color: '#8a8aa8', marginBottom: '1rem' }}>{result.premiumPrompt}</p>
                                <a href="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                                    Full Numerology Report ₹99
                                </a>
                            </div>
                        )}

                        {result.fullReport && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {[
                                    { key: 'careerInsights', label: 'Career Insights' },
                                    { key: 'yearPrediction', label: '2026 Prediction' },
                                ].map(item => result.fullReport[item.key] && (
                                    <div key={item.key} className="result-section">
                                        <div className="result-section-label">{item.label}</div>
                                        <p style={{ fontSize: '0.875rem', color: '#c0c0d8' }}>{result.fullReport[item.key]}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#4a4a6a', fontStyle: 'italic' }}>
                            For entertainment purposes only. Not a substitute for professional advice.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        background: '#0f0f14', border: '2px dashed rgba(255,255,255,0.06)',
                        borderRadius: 22, padding: '5rem 2rem',
                        textAlign: 'center', color: '#4a4a6a',
                    }}>
                        <Hash size={40} style={{ marginBottom: '1rem' }} />
                        <p style={{ fontWeight: 500 }}>Your numerology report will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Numerology;
