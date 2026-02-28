import { Routes, Route } from 'react-router'
import { AuthLayout } from './components/layout/AuthLayout'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPass } from './pages/auth/Forgot_password'
import { ResetPass } from './pages/auth/Password_reset'

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/forgot-password' element={<ForgotPass />}/>
        <Route path='/password-reset/:uid/:token' element={<ResetPass />}/>
      </Route>
    </Routes>
  );
}

export default App
