import React, { useState } from 'react'
import logo from '../../assets/logo.webp'
import api from '../../lib/api.js'
import { useToast } from '../global/Toast.jsx'
import Loading from '../global/Loading.jsx'

const RegisterComp = ({ updateForm }) => {
    const toast = useToast()
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if (!formData.username || !formData.email || !formData.password) return toast.error('Error', 'All fields are required')

        setIsLoading(true)
        try {
            await api.post('/auth/register', formData)
            toast.success('Account created!', 'Check your inbox to verify your email')
            updateForm(true) // Switch to login
        } catch (error) {
            toast.error('Register failed', error.message)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <Loading />

    return (
        <div className='flex flex-col items-center justify-center w-full max-w-sm p-8 bg-(--lc-surface) rounded-2xl border border-(--lc-border-lit) shadow-(--lc-glow-md)'>
            <img src={logo} alt='Logo' width={80} height={80} className='mb-4' />
            <h1 className='text-xl font-semibold text-(--lc-text) mb-6'>Lunar<span className='text-(--lc-purple)'>cord</span> Register</h1>

            <input className='w-full h-10 rounded-xl bg-(--lc-surface-2) text-(--lc-text) pl-3 border border-(--lc-border) mb-4 outline-none' type='text' placeholder='Username' onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            <input className='w-full h-10 rounded-xl bg-(--lc-surface-2) text-(--lc-text) pl-3 border border-(--lc-border) mb-4 outline-none' type='email' placeholder='Email' onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input className='w-full h-10 rounded-xl bg-(--lc-surface-2) text-(--lc-text) pl-3 border border-(--lc-border) outline-none' type='password' placeholder='Password' onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

            <button className='w-full h-10 mt-6 rounded-xl bg-(--lc-purple) text-white font-bold hover:opacity-90 transition-opacity' onClick={handleSubmit}>Register</button>

            <p className='text-(--lc-text) text-sm mt-8'>Already have an account? <span className='text-(--lc-info) cursor-pointer' onClick={() => updateForm(true)}>Login</span></p>
        </div>
    )
}

export default RegisterComp