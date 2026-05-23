import { Routes, Route } from 'react-router-dom'
import VerifyEmail from './Pages/VerifyEmail.jsx';
import Auth from './Pages/Auth'
import Lost from './Pages/404.jsx';
import Landing from './Pages/Landing.jsx';
import Dashboard from './Pages/Dashboard.jsx';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Landing />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/auth' element={<Auth />} />
      <Route path="*" element={<Lost />} />
      <Route path='/verify-email' element={<VerifyEmail />} />
    </Routes>
  )
}

export default App
