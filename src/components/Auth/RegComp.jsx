import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import logo from '../../assets/logo.webp'
import api from '../../lib/api.js'
import { useToast } from '../global/Toast.jsx'
import Loading from '../global/Loading.jsx'
const LoginComp = ({ updateForm }) => {
    const nav = useNavigate()
    const toast = useToast()
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [isLoading, setisLoading] = useState(false);

    const handleSubmit = async () => {
        setisLoading(true)
        try {
            const data = await api.post('/auth/register', { email, username, password })
            sessionStorage.setItem('accessToken', data.accessToken)

            setisLoading(false)
            toast.success('Account created!', 'Check your inbox to verify')
        }
        catch (error) {
            setisLoading(false)
            toast.error('Register failed', error.message)
        }
    }
    if (isLoading) { return <Loading /> }
    return (
        <div className='flex flex-col items-center justify-center w-3/12 h-8/12 bg-(--lc-surface) rounded-2xl border-(--lc-border-lit) border shadow-(--lc-glow-md)'>
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <img src={logo} alt='Logo' width={100} height={100} />
                <h1 className='text-xl  font-semibold text-(--lc-text) mb-4'>Lunar<span style={{ color: 'var(--lc-purple)' }}>cord</span> register</h1>
                <input className='w-9/12 h-10 rounded-2xl bg-(--lc-surface-2) text-(--lc-text) font-semibold pl-2 outline-0 border border-(--lc-border) mb-4 hover:border-(--lc-border-lit) hover:shadow-(--lc-glow-md)' type='text' onChange={(event) => setUsername(event.target.value)} name='username' placeholder='username' autoComplete='one-time-code' required />
                <input className='w-9/12 h-10 rounded-2xl bg-(--lc-surface-2) text-(--lc-text) font-semibold pl-2 outline-0 border border-(--lc-border) mb-4 hover:border-(--lc-border-lit) hover:shadow-(--lc-glow-md)' type='email' onChange={(event) => setEmail(event.target.value)} name='Email' placeholder='Email' autoComplete='one-time-code' required />
                <input className='w-9/12 h-10 rounded-2xl bg-(--lc-surface-2) text-(--lc-text) font-semibold pl-2 outline-0 border border-(--lc-border) mb-1 hover:border-(--lc-border-lit) hover:shadow-(--lc-glow-md)' type='password' onChange={(event) => setPassword(event.target.value)} name='Password' placeholder='Password' autoComplete='one-time-code' required />
                <input className='w-3/12 h-10 rounded-2xl bg-(--lc-surface-2) text-(--lc-text) font-semibold outline-0 border border-(--lc-border) mt-4 hover:border-(--lc-border-lit) hover:shadow-(--lc-glow-md)' type='button' name='Register' value='Register' onClick={handleSubmit} />
                <div className='w-full h-30 mt-8 flex justify-center'>
                    <h1 className='text-(--lc-text) text-sm mb-4'>Already have an account? <span className='text-(--lc-info) cursor-pointer' onClick={() => { updateForm(true) }}>Login</span></h1>
                </div>
            </div>
        </div>
    )
}

export default LoginComp