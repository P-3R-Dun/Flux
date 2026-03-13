import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router'
import { useState, useEffect } from 'react'
import { useRegister } from '../../hooks/useAuth'
import { useSound } from '../../hooks/useSound'

export const Register  = () => {
    const { play } = useSound();
    const [Email, setEmail] = useState("")
    const [Login, setLogin] = useState("")
    const [Password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isAgreed, setIsAgreed] = useState(false)
    const {isLoading, error, register} = useRegister()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(Email, Login, Password, confirmPassword)
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
                <h1 className='font-semibold text-4xl'>Create an account</h1>
                <h2 className='font-medium text-xl text-[#CACACA]'>Start your financial journey with us!</h2>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Email</label>
                <input 
                    type="email" onChange={(e) => setEmail(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Username</label>
                <input 
                    type="text" onChange={(e) => setLogin(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Password</label>
                <input
                    type="password" onChange={(e) => setPassword(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                />
            </div>

            <div className='flex flex-col gap-1.5'>
                <label className='text-sm ml-1'>Confirm Password</label>
                <input 
                    type="password" onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading}
                    className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                />
            </div>

            <div className='flex items-center justify-between text-sm'>
                <label className='flex gap-2 cursor-pointer select-none items-start'>                
                    <input type="checkbox" className='accent-(--auth-main-color)' checked={isAgreed} onChange={(e) => setIsAgreed(e.target.checked)}/>
                    <span>I agree to the <Link to="/terms" className="text-(--auth-main-color) self-start">Terms of Use</Link> and consent to the processing of my personal data in accordance with the <Link to="/privacy" className="text-(--auth-main-color) self-start">Privacy Policy</Link></span>
                </label>
            </div>

            <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                type="submit"
                disabled={isLoading || !isAgreed}
                onClick={() => play('BUTTON_SOUND')}    
                className={`p-3 w-full ${isAgreed ? 'bg-button-gradient cursor-pointer shadow-[0_0_40px_rgba(99,121,184,0.3)]' : 'bg-button-disabled-gradient cursor-not-allowed shadow-[0_0_40px_rgba(179,179,179,0.3)]' } rounded-xl font-semibold select-none`}>
                {isLoading ? "Loading..." : "Sign Up"}
            </motion.button>

            <div className='flex justify-start gap-1.5 text-sm'>
                <p className='text-[#CACACA]'>Have an account?</p>
                <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link to='/login' onClick={() => play('BUTTON_SOUND')} className='text-(--auth-main-color) select-none cursor-pointer'>
                    Log in
                </Link></motion.button>
            </div>
        </motion.form>
        </AnimatePresence>
    )
}