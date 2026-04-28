import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import { AuthLayout } from '@/components/layout/shared/AuthLayout.tsx'
import { AuthGuard, GuestGuard } from '@/components/guards/GuardSys.tsx'
import { Login } from '@/pages/auth/Login.tsx'
import { Register } from '@/pages/auth/Register.tsx'
import { AccountRecover } from '@/pages/auth/AccountRecover.tsx'
import { ResetPass } from '@/pages/auth/PasswordReset.tsx'
import { Dashboard } from '@/pages/dashboard/mobile/DashboardPage.tsx'
import { LoadingPage } from '@/pages/Loading_page.tsx'
import { ActivateAccount } from '@/pages/auth/ActivateAccount.tsx'
import { AppLayout } from '@/components/layout/mobile/AppLayout.tsx'
import { useAuthStore } from '@/store/useAuthStore.ts'
import { TransactionCreatePage } from '@/pages/dashboard/mobile/TransactionCreate/TransactionCreatePage.tsx'
import { SettingPage } from '@/pages/dashboard/mobile/SettingPage.tsx'

function App() {
  const location = useLocation();
  const { checkAuth, isAuthChecking } = useAuthStore();
  const [isTimerLoading, setIsTimerLoading] = useState(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      setIsTimerLoading(true);
      prevPath.current = location.pathname;
    }

    const timer = setTimeout(() => {
      setIsTimerLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isAppLoading = isTimerLoading || isAuthChecking;

  return (
    <div className="min-h-dvh relative">      
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<GuestGuard />}>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account-recover" element={<AccountRecover />} />
                <Route path="/password-reset/:uid/:token" element={<ResetPass />} />
                <Route path="/activate/:uid/:token" element={<ActivateAccount />} />
              </Route>
            </Route>

            <Route element={<AuthGuard />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/history" element={<Dashboard />} />
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/goals" element={<Dashboard />} />
                <Route path="/settings" element={<SettingPage />} />
              </Route>
              <Route path="/add-transaction" element={<TransactionCreatePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isAppLoading && (
          <motion.div
            key="global-loader"
            className="fixed inset-0 z-50 bg-[#0D1117]" 
            initial={{ opacity: 1 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }}
          >
            <LoadingPage />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;