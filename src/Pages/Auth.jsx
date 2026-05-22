import React, { useState } from 'react'
import LoginComp from '../components/Auth/LoginComp'
import RegComp from '../components/Auth/RegComp'
import Particles from '../components/global/Particles'

function Auth() {
  const [isLoginFrom, setIsLoginFrom] = useState(true)
  return (
    <div className='w-full h-screen bg-(--lc-bg) flex justify-center items-center' style={{ position: 'relative' }}>
      <Particles />
      <div className='w-full h-screen flex justify-center items-center' style={{ position: 'relative', zIndex: 1 }}>
        {isLoginFrom ? <LoginComp updateForm={setIsLoginFrom} /> : <RegComp updateForm={setIsLoginFrom} />}
      </div>
    </div>
  )
}

export default Auth