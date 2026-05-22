import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.webp'
import api from '../../lib/api'
import { useToast } from '../global/Toast'
import Loading from '../global/Loading.jsx'

const LoginComp = ({ updateForm }) => {
  const nav = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return toast.error('Missing fields', 'Please enter email and password')

    setLoading(true)
    try {
      const data = await api.post('/auth/login', { email: email.trim(), password })
      sessionStorage.setItem('accessToken', data.accessToken)
      toast.success('Welcome back!', `Logged in as ${data.user.username}`)
      nav('/dashboard')
    } catch (error) {
      setLoading(false)
      const messages = { 403: 'Verify your email first.', 401: 'Invalid credentials.' }
      toast.error('Login failed', messages[error.status] || error.message)
    }
  }

  if (loading) return <Loading />

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-sm p-8 bg-(--lc-surface) rounded-2xl border border-(--lc-border-lit) shadow-(--lc-glow-md)'>
      <img src={logo} alt='Logo' width={80} height={80} className='mb-4' />
      <h1 className='text-xl font-semibold text-(--lc-text) mb-6'>Lunar<span className='text-(--lc-purple)'>cord</span> Login</h1>

      <input className='w-full h-10 rounded-xl bg-(--lc-surface-2) text-(--lc-text) pl-3 border border-(--lc-border) focus:border-(--lc-purple) outline-none mb-4' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      <input className='w-full h-10 rounded-xl bg-(--lc-surface-2) text-(--lc-text) pl-3 border border-(--lc-border) focus:border-(--lc-purple) outline-none' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />

      <div className='w-full flex justify-end mt-2'>
        <span className='text-(--lc-info) text-xs cursor-pointer' onClick={() => nav('/forgot-password')}>Forgot password?</span>
      </div>

      <button className='w-full h-10 mt-6 rounded-xl bg-(--lc-purple) text-white font-bold hover:opacity-90 transition-opacity' onClick={handleSubmit}>Login</button>

      <p className='text-(--lc-text) text-sm mt-8'>Don't have an account? <span className='text-(--lc-info) cursor-pointer' onClick={() => updateForm(false)}>Register</span></p>
    </div>
  )
}

export default LoginComp