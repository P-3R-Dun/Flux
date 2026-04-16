import { motion, AnimatePresence } from 'motion/react'
import { Link } from 'react-router'
import { useState } from 'react'
import { useRegister } from '../../hooks/useAuth'
import { LoadingSpinner } from '../../components/ui/shared/LoadingSpinner'
import { Eye, EyeOff } from 'lucide-react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Register = () => {
    const { isLoading, error, isSuccess, register} = useRegister();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isAgreed, setIsAgreed] = useState(false);
    const [isKeyVisible, setIsKeyVisible] = useState(false);
    const isFormValid = username.trim() !== '' && emailRegex.test(email) && isAgreed && password.trim() !== ''
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(email, username, password, confirmPassword)
    }

    if (isSuccess) {
        return (
            <AnimatePresence mode='wait'>
                <motion.div 
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className='flex flex-col w-full max-w-lg gap-8 mx-auto text-center'
                >
                    <div className='flex flex-col gap-4'>
                        <h1 className='font-semibold text-4xl text-green-400'>Check your email!</h1>
                        <p className='font-medium text-xl text-[#CACACA]'>
                            We've sent an activation link to <br/>
                            <span className='text-white font-bold'>{email}</span>
                        </p>
                    </div>

                    <div className='bg-[#232344] p-6 rounded-2xl border border-[#3D3D66] text-sm text-[#CACACA] leading-relaxed'>
                        Please click the link in the email to verify your account. 
                        If you don't see it, check your <strong>Spam</strong> folder.
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className='text-(--auth-main-color) font-semibold'
                    >
                        <Link to='/login'>Back to Login</Link>
                    </motion.button>
                </motion.div>
            </AnimatePresence>
        )
    }

    return (
        <AnimatePresence mode='wait'>
            <motion.form initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} onSubmit={handleSubmit} className='flex flex-col w-full max-w-lg gap-5 mx-auto font-medium'>
                <div>
                    <h1 className='font-semibold text-4xl'>Create an account</h1>
                    <h2 className='font-medium text-xl text-[#CACACA]'>Start your financial journey with us!</h2>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <label className='flex flex-col gap-1.5'>
                    <span className='text-sm ml-1'>Email</span>
                    <input 
                        type="email" onChange={(e) => setEmail(e.target.value)} value={email} disabled={isLoading} autoComplete="email"
                        className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                    />
                </label>

                <label className='flex flex-col gap-1.5'>
                    <span className='text-sm ml-1'>Username</span>
                    <input 
                        type="text" onChange={(e) => setUsername(e.target.value)} value={username} disabled={isLoading}
                        className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                    />
                </label>

                <label className='flex flex-col gap-1.5 relative'>
                    <span className='text-sm ml-1'>Password</span>
                    <div className='relative flex items-center'>
                        <input 
                            type={isKeyVisible ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            disabled={isLoading}
                            autoComplete="new-"
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

                <label className='flex flex-col gap-1.5'>
                    <span className='text-sm ml-1'>Confirm Password</span>
                    <input 
                        type={isKeyVisible ? "text" : "password"} onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} disabled={isLoading}
                        className='bg-(--auth-input-color) rounded-md outline-none p-1 w-full focus:ring-2 ring-(--auth-main-color)/50 transition-all'
                    />
                </label>

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
                    disabled={isLoading || !isFormValid}    
                    className={`p-3 w-full flex items-center justify-center ${isFormValid ? 'bg-button-gradient cursor-pointer shadow-[0_0_40px_rgba(99,121,184,0.3)]' : 'bg-button-disabled-gradient cursor-not-allowed shadow-[0_0_40px_rgba(179,179,179,0.3)]' } rounded-xl font-semibold select-none`}>
                    {isLoading ? <LoadingSpinner /> : "Next"}
                </motion.button>

                <div className='flex justify-start gap-1.5 text-sm'>
                    <p>Have an account?</p>
                    <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}}><Link to='/login' className='text-(--auth-main-color) select-none cursor-pointer'>
                        Log in
                    </Link></motion.button>
                </div>
            </motion.form>
        </AnimatePresence>
    )
}