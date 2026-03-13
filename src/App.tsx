import { Routes, Route, Navigate } from 'react-router'
import { AuthLayout } from './components/layout/shared/AuthLayout'
import { Login } from './pages/auth/Login'
import { Register } from './pages/auth/Register'
import { ForgotPass } from './pages/auth/Forgot_password'
import { ResetPass } from './pages/auth/Password_reset'
import { AuthGuard, GuestGuard } from './components/guards/GuardSys'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} /> 
      <Route element={<GuestGuard />}>
        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/forgot-password' element={<ForgotPass />}/>
          <Route path='/password-reset/:uid/:token' element={<ResetPass />}/>
        </Route>
      </Route>
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
      </Route>
    </Routes>
  );
}

export default App
