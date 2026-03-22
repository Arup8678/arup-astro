import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, LogOut, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const location = useLocation();
    const dropRef = useRef(null);

    const checkLang = () => {
        const newLang = i18n.language === 'en' ? 'bn' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('lang', newLang);
    };

    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
        }
    }, []);

    const NAV_LINKS = [
        { label: t('nav.horoscope'), path: '/horoscope' },
        { label: t('nav.kundali'), path: '/kundali' },
        { label: t('nav.numerology'), path: '/numerology' },
        {
            label: t('nav.ai_readings'), path: null, children: [
                { label: t('nav.palm'), path: '/palm-reading' },
                { label: t('nav.face'), path: '/face-reading' },
            ]
        },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: scrolled ? '0.6rem 1.5rem' : '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: scrolled ? 'rgba(7,7,10,0.92)' : 'rgba(7,7,10,0.6)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: scrolled ? '1px solid rgba(212,175,55,0.1)' : '1px solid transparent',
            transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{
                    width: 36, height: 36,
                    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(212,175,55,0.35)',
                }}>
                    <Sparkles size={18} color="#07070a" />
                </div>
                <span style={{
                    fontFamily: 'Outfit',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    color: '#f0f0f8',
                }}>
                    ARUP <span style={{ color: '#d4af37' }}>ASTRO</span>
                </span>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="hidden-mobile">
                {NAV_LINKS.map(link => link.children ? (
                    <div key={link.label} ref={dropRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                padding: '0.5rem 0.875rem',
                                borderRadius: 8,
                                border: 'none',
                                background: dropdownOpen ? 'rgba(212,175,55,0.08)' : 'transparent',
                                color: dropdownOpen ? '#d4af37' : '#8a8aa8',
                                cursor: 'pointer',
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                fontFamily: 'Inter',
                                transition: 'all 0.2s',
                            }}
                        >
                            {link.label} <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </button>
                        {dropdownOpen && (
                            <div style={{
                                position: 'absolute', top: '110%', left: 0,
                                background: '#0f0f14', border: '1px solid rgba(212,175,55,0.15)',
                                borderRadius: 12, padding: '0.5rem',
                                minWidth: 170,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                            }}>
                                {link.children.map(child => (
                                    <Link key={child.path} to={child.path} style={{
                                        display: 'block',
                                        padding: '0.6rem 0.875rem',
                                        borderRadius: 8,
                                        color: '#8a8aa8',
                                        fontSize: '0.875rem',
                                        transition: 'all 0.15s',
                                    }}
                                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.07)'; e.currentTarget.style.color = '#d4af37'; }}
                                        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8a8aa8'; }}
                                    >
                                        {child.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <Link key={link.path} to={link.path} style={{
                        padding: '0.5rem 0.875rem',
                        borderRadius: 8,
                        color: isActive(link.path) ? '#d4af37' : '#8a8aa8',
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        background: isActive(link.path) ? 'rgba(212,175,55,0.08)' : 'transparent',
                        transition: 'all 0.2s',
                    }}
                        onMouseOver={e => { if (!isActive(link.path)) { e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.background = 'rgba(212,175,55,0.05)'; } }}
                        onMouseOut={e => { if (!isActive(link.path)) { e.currentTarget.style.color = '#8a8aa8'; e.currentTarget.style.background = 'transparent'; } }}
                    >
                        {link.label}
                    </Link>
                ))}

                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.08)', margin: '0 0.5rem' }} />

                <button onClick={checkLang} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'rgba(212,175,55,0.08)', color: '#d4af37',
                    border: '1px solid rgba(212,175,55,0.2)', padding: '0.4rem 0.8rem',
                    borderRadius: 99, cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.8rem',
                    marginRight: '0.5rem'
                }}>
                    <Globe size={14} /> {i18n.language.toUpperCase()}
                </button>

                {token ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                            <LayoutDashboard size={14} /> {t('nav.dashboard')}
                        </Link>
                        <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: 8 }} title={t('nav.logout')}>
                            <LogOut size={16} />
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to="/login" className="btn btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{t('nav.login')}</Link>
                        <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>{t('nav.signup')}</Link>
                    </div>
                )}
            </div>

            {/* Mobile Toggle */}
            <div className="show-mobile" style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }}>
                <button onClick={checkLang} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'rgba(212,175,55,0.08)', color: '#d4af37',
                    border: '1px solid rgba(212,175,55,0.2)', padding: '0.4rem 0.6rem',
                    borderRadius: 99, cursor: 'pointer', fontFamily: 'Inter', fontSize: '0.75rem'
                }}>
                    {i18n.language.toUpperCase()}
                </button>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 8,
                        padding: '0.5rem',
                        color: '#f0f0f8',
                        cursor: 'pointer',
                    }}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'rgba(7,7,10,0.97)',
                    backdropFilter: 'blur(24px)',
                    borderBottom: '1px solid rgba(212,175,55,0.1)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    animation: 'fadeInUp 0.25s ease-out',
                }}>
                    {NAV_LINKS.map(link => link.children ? link.children.map(child => (
                         <Link key={child.path} to={child.path} style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 10,
                            color: isActive(child.path) ? '#d4af37' : '#8a8aa8',
                            fontWeight: 500,
                            background: isActive(child.path) ? 'rgba(212,175,55,0.08)' : 'transparent',
                        }}>
                            {child.label}
                        </Link>
                    )) : (
                        <Link key={link.path} to={link.path} style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 10,
                            color: isActive(link.path) ? '#d4af37' : '#8a8aa8',
                            fontWeight: 500,
                            background: isActive(link.path) ? 'rgba(212,175,55,0.08)' : 'transparent',
                        }}>
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />
                    {token ? (
                        <>
                            <Link to="/dashboard" className="btn btn-primary">
                                <LayoutDashboard size={16} /> {t('nav.dashboard')}
                            </Link>
                            <button onClick={handleLogout} className="btn btn-ghost">
                                <LogOut size={16} /> {t('nav.logout')}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">{t('nav.login')}</Link>
                            <Link to="/signup" className="btn btn-primary">{t('nav.signup')}</Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile { display: flex !important; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
