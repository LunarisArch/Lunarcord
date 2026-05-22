import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { useSearchParams, useNavigate } from 'react-router-dom'

function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token')

        if (!token) {
            setStatus('error')
            setMessage('No token found in the link. Please request a new verification email.')
            return
        }

        const verify = async () => {
            try {
                await api.get(`/auth/verify-email?token=${token}`)
                setStatus('success')
            } catch (error) {
                setStatus('error')
                setMessage(error.message || 'Invalid or expired verification link.')
            }
        }

        verify()
    }, [])

    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => navigate('/auth?verified=true'), 3000)
            return () => clearTimeout(timer)
        }
    }, [status])

    return (
        <div style={{
            width: '100%', height: '100vh',
            background: 'var(--lc-bg)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column',
            gap: '12px'
        }}>

            {status === 'loading' && (
                <>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: '2px solid var(--lc-subtle)',
                        borderTopColor: 'var(--lc-purple)',
                        animation: 'spin 0.9s linear infinite'
                    }} />
                    <p style={{ color: 'var(--lc-muted)', fontSize: '14px' }}>Verifying your email...</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'rgba(0,255,136,0.1)', border: '1px solid #004422',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M22 4L12 14.01l-3-3" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p style={{ color: 'var(--lc-text)', fontSize: '16px', fontWeight: '600' }}>Email verified!</p>
                    <p style={{ color: 'var(--lc-muted)', fontSize: '13px' }}>Redirecting you to login...</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'rgba(255,45,85,0.1)', border: '1px solid #660020',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="#ff2d55" strokeWidth="1.5" />
                            <path d="M15 9l-6 6M9 9l6 6" stroke="#ff2d55" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <p style={{ color: 'var(--lc-text)', fontSize: '16px', fontWeight: '600' }}>Verification failed</p>
                    <p style={{ color: 'var(--lc-muted)', fontSize: '13px', textAlign: 'center', maxWidth: '300px' }}>{message}</p>
                    <button
                        onClick={() => navigate('/authentication')}
                        style={{
                            marginTop: '8px', background: 'var(--lc-purple)', color: '#fff',
                            border: 'none', borderRadius: '8px', padding: '10px 24px',
                            fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                        }}
                    >
                        Back to login
                    </button>
                </>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default VerifyEmail