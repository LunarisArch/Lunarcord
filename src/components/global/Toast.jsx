import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const VARIANTS = {
    error: {
        border: '#880022',
        bg: 'rgba(20,0,5,0.92)',
        iconBg: 'rgba(255,45,85,0.12)',
        iconColor: '#ff2d55',
        titleColor: '#ffb0c0',
        msgColor: '#884455',
        btnBg: 'rgba(255,45,85,0.15)',
        btnColor: '#ff2d55',
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#ff2d55" strokeWidth="1.5" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="#ff2d55" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        )
    },
    success: {
        border: '#004422',
        bg: 'rgba(0,15,5,0.92)',
        iconBg: 'rgba(0,255,136,0.1)',
        iconColor: '#00ff88',
        titleColor: '#c0ffe0',
        msgColor: '#006644',
        btnBg: 'rgba(0,255,136,0.12)',
        btnColor: '#00ff88',
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M22 4L12 14.01l-3-3" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        )
    },
    warning: {
        border: '#664400',
        bg: 'rgba(18,10,0,0.92)',
        iconBg: 'rgba(255,170,0,0.1)',
        iconColor: '#ffaa00',
        titleColor: '#fff0c0',
        msgColor: '#886600',
        btnBg: 'rgba(255,170,0,0.12)',
        btnColor: '#ffaa00',
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 9v4m0 4h.01" stroke="#ffaa00" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        )
    },
    info: {
        border: '#004488',
        bg: 'rgba(0,5,20,0.92)',
        iconBg: 'rgba(0,212,255,0.1)',
        iconColor: '#00d4ff',
        titleColor: '#d0f4ff',
        msgColor: '#336688',
        btnBg: 'rgba(0,212,255,0.12)',
        btnColor: '#00d4ff',
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#00d4ff" strokeWidth="1.5" />
                <path d="M12 8h.01M12 12v4" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        )
    },
    purple: {
        border: '#bf00ff',
        bg: 'rgba(15,0,32,0.92)',
        iconBg: 'rgba(191,0,255,0.15)',
        iconColor: '#e060ff',
        titleColor: '#f5e6ff',
        msgColor: '#7755aa',
        btnBg: 'rgba(191,0,255,0.2)',
        btnColor: '#e060ff',
        icon: (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#e060ff" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 9v4m0 4h.01" stroke="#e060ff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        )
    }
}

const Toast = ({ id, title, message, variant = 'error', onClose }) => {
    const v = VARIANTS[variant] || VARIANTS.error

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: v.bg,
            border: `1px solid ${v.border}`,
            borderRadius: '10px',
            padding: '10px 12px',
            backdropFilter: 'blur(10px)',
            animation: 'slideIn 0.2s ease',
            width: '300px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: v.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {v.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: v.titleColor, fontSize: '12px', fontWeight: '600', margin: '0 0 1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {title}
                </p>
                <p style={{ color: v.msgColor, fontSize: '11px', margin: 0, lineHeight: '1.4', wordBreak: 'break-word' }}>
                    {message}
                </p>
            </div>

            <button
                onClick={() => onClose(id)}
                style={{
                    background: v.btnBg,
                    color: v.btnColor,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    flexShrink: 0
                }}
            >
                Okay
            </button>
        </div>
    )
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback(({ title, message, variant = 'error', duration = 0 }) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, title, message, variant }])

        // Auto dismiss if duration is set (ms), 0 = manual dismiss only
        if (duration > 0) {
            setTimeout(() => removeToast(id), duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    // Shorthand helpers
    const toast = {
        error: (title, message, duration) => showToast({ title, message, variant: 'error', duration }),
        success: (title, message, duration) => showToast({ title, message, variant: 'success', duration }),
        warning: (title, message, duration) => showToast({ title, message, variant: 'warning', duration }),
        info: (title, message, duration) => showToast({ title, message, variant: 'info', duration }),
        purple: (title, message, duration) => showToast({ title, message, variant: 'purple', duration }),
        show: showToast,
    }

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast container — top right */}
            <div style={{
                position: 'fixed',
                top: '16px',
                right: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 9999,
                pointerEvents: 'none'
            }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ pointerEvents: 'all' }}>
                        <Toast {...t} onClose={removeToast} />
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside ToastProvider')
    return ctx
}
