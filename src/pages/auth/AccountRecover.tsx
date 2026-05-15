import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router'
import { useState } from 'react'
import { useRecoverAccount } from '../../hooks/useAuth'
import { LoadingSpinner } from '../../components/ui/shared/LoadingSpinner'

export const AccountRecover = () => {
    const [email, setEmail] = useState('')
    const {isLoading, error, isSuccess, recover } = useRecoverAccount()
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        recover(email);
    } 

    if (isSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='flex flex-col w-full max-w-lg gap-10 mx-auto font-medium text-center'
            >
                <div className='flex flex-col gap-2'>
                    <h1 className='font-semibold text-3xl text-green-400'>Check your email!</h1>
                    <p>We have sent a account recover instructions to your email.</p>
                </div>
                <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link to='/login' className='p-3 px-10 w-full bg-button-gradient shadow-[0_0_40px_rgba(99,121,184,0.3)] rounded-xl font-semibold'>
                    Back to Login
                </Link></motion.button>
            </motion.div>
        )
    }

    return (
        <AnimatePresence>
        <motion.form initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} onSubmit={handleSubmit} className='flex flex-col w-full max-w-lg gap-5 mx-auto font-medium'>
            <div>
                <h1 className='font-semibold text-4xl'>Problems with account?</h1>
                <h2 className='font-medium text-xl text-[#CACACA]'>Enter your email!</h2>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Email</label>
                <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                />
            </div>

            <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                type='submit'
                disabled={isLoading}
                className="flex items-center justify-center p-3 w-full bg-button-gradient shadow-[0_0_40px_rgba(99,121,184,0.3)] rounded-xl font-semibold cursor-pointer select-none">
                {isLoading ? <LoadingSpinner /> : "Restore"}
            </motion.button>
            <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link to='/login' className='text-(--auth-main-color) select-none cursor-pointer'>
                Back to Login
            </Link></motion.button>
        </motion.form>
        </AnimatePresence>
    );
}