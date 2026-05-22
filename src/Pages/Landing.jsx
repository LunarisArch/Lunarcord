import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Particles from '../components/global/Particles'
import api from '../lib/api'
import { useNavigate } from 'react-router-dom'

const TERMINAL_LINES = [
    { text: '$ ./connect --secure --e2e', color: '#00ff88', delay: 0 },
    { text: '[INFO] Initiating handshake...', color: '#7755aa', delay: 800 },
    { text: '[INFO] Generating session keys...', color: '#7755aa', delay: 1800 },
    { text: '[INFO] Establishing E2E tunnel... OK', color: '#7755aa', delay: 2800 },
    { text: '[WARN] Tracker scan: 0 found', color: '#ffaa00', delay: 3800 },
    { text: '> CONNECTION ESTABLISHED.', color: '#e060ff', delay: 4800, bold: true },
    { text: 'Latency: --ms | Encrypted: true', color: '#00d4ff', delay: 5600, isLatency: true },
]

function TypewriterLine({ text, color, bold, delay, onDone, isLatency, latency }) {
    const [charsTyped, setCharsTyped] = useState(0)
    const [done, setDone] = useState(false)

    // Calculate the complete text dynamically based on current props
    const fullText = isLatency ? text.replace('--ms', `${latency ?? '--'}ms`) : text

    // Use a ref to store the target length. This allows the interval to know 
    // when to stop without putting 'latency' into the useEffect dependencies.
    const lengthRef = useRef(fullText.length)
    useEffect(() => {
        lengthRef.current = fullText.length
    }, [fullText])

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0
            const interval = setInterval(() => {
                i++
                setCharsTyped(i)

                // Stop typing when we reach the end of the calculated text length
                if (i >= lengthRef.current) {
                    clearInterval(interval)
                    setDone(true)
                    onDone?.()
                }
            }, 28)
            return () => clearInterval(interval)
        }, delay)
        return () => clearTimeout(timeout)
    }, [delay]) // <-- Removed latency from here so the animation only fires once!

    // If typing is done, show the full string (this handles real-time latency updates seamlessly).
    // If still typing, show a slice of the string up to the current character count.
    const displayed = done ? fullText : fullText.slice(0, charsTyped)

    return (
        <div style={{
            color,
            fontWeight: bold ? 700 : 400,
            minHeight: '1.6em',
            fontFamily: 'monospace',
            fontSize: 'clamp(10px, 1.5vw, 13px)',
            lineHeight: 1.7
        }}>
            {displayed}
            {!done && charsTyped > 0 && (
                <span style={{
                    display: 'inline-block',
                    width: 7,
                    height: '1em',
                    background: color,
                    marginLeft: 2,
                    verticalAlign: 'middle',
                    animation: 'cur 0.8s step-end infinite'
                }} />
            )}
        </div>
    )
}

function Terminal({ latency }) {
    const [visibleLines, setVisibleLines] = useState(0)

    useEffect(() => {
        if (visibleLines < TERMINAL_LINES.length) {
            const t = setTimeout(() => setVisibleLines(v => v + 1), visibleLines === 0 ? 200 : TERMINAL_LINES[visibleLines - 1].delay + 200)
            return () => clearTimeout(t)
        }
    }, [visibleLines])

    return (
        <div style={{
            background: 'rgba(8,0,16,0.9)',
            border: '1px solid #220055',
            borderRadius: 14,
            overflow: 'hidden',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 40px rgba(191,0,255,0.12)',
            width: '100%',
            maxWidth: 480
        }}>
            <div style={{
                background: '#0f0020',
                borderBottom: '1px solid #1a0035',
                padding: '9px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6
            }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ff2d55' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#ffaa00' }} />
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#00ff88' }} />
                <span style={{ marginLeft: 8, color: '#4400aa', fontSize: 11, fontFamily: 'monospace' }}>bash — root@lunarcord</span>
            </div>
            <div style={{ padding: '16px 18px', minHeight: 160 }}>
                {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                    <TypewriterLine key={i} {...line} latency={latency} onDone={i === TERMINAL_LINES.length - 1 ? undefined : undefined} />
                ))}
                {visibleLines >= TERMINAL_LINES.length && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ color: '#00ff88', fontFamily: 'monospace', fontSize: 'clamp(10px,1.5vw,13px)' }}>user@lunarcord:~$</span>
                        <span style={{ width: 7, height: 14, background: '#f5e6ff', marginLeft: 6, display: 'inline-block', animation: 'cur 1s step-end infinite' }} />
                    </div>
                )}
            </div>
        </div>
    )
}

const PILLS = [
    { label: 'E2E encrypted', color: '#00ff88', icon: <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00ff88" strokeWidth="1.5" /></svg> },
    { label: 'Zero tracking', color: '#bf00ff', icon: <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#bf00ff" strokeWidth="1.5" /><path d="M12 8v4m0 4h.01" stroke="#bf00ff" strokeWidth="1.5" strokeLinecap="round" /></svg> },
    { label: 'Sub-50ms', color: '#00d4ff', icon: <svg width="10" height="10" fill="none" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" /></svg> },
]

const FEATURES = [
    { title: 'E2E encrypted', desc: 'Every message encrypted before it leaves your device. Not even us can read it.', icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#bf00ff" strokeWidth="1.5" strokeLinecap="round" /></svg> },
    { title: 'Zero tracking', desc: 'No analytics. No profiling. No selling your data. Your conversations are yours.', icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#bf00ff" strokeWidth="1.5" /><circle cx="12" cy="12" r="3" stroke="#bf00ff" strokeWidth="1.5" /><path d="M3 3l18 18" stroke="#bf00ff" strokeWidth="1.5" strokeLinecap="round" /></svg> },
    { title: 'Your community', desc: 'Full server control. Roles, permissions, channels — built your way, run your way.', icon: <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#bf00ff" strokeWidth="1.5" strokeLinecap="round" /></svg> },
]

function FeatureCard({ title, desc, icon, index }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
                background: 'rgba(15,0,32,0.7)',
                border: '1px solid #220055',
                borderRadius: 12,
                padding: '16px',
                backdropFilter: 'blur(6px)',
                flex: 1,
                minWidth: 0
            }}
        >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(191,0,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>{icon}</div>
            <h3 style={{ color: '#f5e6ff', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
            <p style={{ color: '#7755aa', fontSize: 12, lineHeight: 1.6 }}>{desc}</p>
        </motion.div>
    )
}

function ZeroKnowledgeBanner() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{
                position: 'relative',
                zIndex: 2,
                margin: '0 24px 32px',
                background: 'rgba(8,0,16,0.85)',
                border: '1px solid #4400aa',
                borderRadius: 16,
                padding: 'clamp(20px, 4vw, 36px)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 0 40px rgba(191,0,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 12
            }}
        >
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(191,0,255,0.1)', border: '1px solid #4400aa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#bf00ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12l2 2 4-4" stroke="#bf00ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h2 style={{ color: '#f5e6ff', fontSize: 'clamp(16px,3vw,22px)', fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
                Not even we can read your messages.
            </h2>
            <p style={{ color: '#7755aa', fontSize: 'clamp(12px,2vw,14px)', lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
                Lunarcord uses zero-knowledge end-to-end encryption. Your messages are encrypted on your device before they're ever sent. Our servers relay ciphertext — nothing more. No backdoors. No master keys. No exceptions.
            </p>
            <div style={{ display: 'flex', gap: 24, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {['Zero-knowledge architecture', 'Client-side encryption', 'No backdoors'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4400aa', fontSize: 12 }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" stroke="#bf00ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span style={{ color: '#a060ff' }}>{item}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default function Landing() {
    const nav = useNavigate()
    const [latency, setLatency] = useState(null)

    useEffect(() => {
        const fetchLatency = async () => {
            const ms = await api.latency()
            if (ms !== null) setLatency(ms)
        }
        fetchLatency()
        const interval = setInterval(fetchLatency, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: 'var(--lc-bg)',
            position: 'relative',
            overflowX: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }}>
            <Particles />

            <style>{`
        @keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes badgePulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

            {/* Nav */}
            <motion.nav
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'clamp(12px,3vw,20px) clamp(16px,5vw,36px)',
                    borderBottom: '1px solid #1a0035'
                }}
            >
                <div style={{ fontSize: 'clamp(15px,2.5vw,20px)', fontWeight: 700, color: '#f5e6ff' }}>
                    Lunar<span style={{ color: '#bf00ff' }}>cord</span>
                </div>

                <div style={{ display: 'flex', gap: 'clamp(12px,3vw,24px)', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 'clamp(10px,2vw,20px)' }}>
                        {['About', 'Status', 'Dev', 'Roadmap'].map(link => (
                            <a key={link} href={`/${link.toLowerCase()}`} style={{ color: '#7755aa', fontSize: 'clamp(11px,1.5vw,13px)', textDecoration: 'none' }}
                                onMouseEnter={e => e.target.style.color = '#f5e6ff'}
                                onMouseLeave={e => e.target.style.color = '#7755aa'}
                            >{link}</a>
                        ))}
                    </div>
                    <button
                        onClick={() => nav('/auth')}
                        style={{
                            background: '#bf00ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            padding: 'clamp(6px,1vw,8px) clamp(12px,2vw,18px)',
                            fontSize: 'clamp(11px,1.5vw,13px)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 0 16px rgba(191,0,255,0.4)'
                        }}
                    >Get started</button>
                </div>
            </motion.nav>

            {/* Hero */}
            <main style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'clamp(24px,4vw,40px)',
                padding: 'clamp(32px,6vw,56px) clamp(16px,5vw,36px)'
            }}>
                {/* Left */}
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{ flex: '1 1 280px', maxWidth: 480 }}
                >
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(191,0,255,0.1)', border: '1px solid #4400aa',
                        borderRadius: 999, padding: '3px 12px', fontSize: 10,
                        color: '#bf00ff', fontWeight: 600, letterSpacing: '0.05em',
                        textTransform: 'uppercase', marginBottom: 20
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', display: 'inline-block', animation: 'badgePulse 1.5s ease-in-out infinite' }} />
                        End-to-end encrypted
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(26px,5vw,46px)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        letterSpacing: -1.5,
                        marginBottom: 16,
                        color: '#f5e6ff'
                    }}>
                        Privacy isn't a feature.<br />
                        <span style={{ color: '#bf00ff' }}>It's the foundation.</span>
                    </h1>

                    <p style={{ color: '#7755aa', fontSize: 'clamp(12px,1.8vw,14px)', lineHeight: 1.7, marginBottom: 22, maxWidth: 400 }}>
                        Your community, your rules. Lunarcord lives in the void — no ads, no tracking, no compromise. Real-time messaging with E2E encryption baked in from day one.
                    </p>

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                        {PILLS.map(p => (
                            <div key={p.label} style={{
                                background: 'rgba(191,0,255,0.08)', border: '1px solid #2a0055',
                                borderRadius: 999, padding: '4px 12px', fontSize: 11,
                                color: '#7755aa', display: 'flex', alignItems: 'center', gap: 5
                            }}>
                                {p.icon} {p.label}
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => nav('/auth')}
                            style={{
                                background: '#bf00ff', color: '#fff', border: 'none',
                                borderRadius: 10, padding: 'clamp(10px,1.5vw,12px) clamp(20px,3vw,28px)',
                                fontSize: 'clamp(12px,1.8vw,14px)', fontWeight: 600, cursor: 'pointer',
                                boxShadow: '0 0 20px rgba(191,0,255,0.4)'
                            }}
                        >Enter the void →</motion.button>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => nav('/about')}
                            style={{
                                background: 'transparent', color: '#f5e6ff',
                                border: '1px solid #4400aa', borderRadius: 10,
                                padding: 'clamp(10px,1.5vw,12px) clamp(20px,3vw,28px)',
                                fontSize: 'clamp(12px,1.8vw,14px)', cursor: 'pointer'
                            }}
                        >Learn more</motion.button>
                    </div>
                </motion.div>

                {/* Right — Terminal */}
                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    style={{ flex: '1 1 260px', maxWidth: 480, width: '100%' }}
                >
                    <Terminal latency={latency} />
                </motion.div>
            </main>

            {/* Feature cards */}
            <div style={{
                position: 'relative', zIndex: 2,
                display: 'flex', gap: 12, flexWrap: 'wrap',
                padding: '0 clamp(16px,5vw,36px) 36px'
            }}>
                {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
            </div>

            {/* Zero knowledge banner */}
            <ZeroKnowledgeBanner />

            {/* Footer */}
            <footer style={{
                position: 'relative', zIndex: 2,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 8,
                padding: 'clamp(12px,2vw,16px) clamp(16px,5vw,36px)',
                borderTop: '1px solid #1a0035'
            }}>
                <p style={{ color: '#2a0055', fontSize: 11 }}>© 2026 Lunarcord</p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {['About', 'Status', 'Dev', 'Privacy', 'Terms', 'Roadmap'].map(link => (
                        <a key={link} href={`/${link.toLowerCase()}`} style={{ color: '#4400aa', fontSize: 11, textDecoration: 'none' }}>{link}</a>
                    ))}
                </div>
            </footer>
        </div>
    )
}