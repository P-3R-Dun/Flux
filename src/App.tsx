import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import { AuthLayout } from './components/layout/shared/AuthLayout.tsx'
import { AuthGuard, GuestGuard } from './components/guards/GuardSys.tsx'
import { Login } from './pages/auth/Login.tsx'
import { Register } from './pages/auth/Register.tsx'
import { ForgotPass } from './pages/auth/Forgot_password.tsx'
import { ResetPass } from './pages/auth/Password_reset.tsx'
import { DashboardHeader } from './components/ui/mobile/dashboard/DashboardHeader.tsx'
import { LoadingPage } from './pages/Loading_page.tsx'
import { TestingUI } from './components/ui/TestingUI.tsx'


function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/') {
      setIsAppLoading(false);
    } else {
      setIsAppLoading(true)
    }

    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]); 

  return (
    <div className="min-h-dvh">
      <AnimatePresence mode="wait">
        {isAppLoading ? (
          <motion.div
            key="global-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingPage />
          </motion.div>
        ) : (
          <motion.div
            key="app-main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/test" element={<TestingUI />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route element={<GuestGuard />}>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPass />} />
                  <Route path="/password-reset/:uid/:token" element={<ResetPass />} />
                </Route>
              </Route>

              <Route element={<AuthGuard />}>
                <Route
                  path="/dashboard"
                  element={<DashboardHeader name="0xVShO" />}
                />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;