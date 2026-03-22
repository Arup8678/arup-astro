import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, MapPin, User, Download, Unlock, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Icon size={13} color="#d4af37" /> {label}
        </label>
        <input type={type} required={required} placeholder={placeholder} value={value} onChange={onChange} />
    </div>
);

const Kundali = () => {
    const location = useLocation();
    const [formData, setFormData] = useState(location.state || { name: '', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const lang = localStorage.getItem('lang') || 'en';
            const { data } = await axios.post('/kundali/generate', { ...formData, language: lang });
            setResult(data.kundali);
            toast.success('Kundali Generated Successfully!');
        } catch (err) {
            toast.error('Failed to generate Kundali. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state && location.state.name && location.state.dateOfBirth) {
            handleSubmit();
        }
    }, []);

    const update = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1.5rem 4rem', maxWidth: 1100, margin: '0 auto' }}>
            <div className="animate-fade page-header">
                <div className="badge badge-gold" style={{ marginBottom: '1rem' }}><Star size={11} /> Vedic Astrology</div>
                <h1>Vedic <span className="glow-text">Kundali</span> Generator</h1>
                <p>Enter your precise birth details to generate your Vedic birth chart and reveal your planetary positions.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {/* Form */}
                <div className="animate-fade" style={{
                    background: '#0f0f14',
                    border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: 22,
                    padding: '2.5rem',
                }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.75rem', color: '#d4af37' }}>Birth Details</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <InputField label="Full Name" icon={User} value={formData.name} onChange={update('name')} placeholder="Your full name" required />
                        <InputField label="Date of Birth" icon={Calendar} type="date" value={formData.dateOfBirth} onChange={update('dateOfBirth')} required />
                        <InputField label="Time of Birth" icon={Clock} type="time" value={formData.timeOfBirth} onChange={update('timeOfBirth')} required />
                        <InputField label="Place of Birth" icon={MapPin} value={formData.placeOfBirth} onChange={update('placeOfBirth')} placeholder="City, Country" required />
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                            {loading ? (
                                <span>⟳ Calculating Celestial Bodies...</span>
                            ) : 'Generate My Kundali ✦'}
                        </button>
                    </form>
                    <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#4a4a6a', textAlign: 'center' }}>
                        🔒 Your data is encrypted and never shared.
                    </p>
                </div>

                {/* Result */}
                <div>
                    {!result ? (
                        <div style={{
                            background: '#0f0f14',
                            border: '2px dashed rgba(255,255,255,0.06)',
                            borderRadius: 22, padding: '4rem 2rem',
                            textAlign: 'center', color: '#4a4a6a',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♈</div>
                            <p style={{ fontWeight: 500 }}>Your cosmic report will appear here after calculation.</p>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Results typically take 2–5 seconds.</p>
                        </div>
                    ) : (
                        <div className="animate-fade" style={{
                            background: '#0f0f14',
                            border: '1px solid rgba(212,175,55,0.18)',
                            borderRadius: 22,
                            padding: '2.5rem',
                            display: 'flex', flexDirection: 'column', gap: '1.25rem',
                        }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{result.name}'s Chart</h2>
                                    <span className="badge badge-gold">{result.lagnaChart?.ascendant} Ascendant</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: 'Outfit', fontSize: '2.25rem', fontWeight: 900, color: '#d4af37', lineHeight: 1 }}>{result.compatibilityScore}%</div>
                                    <div style={{ fontSize: '0.68rem', color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>Cosmic Score</div>
                                </div>
                            </div>

                            {/* Dasha */}
                            <div className="result-section">
                                <div className="result-section-label">Current Dasha Period</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem' }}>{result.dasha?.current}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#8a8aa8', marginTop: '0.2rem' }}>Mahadasha</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.2rem' }}>{result.dasha?.subDasha}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#8a8aa8', marginTop: '0.2rem' }}>Antardasha</div>
                                    </div>
                                </div>
                            </div>

                            {/* Planets */}
                            <div>
                                <div className="result-section-label" style={{ marginBottom: '0.75rem' }}>Planet Positions</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.6rem' }}>
                                    {Object.entries(result.planetPositions || {}).map(([planet, sign]) => (
                                        <div key={planet} style={{
                                            background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.04)',
                                            borderRadius: 10, padding: '0.75rem',
                                        }}>
                                            <div style={{ fontSize: '0.65rem', color: '#8a8aa8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{planet}</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.2rem' }}>{sign}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Free summary */}
                            <div style={{
                                background: 'rgba(212,175,55,0.04)',
                                border: '1px solid rgba(212,175,55,0.15)',
                                borderRadius: 12, padding: '1.25rem',
                            }}>
                                <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: '#c0c0d8', lineHeight: 1.75 }}>{result.freeSummary}</p>
                            </div>

                            {/* CTA */}
                            {!result.fullReport ? (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(212,175,55,0.05))',
                                    border: '1px solid rgba(212,175,55,0.2)',
                                    borderRadius: 14, padding: '1.5rem', textAlign: 'center',
                                }}>
                                    <Unlock size={20} color="#d4af37" style={{ marginBottom: '0.75rem' }} />
                                    <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, marginBottom: '0.5rem' }}>Unlock Premium Insights</h4>
                                    <p style={{ fontSize: '0.8rem', color: '#8a8aa8', marginBottom: '1rem' }}>
                                        Get your detailed career, relationship, and health report with Vedic remedies.
                                    </p>
                                    <Link to="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                                        Full Report ₹99
                                    </Link>
                                </div>
                            ) : (
                                <button className="btn btn-outline" style={{ width: '100%', padding: '0.875rem' }}>
                                    <Download size={16} /> Download Full PDF
                                </button>
                            )}

                            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#4a4a6a', fontStyle: 'italic' }}>
                                For entertainment and personal insight only.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kundali;
