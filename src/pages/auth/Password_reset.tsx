import { motion, AnimatePresence } from 'motion/react'
import { Link, useParams } from 'react-router'
import { useState, useEffect } from 'react'
import { useSound } from '../../hooks/useSound'
import { useReset } from '../../hooks/useAuth'

export const ResetPass = () => {
    const { play } = useSound();
    const [new_password, setNewPassword] = useState('')
    const [re_new_password, setReNewPassword] = useState('')
    const { uid, token } = useParams();

    const {isLoading, error, isSuccess, resetPassword } = useReset()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetPassword(new_password, re_new_password, uid || '', token || '');
    } 

    useEffect(() => {
        if (error) {
            play('ERROR_SOUND')
        }
    },[error])

    useEffect(() => {
        if (isSuccess) {
            play('SUCCESS_SOUND')
        }
    },[isSuccess])

    if (isSuccess) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='flex flex-col w-full max-w-lg gap-10 mx-auto font-medium text-center'
            >
                <div className='flex flex-col gap-2'>
                    <h1 className='font-semibold text-3xl text-green-400'>Password changed!</h1>
                    <p>Now you can try log in again!</p>
                </div>
                <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link to='/login' onClick={() => play('BUTTON_SOUND')} className='p-3 px-10 w-full bg-[#403D97] rounded-xl font-semibold'>
                    Back to Login
                </Link></motion.button>
            </motion.div>
        )
    }

    return (
        <AnimatePresence>
        <motion.form initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} onSubmit={handleSubmit} className='flex flex-col w-full max-w-lg gap-5 mx-auto font-medium'>
            <div>
                <h1 className='font-semibold text-4xl'>Change the Password!</h1>
                <h2 className='font-medium text-xl text-[#CACACA]'>Enter your new password to gain Flux App access!</h2>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Password</label>
                <input 
                    type="password" value={new_password} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-button-color)/50 transition-all'
                />
            </div>

             <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Confirm Password</label>
                <input 
                    type="password" value={re_new_password} onChange={(e) => setReNewPassword(e.target.value)} disabled={isLoading}
                    className='bg-[#403D97] rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-button-color)/50 transition-all'
                />
            </div>

            <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                type='submit'
                onClick={() => play('BUTTON_SOUND')}
                disabled={isLoading}
                className="p-3 w-full bg-(--auth-button-color) drop-shadow-lg rounded-xl font-semibold cursor-pointer select-none">
                {isLoading ? "Loading..." : "Change Password"}
            </motion.button>
            <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link onClick={() => play('BUTTON_SOUND')} to='/login' className='text-(--auth-button-color) select-none cursor-pointer'>
                Back to Login
            </Link></motion.button>
        </motion.form>
        </AnimatePresence>
    );
}