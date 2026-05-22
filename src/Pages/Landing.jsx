import React, { useState, useEffect } from 'react'
import Particles from '../components/global/Particles'
import api from '../lib/api'

function Landing() {
    const [latency, setLatency] = useState('--')

    useEffect(() => {
        const fetchLatency = async () => {
            const ms = await api.latency()
            if (ms !== null) setLatency(ms)
        }

        // Initial check
        fetchLatency()

        // Refresh every 5 seconds
        const interval = setInterval(fetchLatency, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className='w-full min-h-screen bg-(--lc-bg) flex flex-col items-center justify-center relative overflow-hidden font-sans'>
            <Particles />

            {/* Navigation */}
            <nav className='absolute top-0 w-full max-w-7xl flex justify-between items-center p-6 z-10'>
                <div className='text-2xl font-bold text-(--lc-text) tracking-wider'>Lunar<span className='text-(--lc-purple)'>cord</span></div>

                <div className='hidden md:flex gap-8 text-(--lc-muted) font-medium text-sm'>
                    <a href="/about" className='hover:text-(--lc-text) transition-colors'>About</a>
                    <a href="/status" className='hover:text-(--lc-text) transition-colors'>Status</a>
                    <a href="/developer/portal" className='hover:text-(--lc-text) transition-colors'>Dev</a>
                    <a href="/blog" className='hover:text-(--lc-text) transition-colors'>Blog</a>
                    <a href="/roadmap" className='hover:text-(--lc-text) transition-colors'>Roadmap</a>
                </div>

                <a href="/authentication" className='px-5 py-2 rounded border border-(--lc-border-dim) text-(--lc-text) hover:border-(--lc-border-lit) hover:bg-(--lc-surface-3) transition-all inline-block'>
                    Get started
                </a>
            </nav>

            <main className='relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-6xl px-8 gap-12'>
                <div className='flex-1 max-w-lg'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded border border-(--lc-border) bg-(--lc-surface-2) text-(--lc-text) text-xs font-mono mb-8'>
                        <span className='w-2 h-2 rounded-full bg-(--lc-success) animate-pulse'></span>
                        SYS_SECURE_CONNECTION
                    </div>

                    <h1 className='text-5xl md:text-6xl font-extrabold text-(--lc-text) mb-6 leading-tight'>
                        Privacy isn't a feature. <br />
                        <span className='text-(--lc-purple) drop-shadow-(--lc-glow-sm)'>It's the foundation.</span>
                    </h1>
                </div>

                {/* Right Terminal Block */}
                <div className='flex-1 w-full max-w-xl select-none'>
                    <div className='bg-(--lc-surface) border border-(--lc-border) rounded-lg shadow-(--lc-glow-lg) overflow-hidden font-mono text-sm'>
                        <div className='bg-(--lc-surface-2) px-4 py-2 border-b border-(--lc-border-dim) flex items-center gap-2'>
                            <div className='w-3 h-3 rounded-full bg-(--lc-danger)'></div>
                            <div className='w-3 h-3 rounded-full bg-(--lc-warning)'></div>
                            <div className='w-3 h-3 rounded-full bg-(--lc-success)'></div>
                            <span className='ml-2 text-(--lc-muted) text-xs'>bash - root@lunarcord</span>
                        </div>

                        <div className='p-6 text-(--lc-text) leading-relaxed'>
                            <div className='mb-2'><span className='text-(--lc-success)'>user@local:~$</span> ./connect --secure --network=lunarcord</div>
                            <div className='text-(--lc-muted) mb-1'>[INFO] Handshake initiated...</div>
                            <div className='text-(--lc-muted) mb-4'>[INFO] Establishing end-to-end tunnel... <span className='text-(--lc-success)'>OK</span></div>

                            <div className='text-(--lc-purple-glow) font-bold mb-2'>
                                &gt; CONNECTION ESTABLISHED. WELCOME TO THE VOID.
                            </div>

                            <div className='mb-4 text-(--lc-info)'>
                                Current latency: {latency}ms | Trackers blocked: 100%
                            </div>

                            <div className='flex items-center'>
                                <span className='text-(--lc-success)'>user@lunarcord:~$</span>
                                <span className='w-2 h-4 bg-(--lc-text) ml-2 animate-pulse'></span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Landing