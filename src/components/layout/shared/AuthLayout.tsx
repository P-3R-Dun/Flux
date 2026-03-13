import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { Outlet } from 'react-router'
import { Intro } from '../../../pages/auth/Intro'
import { useSound } from '../../../hooks/useSound'
import FluxLogo from './../../../assets/icons/brand/flux-logo.svg'

export const AuthLayout = () => {
    const { play } = useSound();
    const musicRef = useRef<HTMLAudioElement | null>(null);
    const [isIntroCompleted, setIsIntroCompleted] = useState(
        localStorage.getItem('IntroCompleted') === 'true'
    );
    const [isMusicActive, setIsMusicActive] = useState(false);

    const testingButton = () => {
        localStorage.setItem('IntroCompleted', 'false');
        play('BUTTON_SOUND')
        setIsIntroCompleted(false);
    }

    useEffect(() => {
    return () => {
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current = null;
            }
        }
    }, []);

    const initMusic = () => {
        musicRef.current = play('AUTH_AMBIENT', true);
        setIsMusicActive(true);
    }

    const handleUserInteraction = () => {
        if (!musicRef.current) {
            initMusic();
        }
    }

    const handleMusicPause = () => {
        if (!musicRef.current) {
            initMusic();
        } else {
            if (isMusicActive) {
                musicRef.current.pause();
                setIsMusicActive(false);
            } else {
                musicRef.current.play();
                setIsMusicActive(true);
            }
        }
    }

    return (
        <div className='bg-auth-gradient overflow-hidden' onClick={handleUserInteraction}>
            <AnimatePresence mode='wait'> {!isIntroCompleted ? <Intro key="intro-screen" onComplete={() => setIsIntroCompleted(true)} /> :
                <motion.div key='auth_layout' initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 1}} exit={{opacity: 0}} className='flex flex-col items-center justify-center min-h-dvh p-6 text-white'>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh] 
                    bg-[radial-gradient(ellipse_at_top,_rgba(99,121,184,0.4)_0%,_transparent_70%)] 
                    pointer-events-none blur-[60px] z-0" />
                    <motion.div
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleMusicPause}
                        className="absolute z-10 top-6 right-6 flex items-center justify-center w-12 h-12 rounded-xl cursor-pointer select-none bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transition-colors duration-300">
                        <motion.span
                            key={isMusicActive ? 'on' : 'off'}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-xl">
                            {isMusicActive ? '🔈' : '🔇'}
                        </motion.span>
                    </motion.div>            
                    <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}  
                        onClick={testingButton} className='absolute z-10 top-6 left-6 flex items-center gap-2 font-semibold select-none cursor-pointer'>
                            <img className='w-10 h-10 select-none pointer-events-none' src={FluxLogo} alt="Flux Logo" draggable="false"/>
                            <h3 className='text-2xl tracking-tight'>Flux</h3>
                    </motion.div>
                    <main className='w-full flex justify-center z-10'>
                        <Outlet />
                    </main>
                </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}