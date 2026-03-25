import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router'
import React, { useState, useEffect } from 'react'
import { useLogin } from '../../hooks/useAuth'
import { useSound } from '../../hooks/useSound'
import { LoadingSpinner } from '../../components/ui/shared/LoadingSpinner'
import { Eye, EyeOff } from 'lucide-react';

export const Login = () => {
    const { play } = useSound();
    const [Login, setLogin] = useState("")
    const [Password, setPassword] = useState("")
    const {isLoading, error, login} = useLogin()
    const [rememberMe, setRememberMe] = useState(false)
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(Login, Password, rememberMe)
    } 

    useEffect(() => {
        if (error) {
            play('ERROR_SOUND')
        }
    },[error])

    return (
        <AnimatePresence mode='wait'>
        <motion.form initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} onSubmit={handleSubmit} className='flex flex-col w-full max-w-lg gap-5 mx-auto font-medium'>
            <div>
                <h1 className='font-semibold text-4xl'>Welcome!</h1>
                <h2 className='font-medium text-xl text-[#CACACA]'>Glad to see you again!</h2>
            </div>

            {error && (
                <motion.div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </motion.div>
            )}

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Login or Email</label>
                <input 
                    type="text" value={Login} onChange={(e) => setLogin(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                />
            </div>

            <label className='flex flex-col gap-1.5 relative'>
                <span className='text-sm ml-1'>Password</span>
                <div className='relative flex items-center'>
                    <input 
                        type={isKeyVisible ? "text" : "password"} 
                        value={Password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        disabled={isLoading}
                        className='bg-(--auth-input-color) rounded-md outline-none p-1 pr-10 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                    />
                    <button
                        type="button"
                        onClick={() => setIsKeyVisible(!isKeyVisible)}
                        className="absolute right-3 text-[#CACACA] hover:text-white transition-colors cursor-pointer"
                    >
                        {isKeyVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </label>

            <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-1 cursor-pointer select-none'>                
                    <input type="checkbox" className='accent-(--auth-main-color)' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
                    <span>Remember me</span>
                </label>
                <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link onClick={() => play('BUTTON_SOUND')} to='/account-recover' className='text-(--auth-main-color) select-none cursor-pointer'>
                    Have some troubles?
                </Link></motion.button>
            </div>

            <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                type='submit'
                onClick={() => play('BUTTON_SOUND')}
                disabled={isLoading}
                className="flex items-center justify-center p-3 w-full bg-button-gradient rounded-xl font-semibold cursor-pointer select-none shadow-[0_0_40px_rgba(99,121,184,0.3)]">
                {isLoading ? <LoadingSpinner /> : "Log In"}
            </motion.button>

            <div className='flex justify-start gap-1.5 text-sm'>
                <p className='text-[#CACACA]'>Need an account?</p>
                <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link onClick={() => play('BUTTON_SOUND')} to='/register' className='text-(--auth-main-color) select-none cursor-pointer'>
                    Register
                </Link></motion.button>
            </div>
        </motion.form>
        </AnimatePresence>
    )
}