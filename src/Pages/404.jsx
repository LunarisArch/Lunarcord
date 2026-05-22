import React from 'react'
import Particles from '../components/global/Particles'

function Lost() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: 'var(--lc-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>

      <Particles />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* 404 number */}
        <h1 style={{
          fontSize: 'clamp(100px, 20vw, 180px)',
          fontWeight: '800',
          color: 'transparent',
          WebkitTextStroke: '2px var(--lc-purple)',
          textShadow: 'var(--lc-glow-lg)',
          lineHeight: '1',
          letterSpacing: '-4px',
          margin: '0',
          userSelect: 'none'
        }}>
          404
        </h1>

        {/* divider line */}
        <div style={{
          width: '60px',
          height: '2px',
          background: 'var(--lc-purple)',
          boxShadow: 'var(--lc-glow-sm)',
          margin: '24px 0',
          borderRadius: '2px'
        }} />

        {/* message */}
        <p style={{
          fontSize: '18px',
          color: 'var(--lc-text)',
          fontWeight: '500',
          margin: '0 0 8px',
          letterSpacing: '0.02em'
        }}>
          Page not found
        </p>
        <p style={{
          fontSize: '14px',
          color: 'var(--lc-muted)',
          margin: '0',
          textAlign: 'center',
          maxWidth: '320px',
          lineHeight: '1.6'
        }}>
          Looks like this page drifted into the void. It may have been moved or never existed.
        </p>

      </div>
    </div>
  )
}

export default Lost