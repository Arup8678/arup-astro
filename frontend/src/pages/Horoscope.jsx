import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Moon, Sun, Star } from 'lucide-react';

const SIGNS = [
    { id: 'aries', name: 'Aries', symbol: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire' },
    { id: 'taurus', name: 'Taurus', symbol: '♉', dates: 'Apr 20 – May 20', element: 'Earth' },
    { id: 'gemini', name: 'Gemini', symbol: '♊', dates: 'May 21 – Jun 20', element: 'Air' },
    { id: 'cancer', name: 'Cancer', symbol: '♋', dates: 'Jun 21 – Jul 22', element: 'Water' },
    { id: 'leo', name: 'Leo', symbol: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire' },
    { id: 'virgo', name: 'Virgo', symbol: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth' },
    { id: 'libra', name: 'Libra', symbol: '♎', dates: 'Sep 23 – Oct 22', element: 'Air' },
    { id: 'scorpio', name: 'Scorpio', symbol: '♏', dates: 'Oct 23 – Nov 21', element: 'Water' },
    { id: 'sagittarius', name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire' },
    { id: 'capricorn', name: 'Capricorn', symbol: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth' },
    { id: 'aquarius', name: 'Aquarius', symbol: '♒', dates: 'Jan 20 – Feb 18', element: 'Air' },
    { id: 'pisces', name: 'Pisces', symbol: '♓', dates: 'Feb 19 – Mar 20', element: 'Water' },
];

const ELEMENT_COLORS = { Fire: '#ef4444', Earth: '#22c55e', Air: '#60a5fa', Water: '#8b5cf6' };

const Horoscope = () => {
    const [selectedSign, setSelectedSign] = useState('');
    const [period, setPeriod] = useState('daily');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchHoroscope = async () => {
        if (!selectedSign) return;
        setLoading(true);
        setResult(null);
        try {
            const lang = localStorage.getItem('lang') || 'en';
            const { data } = await axios.get(`/horoscope/${selectedSign}/${period}?language=${lang}`);
            setResult(data);
        } catch (err) {
            toast.error('Could not fetch horoscope. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedSign) fetchHoroscope();
    }, [selectedSign, period]);

    const signObj = SIGNS.find(s => s.id === selectedSign);

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1.5rem 4rem', maxWidth: 1100, margin: '0 auto' }}>
            {/* Header */}
            <div className="animate-fade page-header">
                <div className="badge badge-gold" style={{ marginBottom: '1rem' }}><Moon size={11} /> Cosmic Readings</div>
                <h1>Daily <span className="glow-text">Horoscope</span></h1>
                <p>Select your zodiac sign and discover what the cosmos has aligned for you today.</p>
            </div>

            {/* Period Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
                {['daily', 'weekly', 'monthly'].map(p => (
                    <button key={p} onClick={() => setPeriod(p)} style={{
                        padding: '0.5rem 1.5rem',
                        borderRadius: 999,
                        border: `1.5px solid ${period === p ? '#d4af37' : 'rgba(255,255,255,0.08)'}`,
                        background: period === p ? 'rgba(212,175,55,0.1)' : 'transparent',
                        color: period === p ? '#d4af37' : '#8a8aa8',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                        textTransform: 'capitalize', transition: 'all 0.2s',
                        fontFamily: 'Inter',
                    }}>
                        {p}
                    </button>
                ))}
            </div>

            {/* Zodiac Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '3rem' }}>
                {SIGNS.map(sign => {
                    const isSelected = selectedSign === sign.id;
                    const elemColor = ELEMENT_COLORS[sign.element];
                    return (
                        <button key={sign.id} onClick={() => setSelectedSign(sign.id)} style={{
                            background: isSelected ? 'rgba(212,175,55,0.06)' : '#0f0f14',
                            border: `1.5px solid ${isSelected ? '#d4af37' : 'rgba(255,255,255,0.05)'}`,
                            borderRadius: 14,
                            padding: '1rem 0.5rem',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'Inter',
                            boxShadow: isSelected ? '0 4px 20px rgba(212,175,55,0.15)' : 'none',
                        }}>
                            <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{sign.symbol}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isSelected ? '#d4af37' : '#f0f0f8' }}>{sign.name}</span>
                            <span style={{ fontSize: '0.6rem', color: '#4a4a6a', textAlign: 'center', lineHeight: 1.3 }}>{sign.dates}</span>
                            <span style={{ fontSize: '0.6rem', color: elemColor, fontWeight: 600 }}>{sign.element}</span>
                        </button>
                    );
                })}
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#d4af37' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }} className="animate-float">🔮</div>
                    <p style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Reading the stars...</p>
                </div>
            )}

            {/* Result */}
            {result && !loading && signObj && (
                <div className="animate-fade" style={{
                    background: '#0f0f14',
                    border: '1px solid rgba(212,175,55,0.2)',
                    borderRadius: 24,
                    padding: '2.5rem',
                    maxWidth: 760, margin: '0 auto',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}>
                    {/* Sign header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div style={{
                            width: 72, height: 72, borderRadius: '50%',
                            background: `radial-gradient(circle, rgba(212,175,55,0.12), rgba(212,175,55,0.03))`,
                            border: '2px solid rgba(212,175,55,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.25rem', flexShrink: 0,
                        }}>
                            {signObj.symbol}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{result.sign}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span className="badge badge-gold">{result.period} • {result.date}</span>
                                <span style={{ fontSize: '0.72rem', color: ELEMENT_COLORS[signObj.element], fontWeight: 600 }}>{signObj.element} Sign</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { key: 'general', label: 'General', icon: '🌌' },
                            { key: 'love', label: 'Love & Relationships', icon: '❤️' },
                            { key: 'career', label: 'Career & Finance', icon: '💼' },
                            { key: 'health', label: 'Health & Wellness', icon: '🌿' },
                        ].map(({ key, label, icon }) => result[key] && (
                            <div key={key} className="result-section">
                                <div className="result-section-label">{icon} {label}</div>
                                <p style={{ color: '#c0c0d8', fontSize: '0.9rem', lineHeight: 1.75 }}>{result[key]}</p>
                            </div>
                        ))}

                        {result.lucky && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {[
                                    { label: 'Lucky Number', value: result.lucky.number },
                                    { label: 'Lucky Color', value: result.lucky.color },
                                    { label: 'Power Time', value: result.lucky.time },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        background: 'rgba(212,175,55,0.05)',
                                        border: '1px solid rgba(212,175,55,0.15)',
                                        borderRadius: 12, padding: '1rem',
                                        textAlign: 'center',
                                    }}>
                                        <div style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 800, color: '#d4af37' }}>{item.value}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#8a8aa8', marginTop: '0.25rem' }}>{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {result.premiumTease && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(212,175,55,0.05))',
                                border: '1px solid rgba(212,175,55,0.2)',
                                borderRadius: 14, padding: '1.5rem', textAlign: 'center',
                            }}>
                                <Star size={20} color="#d4af37" style={{ marginBottom: '0.75rem' }} />
                                <p style={{ fontSize: '0.875rem', color: '#8a8aa8', marginBottom: '1rem' }}>{result.premiumTease}</p>
                                <a href="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                                    Unlock Premium ₹99
                                </a>
                            </div>
                        )}
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#4a4a6a', marginTop: '1.5rem', fontStyle: 'italic' }}>
                        For entertainment and personal insight only. Not a substitute for professional advice.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Horoscope;
