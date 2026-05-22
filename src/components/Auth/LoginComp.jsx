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
    if (!email || !password) {
      toast.error('Missing fields', 'Please enter your email and password')
      return
    }

    setLoading(true)

    try {
      const data = await api.post('/auth/login', { email, password })
      sessionStorage.setItem('accessToken', data.accessToken)
      toast.success('Welcome back!', `Logged in as ${data.user.username}`, 3000)
      nav('/dashboard')
    } catch (error) {
      setLoading(false)
      if (error.status === 403) {
        toast.warning('Email not verified', 'Please check your inbox and verify your email before logging in.')
      } else if (error.status === 401) {
        toast.error('Login failed', 'Invalid email or password')
      } else {
        toast.error('Something went wrong', error.message || 'Please try again')
      }
    }
  }

  if (loading) return <Loading />

  return (
    <div className='flex flex-col items-center justify-center w-3/12 h-8/12 bg-(--lc-surface) rounded-2xl border-(--lc-border-lit) border shadow-(--lc-glow-md)'>
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <img src={logo} alt='Logo' width={100} height={100} />
        <h1 className='text-xl font-semibold text-(--lc-text) mb-4'>Lunar<span style={{ color: 'var(--lc-purple)' }}>cord</span> login</h1>
        <input className='w-9/12 h-10 rounded-2xl bg-(--lc-surface-2) text-(--lc-text) font-semibold pl-2 outline-0 border border-(--lc-border) mb-4 hover:border-(--lc-border-lit) hover:shadow-(--lc-glow-md)' type='email' onChange={(event) => setEmail(event.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} name='Email' placeholder='Email' autoComplete='one-time-code' required />
        <input className='w-9/12 h-10 rounded-2xl bg-(--lc-surface-2) text-(--lc-text) font-semibold pl-2 outline-0 border border-(--lc-border) my-1 hover:border-(--lc-border-lit) hover:shadow-(--lc-glow-md)' type='password' onChange={(event) => setPassword(event.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} name='Password' placeholder='Password' autoComplete='one-time-code' required />
        <div className='w-9/12 flex justify-end mt-1 mb-2'>
          <span className='text-(--lc-info) text-xs cursor-pointer' onClick={() => nav('/forgot-password')}>Forgot password?</span>
        </div>
        <input className='w-3/12 h-10 rounded-2xl bg-(--lc-surface-2) text-(--lc-text) font-semibold outline-0 border border-(--lc-border) mt-4 hover:border-(--lc-border-lit) hover:shadow-(--lc-glow-md) cursor-pointer' type='button' name='Login' value='Login' onClick={handleSubmit} />
        <div className='w-full h-30 mt-8 flex justify-center'>
          <h1 className='text-(--lc-text) text-sm mb-4'>Don't have an account? <span className='text-(--lc-info) cursor-pointer' onClick={() => { updateForm(false) }}>Register</span></h1>
        </div>
      </div>
    </div>
  )
}

export default LoginComp