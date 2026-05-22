import React, { useEffect, useState } from 'react'
import logo from '../../assets/logo.webp'

const loadingMessages = [
    'Connecting to the void...',
    'Syncing your servers...',
    'Tuning the frequencies...',
    'Almost there...',
]

const Loading = () => {
    const [messageIndex, setMessageIndex] = useState(0)
    const [dots, setDots] = useState('')

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % loadingMessages.length)
        }, 2000)

        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.')
        }, 400)

        return () => {
            clearInterval(messageInterval)
            clearInterval(dotsInterval)
        }
    }, [])

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            background: 'var(--lc-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* background orbs */}
            <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'var(--lc-purple)', opacity: 0.05, filter: 'blur(100px)', top: '10%', left: '20%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--lc-purple)', opacity: 0.04, filter: 'blur(80px)', bottom: '10%', right: '15%', pointerEvents: 'none' }} />

            {/* logo */}
            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <div style={{
                    position: 'absolute',
                    inset: '-12px',
                    borderRadius: '50%',
                    background: 'var(--lc-purple)',
                    opacity: 0.15,
                    filter: 'blur(20px)',
                    animation: 'pulse 2s ease-in-out infinite'
                }} />
                <img
                    src={logo}
                    alt='Lunarcord'
                    width={72}
                    height={72}
                    style={{
                        position: 'relative',
                        filter: 'drop-shadow(0 0 16px rgba(191,0,255,0.6))',
                        animation: 'float 3s ease-in-out infinite'
                    }}
                />
            </div>

            {/* app name */}
            <h1 style={{
                color: 'var(--lc-text)',
                fontSize: '26px',
                fontWeight: '700',
                margin: '0 0 32px',
                letterSpacing: '-0.5px'
            }}>
                Lunar<span style={{ color: 'var(--lc-purple)' }}>cord</span>
            </h1>

            {/* spinner */}
            <div style={{ position: 'relative', width: '48px', height: '48px', marginBottom: '28px' }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid var(--lc-subtle)',
                }} />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '2px solid transparent',
                    borderTopColor: 'var(--lc-purple)',
                    borderRightColor: 'var(--lc-purple-glow)',
                    animation: 'spin 0.9s linear infinite'
                }} />
            </div>

            {/* loading message */}
            <p style={{
                color: 'var(--lc-muted)',
                fontSize: '13px',
                margin: 0,
                letterSpacing: '0.02em',
                minWidth: '200px',
                textAlign: 'center',
                transition: 'opacity 0.3s'
            }}>
                {loadingMessages[messageIndex]}{dots}
            </p>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.1); }
        }
      `}</style>
        </div>
    )
}

export default Loading