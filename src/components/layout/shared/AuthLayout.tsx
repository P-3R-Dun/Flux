import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { Outlet } from 'react-router'
import { Intro } from '../../../pages/auth/Intro'
import { useSound } from '../../../hooks/useSound'
import FluxLogo from './../../../assets/icons/brand/flux-logo.svg'

export const AuthLayout = () => {
    const { play } = useSound();
    const [isIntroCompleted, setIsIntroCompleted] = useState(() => localStorage.getItem('IntroCompleted') === 'true');
    const testingButton = () => {
        localStorage.setItem('IntroCompleted', 'false');
        play('BUTTON_SOUND')
        setIsIntroCompleted(false);
    }

    return (
        <div className='bg-auth-gradient overflow-hidden'>
            <AnimatePresence mode='wait'> {!isIntroCompleted ? <Intro key="intro-screen" onComplete={() => setIsIntroCompleted(true)} /> :
                <motion.div key='auth_layout' initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} exit={{opacity: 0}} className='flex flex-col items-center min-h-dvh p-6 text-white'>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh] 
                    bg-[radial-gradient(ellipse_at_top,rgba(99,121,184,0.4)_0%,transparent_70%)] 
                    pointer-events-none blur-[60px] z-0" />
                    <div className='flex justify-between w-full'>
                        <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}  
                        onClick={testingButton} className='z-10 flex items-center gap-2 font-semibold select-none cursor-pointer'>
                            <img className='w-10 h-10 select-none pointer-events-none' src={FluxLogo} alt="Flux Logo" draggable="false"/>
                            <h3 className='text-2xl tracking-tight'>Flux</h3>
                    </motion.div>
                    </div>
                    <main className='flex flex-col grow w-full justify-center z-10 items-center'>
                        <Outlet />
                    </main>
                </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}