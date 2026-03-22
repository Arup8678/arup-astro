import React, { useState } from 'react';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { Scan, Upload, Unlock, ShieldCheck } from 'lucide-react';

const FaceReading = () => {
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

    const handleSubmit = async () => {
        if (!file) return toast.error('Please select a face image.');
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('faceImage', file);
            const { data } = await axios.post('/ai/face', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(data.result);
            toast.success('Face analysis complete!');
        } catch (err) {
            toast.error('Analysis failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '5rem 1.5rem 4rem', maxWidth: 1000, margin: '0 auto' }}>
            <div className="animate-fade page-header">
                <div className="badge badge-purple" style={{ marginBottom: '1rem' }}><Scan size={11} /> AI Analysis</div>
                <h1>AI <span className="glow-text">Face Reading</span></h1>
                <p>Upload a clear frontal photo. Our AI decodes personality, leadership, and wealth indicators from your facial features.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                {/* Upload Card */}
                <div className="animate-fade" style={{
                    background: '#0f0f14', border: '1px solid rgba(212,175,55,0.15)',
                    borderRadius: 22, padding: '2.5rem',
                    display: 'flex', flexDirection: 'column', gap: '1.25rem',
                }}>
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700, color: '#d4af37' }}>Upload Face Photo</h3>

                    <div
                        onClick={() => document.getElementById('faceInput').click()}
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
                            <img src={preview} alt="Face preview" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 10 }} />
                        ) : (
                            <>
                                <div style={{ width: 56, height: 56, background: 'rgba(124,58,237,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Scan size={26} color="#a78bfa" />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 600, color: '#c0c0d8', fontSize: '0.9rem' }}>Click to upload your face photo</p>
                                    <p style={{ fontSize: '0.75rem', color: '#4a4a6a', marginTop: '0.3rem' }}>Clear, front-facing, well-lit image</p>
                                </div>
                            </>
                        )}
                    </div>
                    <input id="faceInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

                    <button onClick={handleSubmit} disabled={loading || !file} className="btn btn-primary"
                        style={{ width: '100%', padding: '0.9rem', opacity: (!file && !loading) ? 0.5 : 1 }}>
                        {loading ? '⟳ Scanning Features...' : <><Scan size={16} /> Analyze My Face</>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                        <ShieldCheck size={14} color="#22c55e" />
                        <p style={{ fontSize: '0.75rem', color: '#4a4a6a' }}>Your image is kept private and secure.</p>
                    </div>

                    <div style={{ background: '#07070a', borderRadius: 12, padding: '1rem', fontSize: '0.8rem' }}>
                        <div style={{ fontWeight: 600, color: '#8a8aa8', marginBottom: '0.6rem', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Best Results</div>
                        {['Front-facing photo', 'Good natural lighting', 'Neutral expression', 'No heavy filters'].map(tip => (
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
                            <span className="badge badge-purple">{result.faceShape} Face</span>
                        </div>

                        <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1.25rem' }}>
                            <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: '#c0c0d8', lineHeight: 1.75 }}>{result.freeSummary}</p>
                        </div>

                        {/* Leadership score bar */}
                        <div className="result-section">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div className="result-section-label" style={{ marginBottom: 0 }}>Leadership Score</div>
                                <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.9rem' }}>{result.leadershipScore}%</span>
                            </div>
                            <div style={{ height: 8, background: '#07070a', borderRadius: 999, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${result.leadershipScore}%`,
                                    background: 'linear-gradient(90deg, #7c3aed, #d4af37)',
                                    borderRadius: 999, transition: 'width 1s ease',
                                }} />
                            </div>
                        </div>

                        {result.fullAnalysis ? (
                            <>
                                {[
                                    { key: 'eyes', label: 'Eyes' },
                                    { key: 'nose', label: 'Nose' },
                                    { key: 'forehead', label: 'Forehead' },
                                    { key: 'smile', label: 'Smile' },
                                ].map(({ key, label }) => (
                                    <div key={key} className="result-section">
                                        <div className="result-section-label">{label}</div>
                                        <p style={{ fontSize: '0.875rem', color: '#c0c0d8', lineHeight: 1.7 }}>{result.fullAnalysis[key]}</p>
                                    </div>
                                ))}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Wealth Indicator', value: result.fullAnalysis.wealthIndicator },
                                        { label: 'Spirituality', value: `${result.fullAnalysis.spiritualityScore}%` },
                                    ].map(item => (
                                        <div key={item.label} style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.15rem', color: '#d4af37' }}>{item.value}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#8a8aa8', marginTop: '0.25rem' }}>{item.label}</div>
                                        </div>
                                    ))}
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
                                    Full Face Report ₹49
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
                        <Scan size={40} style={{ marginBottom: '1rem' }} />
                        <p style={{ fontWeight: 500 }}>Your face reading analysis will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FaceReading;
