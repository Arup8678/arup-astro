import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Moon, Star, Sun, Shield, Scan, Wallet, Quote, ChevronDown, CheckCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/* ── Star canvas background ────────────────────────── */
const StarCanvas = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const stars = Array.from({ length: 160 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + 0.2,
            a: Math.random(),
            da: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        }));
        let id;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => {
                s.a = Math.max(0.05, Math.min(1, s.a + s.da));
                if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.a})`;
                ctx.fill();
            });
            id = requestAnimationFrame(draw);
        };
        draw();
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />;
};

/* ── Service Card ──────────────────────────────────── */
const ServiceCard = ({ icon: Icon, title, desc, link, delay }) => (
    <Link to={link} style={{ textDecoration: 'none' }}>
        <div className="animate-fade card-hover" style={{
            animationDelay: `${delay}s`,
            background: '#0f0f14',
            border: '1px solid rgba(212,175,55,0.1)',
            borderRadius: 18,
            padding: '2rem',
            height: '100%',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            cursor: 'pointer',
        }}>
            <div style={{
                width: 48, height: 48,
                background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Icon size={22} color="#d4af37" />
            </div>
            <div>
                <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>{title}</h3>
                <p style={{ color: '#8a8aa8', fontSize: '0.875rem', lineHeight: 1.65 }}>{desc}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#d4af37', fontSize: '0.85rem', fontWeight: 600, marginTop: 'auto' }}>
                Explore <ArrowRight size={14} />
            </div>
        </div>
    </Link>
);

/* ── Testimonial Card ──────────────────────────────── */
const Testimonial = ({ name, sign, text, stars }) => (
    <div style={{
        background: '#0f0f14',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 18,
        padding: '2rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
    }}>
        <Quote size={20} color="rgba(212,175,55,0.5)" />
        <p style={{ color: '#c0c0d8', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic' }}>{text}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: 'auto' }}>
            <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: `linear-gradient(135deg, #7c3aed, #d4af37)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: '#fff',
                flexShrink: 0,
            }}>
                {name[0]}
            </div>
            <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{name}</div>
                <div style={{ color: '#8a8aa8', fontSize: '0.75rem' }}>{sign} • {'⭐'.repeat(stars)}</div>
            </div>
        </div>
    </div>
);

/* ── FAQ Item ──────────────────────────────────────── */
const FAQ = ({ q, a }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <div style={{
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'border-color 0.2s',
            borderColor: open ? 'rgba(212,175,55,0.25)' : undefined,
        }}>
            <button onClick={() => setOpen(!open)} style={{
                width: '100%', padding: '1.2rem 1.5rem',
                background: open ? 'rgba(212,175,55,0.04)' : '#0f0f14',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: 'none', cursor: 'pointer', color: '#f0f0f8',
                fontFamily: 'Inter', fontWeight: 600, fontSize: '0.925rem',
                textAlign: 'left', gap: '1rem',
                transition: 'background 0.2s',
            }}>
                {q}
                <ChevronDown size={18} color="#d4af37" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }} />
            </button>
            {open && (
                <div style={{ padding: '0 1.5rem 1.25rem', color: '#8a8aa8', fontSize: '0.875rem', lineHeight: 1.75, background: '#0f0f14' }}>
                    {a}
                </div>
            )}
        </div>
    );
};

/* ── PricingCard ───────────────────────────────────── */
const PricingCard = ({ name, price, features, highlighted, cta, link }) => (
    <div style={{
        background: highlighted ? 'rgba(212,175,55,0.04)' : '#0f0f14',
        border: `1.5px solid ${highlighted ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 20,
        padding: '2.5rem 2rem',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        position: 'relative', overflow: 'hidden',
        boxShadow: highlighted ? '0 8px 40px rgba(212,175,55,0.12)' : 'none',
    }}>
        {highlighted && (
            <div style={{
                position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                color: '#07070a', fontSize: '0.65rem', fontWeight: 800,
                padding: '0.3rem 1rem', borderRadius: '0 0 10px 10px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>Most Popular</div>
        )}
        <div>
            <div style={{ fontFamily: 'Outfit', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>{name}</div>
            <div style={{ fontSize: '2.5rem', fontFamily: 'Outfit', fontWeight: 900, color: highlighted ? '#d4af37' : '#f0f0f8' }}>{price}</div>
        </div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', flex: 1 }}>
            {features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: '#c0c0d8' }}>
                    <CheckCircle size={15} color="#d4af37" style={{ marginTop: 2, flexShrink: 0 }} />
                    {f}
                </li>
            ))}
        </ul>
        <Link to={link} className={`btn ${highlighted ? 'btn-primary pulse' : 'btn-outline'}`} style={{ textAlign: 'center' }}>
            {cta}
        </Link>
    </div>
);

/* ── Main Home Component ───────────────────────────── */
const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', dateOfBirth: '', timeOfBirth: '', placeOfBirth: '' });

    const handleHoroscopeSubmit = (e) => {
        e.preventDefault();
        navigate('/kundali', { state: formData });
    };

    const services = [
        { icon: Moon, title: 'Daily Horoscope', desc: 'Real-time daily, weekly & monthly zodiac predictions personalized to your sign.', link: '/horoscope', delay: 0.1 },
        { icon: Star, title: 'Kundali Generator', desc: 'Precise Vedic birth charts with planetary positions, dashas & lagna details.', link: '/kundali', delay: 0.2 },
        { icon: Sun, title: 'Numerology', desc: 'Unlock your life path, destiny & personality numbers via the Pythagorean system.', link: '/numerology', delay: 0.3 },
        { icon: Shield, title: 'AI Palm Reading', desc: 'Upload your palm photo for instant AI decoding of your lifeline, heart & head lines.', link: '/palm-reading', delay: 0.4 },
        { icon: Scan, title: 'AI Face Reading', desc: 'Facial feature analysis for personality, leadership & wealth indicators.', link: '/face-reading', delay: 0.5 },
        { icon: Wallet, title: 'Premium Reports', desc: 'Detailed downloadable PDF guides with Vedic remedies for your long-term destiny.', link: '/dashboard', delay: 0.6 },
    ];

    const testimonials = [
        { name: 'Priya Sharma', sign: 'Libra', stars: 5, text: 'The Kundali generator was eerily accurate. My career and health predictions for 2024 came true within months. Absolutely recommend!' },
        { name: 'Arjun Patel', sign: 'Scorpio', stars: 5, text: 'Arup Astro turned me into a believer! The AI palm reading was detailed beyond what I expected. Worth every rupee.' },
        { name: 'Meera Joshi', sign: 'Pisces', stars: 5, text: 'I\'ve tried many astrology apps but this one stands out. The numerology report gave me deep clarity about my life path.' },
    ];

    const faqs = [
        { q: 'Is Arup Astro free to use?', a: 'Yes! We offer a free preview tier with basic horoscopes, Kundali summary, and basic numerology. Premium features like detailed PDF reports and full AI analysis require a one-time plan upgrade.' },
        { q: 'How accurate is the AI palm and face reading?', a: 'Our AI models are trained on ancient palmistry and face reading knowledge combined with modern ML. While no reading is 100% deterministic, users consistently report 80-90% accuracy in personality assessments.' },
        { q: 'Is my uploaded image data kept private?', a: 'Absolutely. Your images are encrypted in transit, stored securely, and never shared with third parties. You can request deletion at any time from your dashboard.' },
        { q: 'What is the Kundali generator based on?', a: 'Our Kundali generator uses authentic Vedic astrology calculations including sidereal zodiac, accurate planetary positions, lagna (ascendant), dasha periods, and house placements.' },
        { q: 'Can I get a refund?', a: 'We offer a 7-day satisfaction guarantee. If you\'re not happy with your premium report, contact us and we\'ll issue a full refund, no questions asked.' },
    ];

    return (
        <div>
            {/* ── HERO ─────────────────────────────────── */}
            <section style={{
                minHeight: '92vh',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center',
                padding: '4rem 1.5rem',
                position: 'relative', overflow: 'hidden',
                background: `url('/religious-bg.png') no-repeat center center`,
                backgroundSize: 'cover',
            }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,7,10,0.7), rgba(7,7,10,0.95))' }} />
                <StarCanvas />

                <div style={{ position: 'relative', zIndex: 2, maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
                    
                    {/* Left Column - Text */}
                    <div style={{ flex: '1 1 500px' }} className="animate-fade">
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            background: 'rgba(212,175,55,0.08)',
                            border: '1px solid rgba(212,175,55,0.2)',
                            borderRadius: 999, padding: '0.4rem 1.25rem',
                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
                            textTransform: 'uppercase', color: '#d4af37',
                            marginBottom: '1.75rem',
                        }}>
                            <Zap size={12} fill="#d4af37" /> {t('hero.badge')}
                        </div>

                        <h1 style={{
                            fontFamily: 'Outfit',
                            fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
                            fontWeight: 900,
                            lineHeight: 1.08,
                            marginBottom: '1.5rem',
                            letterSpacing: '-0.03em',
                        }}>
                            {t('hero.title1')}<br />
                            <span className="glow-text">{t('hero.title2')}</span>{' '}
                            <span style={{ color: '#f0f0f8' }}>{t('hero.title3')}</span>
                        </h1>

                        <p style={{
                            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
                            color: '#e0e0e8', lineHeight: 1.75,
                            maxWidth: 580, marginBottom: '2.5rem',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}>
                            {t('hero.subtitle')}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
                            <Link to="/kundali" className="btn btn-primary pulse" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                                <Star size={17} /> {t('hero.kundali_btn')}
                            </Link>
                            <Link to="/horoscope" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                                <Moon size={17} /> {t('hero.horoscope_btn')}
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Horoscope Form */}
                    <div style={{ flex: '1 1 380px', maxWidth: 450 }} className="animate-fade stagger-2">
                        <form onSubmit={handleHoroscopeSubmit} className="glass-strong mystical-border" style={{
                            padding: '2.5rem 2rem', borderRadius: 24, display: 'flex', flexDirection: 'column', gap: '1.25rem'
                        }}>
                            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', color: '#d4af37' }}>
                                {t('form.title')}
                            </h3>
                            <div>
                                <input type="text" placeholder={t('form.name')} required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <input type="date" required value={formData.dateOfBirth} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <input type="time" required value={formData.timeOfBirth} onChange={e => setFormData({...formData, timeOfBirth: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)' }} />
                                </div>
                            </div>
                            <div>
                                <input type="text" placeholder={t('form.place')} required value={formData.placeOfBirth} onChange={e => setFormData({...formData, placeOfBirth: e.target.value})} style={{ background: 'rgba(0,0,0,0.5)' }} />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', padding: '0.875rem' }}>
                                {t('form.submit')} <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Scroll indicator */}
                <div className="animate-float" style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: '#fff', opacity: 0.5 }}>
                    <ChevronDown size={24} />
                </div>
            </section>

            {/* ── SERVICES ─────────────────────────────── */}
            <section style={{ padding: '6rem 1.5rem', background: '#07070a' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>Our Cosmic Services</div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem' }}>
                            Ancient Wisdom. <span className="glow-text">Modern AI.</span>
                        </h2>
                        <p style={{ color: '#8a8aa8', maxWidth: 520, margin: '0 auto' }}>
                            Comprehensive tools designed to provide deep personal insights using ancient wisdom and modern artificial intelligence.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {services.map(s => <ServiceCard key={s.title} {...s} />)}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────── */}
            <section style={{ padding: '6rem 1.5rem', background: '#0a0a0f' }}>
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>How It Works</div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800 }}>
                            Your Cosmic Journey in <span className="glow-text">3 Steps</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        {[
                            { step: '01', title: 'Create Your Account', desc: 'Sign up for free in seconds. No credit card required to start exploring your cosmic profile.' },
                            { step: '02', title: 'Choose Your Reading', desc: 'Select from Kundali, Horoscope, Numerology, Palm Reading, or Face Reading — all in one place.' },
                            { step: '03', title: 'Unlock Your Destiny', desc: 'Receive your personalized cosmic report instantly. Upgrade for deeper insights and downloadable PDFs.' },
                        ].map((item, i) => (
                            <div key={item.step} className="animate-fade" style={{ animationDelay: `${i * 0.15}s`, textAlign: 'center', padding: '2rem 1.5rem' }}>
                                <div style={{
                                    width: 64, height: 64, margin: '0 auto 1.5rem',
                                    border: '2px solid rgba(212,175,55,0.3)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.1rem', color: '#d4af37',
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                                <p style={{ color: '#8a8aa8', fontSize: '0.875rem', lineHeight: 1.7 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ──────────────────────────────── */}
            <section style={{ padding: '6rem 1.5rem', background: '#07070a' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>Pricing</div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                            Choose Your Level of <span className="glow-text">Insight</span>
                        </h2>
                        <p style={{ color: '#8a8aa8' }}>Start free, upgrade anytime. Every plan includes instant access.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                        <PricingCard
                            name="Free Preview"
                            price="₹0"
                            features={['Basic daily horoscope', 'Kundali summary', 'Numerology basics', '1 free reading per service']}
                            cta="Start for Free"
                            link="/signup"
                        />
                        <PricingCard
                            name="Full Report"
                            price="₹99"
                            features={['Detailed Kundali with Dasha', 'Full Numerology audit', 'AI Personality analysis', 'Life Path forecast', 'Downloadable PDF report', 'Career & Love insights']}
                            highlighted
                            cta="Unlock Now"
                            link="/dashboard"
                        />
                        <PricingCard
                            name="Premium Bundle"
                            price="₹199"
                            features={['Everything in Full Report', 'AI Face & Palm deep reading', 'Vedic remedies & gemstones', '2026 year predictions', '30-day premium access', 'VIP priority support']}
                            cta="Go Premium"
                            link="/dashboard"
                        />
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ─────────────────────────── */}
            <section style={{ padding: '6rem 1.5rem', background: '#0a0a0f' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                        <div className="badge badge-purple" style={{ marginBottom: '1rem' }}>Testimonials</div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800 }}>
                            Loved by <span className="glow-text">50,000+</span> Seekers
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {testimonials.map(t => <Testimonial key={t.name} {...t} />)}
                    </div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────── */}
            <section style={{ padding: '6rem 1.5rem', background: '#07070a' }}>
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>FAQ</div>
                        <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800 }}>
                            Frequently Asked <span className="glow-text">Questions</span>
                        </h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {faqs.map(f => <FAQ key={f.q} {...f} />)}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────── */}
            <section style={{
                padding: '6rem 1.5rem',
                background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.15) 0%, transparent 70%), #0a0a0f',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }} className="animate-fade">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                    <h2 style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
                        Your Destiny Awaits. <span className="glow-text">Start Today.</span>
                    </h2>
                    <p style={{ color: '#8a8aa8', marginBottom: '2rem', lineHeight: 1.7 }}>
                        Join thousands of seekers who have already unlocked their cosmic blueprint with Arup Astro.
                    </p>
                    <Link to="/signup" className="btn btn-primary pulse" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}>
                        Begin Your Journey — It's Free
                    </Link>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────── */}
            <footer style={{
                padding: '3rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                background: '#07070a',
            }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                        <div style={{ maxWidth: 260 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#d4af37,#b8860b)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={14} color="#07070a" />
                                </div>
                                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1rem' }}>ARUP ASTRO</span>
                            </div>
                            <p style={{ color: '#4a4a6a', fontSize: '0.8rem', lineHeight: 1.7 }}>
                                AI-powered cosmic intelligence platform combining ancient Vedic wisdom with modern technology.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: '#8a8aa8' }}>Services</div>
                                {['Horoscope', 'Kundali', 'Numerology', 'Palm Reading', 'Face Reading'].map(s => (
                                    <div key={s} style={{ marginBottom: '0.5rem' }}>
                                        <Link to={`/${s.toLowerCase().replace(' ', '-')}`} style={{ color: '#4a4a6a', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                            onMouseOver={e => e.target.style.color = '#d4af37'}
                                            onMouseOut={e => e.target.style.color = '#4a4a6a'}
                                        >{s}</Link>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', color: '#8a8aa8' }}>Company</div>
                                {[['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms'], ['Contact Us', '/contact']].map(([label, path]) => (
                                    <div key={label} style={{ marginBottom: '0.5rem' }}>
                                        <Link to={path} style={{ color: '#4a4a6a', fontSize: '0.85rem', transition: 'color 0.2s' }}
                                            onMouseOver={e => e.target.style.color = '#d4af37'}
                                            onMouseOut={e => e.target.style.color = '#4a4a6a'}
                                        >{label}</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: '#4a4a6a' }}>© 2026 Arup Astro. All rights reserved.</p>
                        <p style={{ fontSize: '0.72rem', color: '#4a4a6a', fontStyle: 'italic' }}>For entertainment and personal insight only. Not a substitute for professional advice.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
