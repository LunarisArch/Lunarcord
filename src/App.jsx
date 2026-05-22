import { Routes, Route } from 'react-router-dom'
import VerifyEmail from './Pages/VerifyEmail.jsx';
import Auth from './Pages/Auth'
import Lost from './Pages/404.jsx';
import Landing from './Pages/Landing.jsx';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/authentication' element={<Auth />} />
      <Route path="*" element={<Lost />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
    </Routes>
  )
}

export default App
