import React, { useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Upload, Hand, Unlock, ShieldCheck } from 'lucide-react';

const PalmReading = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a palm image.');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('palmImage', file);
            const { data } = await axios.post('/ai/palm', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data.result);
            toast.success('Palm analysis complete!');
        } catch (err) {
            toast.error('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1.5rem 4rem', maxWidth: 1000, margin: '0 auto' }}>
            <div className="animate-fade page-header">
                <div className="badge badge-purple" style={{ marginBottom: '1rem' }}><Hand size={11} /> AI Analysis</div>
                <h1>AI <span className="glow-text">Palm Reading</span></h1>
                <p>Upload a clear photo of your palm and let our AI decode the secrets written in your lines.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {/* Upload Card */}
                <div className="animate-fade" style={{
                    background: '#0f0f14', border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: 22, padding: '2.5rem',
                    display: 'flex', flexDirection: 'column', gap: '1.25rem',
                }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700, color: '#d4af37' }}>Upload Palm Image</h3>

                    <div
                        onClick={() => document.getElementById('palmInput').click()}
                        style={{
                            border: `2px dashed ${preview ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 16, padding: '2.5rem 1.5rem',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                            minHeight: 200,
                            background: preview ? 'rgba(212,175,55,0.03)' : 'transparent',
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = preview ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.08)'}
                    >
                        {preview ? (
                            <img src={preview} alt="Palm preview" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 10 }} />
                        ) : (
                            <>
                                <div style={{ width: 56, height: 56, background: 'rgba(212,175,55,0.06)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Hand size={26} color="#d4af37" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, color: '#c0c0d8', fontSize: '0.9rem' }}>Click to upload your palm image</p>
                                    <p style={{ fontSize: '0.75rem', color: '#4a4a6a', marginTop: '0.3rem' }}>JPEG, PNG, WebP — max 5MB</p>
                                </div>
                            </>
                        )}
                    </div>
                    <input id="palmInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        className="btn btn-primary" style={{ width: '100%', padding: '0.9rem', opacity: (!file && !loading) ? 0.5 : 1 }}
                    >
                        {loading ? '⟳ Analyzing Lines...' : <><Upload size={16} /> Analyze My Palm</>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <ShieldCheck size={14} color="#22c55e" />
                        <p style={{ fontSize: '0.75rem', color: '#4a4a6a' }}>Your image is securely stored and never shared.</p>
                    </div>

                    {/* Guide tips */}
                    <div style={{ background: '#07070a', borderRadius: 12, padding: '1rem', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 600, color: '#8a8aa8', marginBottom: '0.6rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tips for best results</div>
                        {['Use natural lighting', 'Open palm, fingers slightly apart', 'Clear, focused image', 'Dominant hand preferred'].map(tip => (
                            <div key={tip} style={{ color: '#4a4a6a', marginBottom: '0.3rem' }}>• {tip}</div>
                        ))}
                    </div>
                </div>

                {/* Result */}
                {result ? (
                    <div className="animate-fade" style={{
                        background: '#0f0f14', border: '1px solid rgba(212,175,55,0.15)',
                        borderRadius: 22, padding: '2.5rem',
                        display: 'flex', flexDirection: 'column', gap: '1.25rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800 }}>Reading Complete</h2>
                            <span className="badge badge-gold">{result.overallScore}% Clarity</span>
                        </div>

                        <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1.25rem' }}>
                            <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: '#c0c0d8', lineHeight: 1.75 }}>{result.freeSummary}</p>
                        </div>

                        <div className="result-section">
                            <div className="result-section-label">Life Line</div>
                            <p style={{ fontSize: '0.875rem', color: '#c0c0d8', lineHeight: 1.7 }}>{result.lifeLine}</p>
                        </div>

                        {result.fullAnalysis ? (
                            <>
                                {[
                                    { key: 'heartLine', label: 'Heart Line' },
                                    { key: 'headLine', label: 'Head Line' },
                                    { key: 'fateLine', label: 'Fate Line' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="result-section">
                                        <div className="result-section-label">{label}</div>
                                        <p style={{ fontSize: '0.875rem', color: '#c0c0d8', lineHeight: 1.7 }}>{result.fullAnalysis[key]}</p>
                                    </div>
                                ))}
                                <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1.25rem' }}>
                                    <div style={{ fontSize: '0.72rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', fontWeight: 700 }}>Remedies</div>
                                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        {result.fullAnalysis.remedies?.map((r, i) => (
                                            <li key={i} style={{ fontSize: '0.875rem', color: '#c0c0d8' }}>• {r}</li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(212,175,55,0.05))',
                                border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, padding: '1.5rem', textAlign: 'center',
                            }}>
                                <Unlock size={18} color="#d4af37" style={{ marginBottom: '0.75rem' }} />
                                <p style={{ fontSize: '0.8rem', color: '#8a8aa8', marginBottom: '1rem' }}>{result.premiumPrompt}</p>
                                <a href="/dashboard" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                                    Full Palm Report ₹49
                                </a>
                            </div>
                        )}

                        <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#4a4a6a', fontStyle: 'italic' }}>
                            For entertainment and personal insight purposes only.
                        </p>
                    </div>
                ) : (
                    <div style={{
                        background: '#0f0f14', border: '2px dashed rgba(255,255,255,0.06)',
                        borderRadius: 22, padding: '5rem 2rem',
                        textAlign: 'center', color: '#4a4a6a',
                    }}>
                        <Hand size={40} style={{ marginBottom: '1rem' }} />
                        <p style={{ fontWeight: 500 }}>Your palm reading analysis will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PalmReading;
