import { motion, AnimatePresence } from 'motion/react'
import { useNavigate, useParams, Link } from 'react-router'
import { useEffect, useState, useRef } from 'react'
import { useSound } from '../../hooks/useSound'
import { useActivateAccount } from '../../hooks/useAuth'
import { LoadingPage } from '../Loading_page'
import { LoadingSpinner } from '../../components/ui/shared/LoadingSpinner'

export const ActivateAccount = () => {
    const { play } = useSound();
    const { uid, token } = useParams();
    const Navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(10);
    const hasFetched = useRef(false);

    const {isLoading, error, isSuccess, activateAccount } = useActivateAccount()
    
    useEffect(() => {
        if (error) {
            play('ERROR_SOUND')
        }
    },[error])

    useEffect(() => {
        if (isSuccess) {        
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        Navigate('/');
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isSuccess, Navigate]);

    useEffect(() => {
        if (isSuccess) {
            play('SUCCESS_SOUND');
        }
    }, [isSuccess])

    useEffect(() => {
        if (!hasFetched.current && uid && token) {
            activateAccount(uid, token);
            hasFetched.current = true;
        }
    }, [uid, token, activateAccount]);

    if (isLoading) {
        return (
            <LoadingPage />
        )
    }

    if (isSuccess) {
        return (
            <AnimatePresence mode="wait">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='flex flex-col w-full max-w-lg gap-10 mx-auto font-medium text-center'
                >
                    <div className='flex flex-col gap-2'>
                        <h1 className='font-semibold text-3xl text-green-400'>Account successfuly Activated!</h1>
                        <p>Now you can try to use our app!</p>
                    </div>
                    <motion.button 
                        whileHover={{scale: 1.05}} 
                        whileTap={{scale: 0.95}}>
                            <Link 
                                onClick={() => play('BUTTON_SOUND')} 
                                to='/' 
                                className="flex items-center justify-center p-3 w-full bg-button-gradient rounded-xl font-semibold cursor-pointer select-none shadow-[0_0_40px_rgba(99,121,184,0.3)]">
                                {isLoading ? <LoadingSpinner /> : "Back to Log In"}
                            </Link>
                    </motion.button>
                    <p className="text-[#CACACA] mt-4">
                        You will be automatically redirected to Log in page in <span className="text-white font-bold">{timeLeft}</span> seconds...
                    </p>
                </motion.div>
            </AnimatePresence>
        )
    }

    if (error) {
        return (
            <AnimatePresence mode="wait">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className='flex flex-col w-full max-w-lg gap-8 mx-auto font-medium text-center'
                >
                    <div className='flex flex-col gap-4'>
                        <div className="mx-auto w-20 h-20 bg-red-500/10 border border-red-500/50 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-4xl">!</span>
                        </div>
                        <h1 className='font-semibold text-3xl text-red-500'>Activation Failed</h1>
                        <p className="text-[#CACACA]">
                            {error || "The activation link is invalid or has already expired."}
                        </p>
                    </div>

                    <motion.button 
                        whileHover={{scale: 1.05}} 
                        whileTap={{scale: 0.95}}>
                            <Link 
                                onClick={() => play('BUTTON_SOUND')} 
                                to='/register' 
                                className="flex items-center justify-center p-3 w-full bg-button-gradient rounded-xl font-semibold cursor-pointer select-none shadow-[0_0_40px_rgba(99,121,184,0.3)]">
                                {isLoading ? <LoadingSpinner /> : "Back to Register"}
                            </Link>
                    </motion.button>
                </motion.div>
            </AnimatePresence>
        )
    }

}