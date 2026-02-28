import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router'
import React, { useState, useEffect } from 'react'
import { useLogin } from '../../hooks/useAuth'
import { useSound } from '../../hooks/useSound'



export const Login = () => {
    const { play } = useSound();
    const [Login, setLogin] = useState("")
    const [Password, setPassword] = useState("")
    const {isLoading, error, login} = useLogin()
    const [rememberMe, setRememberMe] = useState(false)

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
        <motion.form initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} onSubmit={handleSubmit} className='flex flex-col w-full max-w-lg gap-6 mx-auto font-medium'>
            <div>
                <h1 className='font-semibold text-4xl'>Welcome!</h1>
                <h2 className='font-medium text-xl text-[#CACACA]'>Glad to see you again!</h2>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Login</label>
                <input 
                    type="text" value={Login} onChange={(e) => setLogin(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-button-color)/50 transition-all'
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Password</label>
                <input 
                    type="password" value={Password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-button-color)/50 transition-all'
                />
            </div>

            <div className='flex items-center justify-between text-sm'>
                <label className='flex items-center gap-1 cursor-pointer select-none'>                
                    <input type="checkbox" className='accent-(--auth-button-color)' checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}/>
                    <span>Remember me</span>
                </label>
                <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link onClick={() => play('BUTTON_SOUND')} to='/forgot-password' className='text-(--auth-button-color) select-none cursor-pointer'>
                    Forgot your Password?
                </Link></motion.button>
            </div>

            <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                type='submit'
                onClick={() => play('BUTTON_SOUND')}
                disabled={isLoading}
                className="p-3 w-full bg-(--auth-button-color) drop-shadow-lg rounded-xl font-semibold cursor-pointer select-none">
                {isLoading ? "Loading..." : "Log in"}
            </motion.button>

            <div className='flex justify-start gap-1.5 text-sm'>
                <p className='text-[#CACACA]'>Need an account?</p>
                <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link onClick={() => play('BUTTON_SOUND')} to='/register' className='text-(--auth-button-color) select-none cursor-pointer'>
                    Register
                </Link></motion.button>
            </div>
        </motion.form>
        </AnimatePresence>
    )
}