import React, { useEffect, useRef } from 'react'

const Particles = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      drift: (Math.random() - 0.5) * 0.3,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.y -= p.speed
        p.x += p.drift
        p.alpha -= 0.0015

        if (p.y < -10 || p.alpha <= 0) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + 10
          p.alpha = Math.random() * 0.5 + 0.2
          p.speed = Math.random() * 0.5 + 0.2
          p.r = Math.random() * 2.5 + 0.5
          p.drift = (Math.random() - 0.5) * 0.3
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(191, 0, 255, ${p.alpha})`
        ctx.shadowColor = 'rgba(191, 0, 255, 0.8)'
        ctx.shadowBlur = 6
        ctx.fill()
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default Particles