import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { LoadingSpinner } from "./../components/ui/shared/LoadingSpinner"
import FluxLogo from './../assets/icons/brand/flux-logo.svg'

const Tips = [
    "Finding a free outlet in KPI is harder than debugging this app",
    "Calculus is temporary. IO-43 is forever",
    "If you can read this, you are too close to the screen",
    "Don't worry, our code has fewer bugs than the 18th building has stairs",
    "If the app crashes, blame Kushnirenko. If it's fast, thank Shepitko",
    "Fun fact: Vlad Shepitko is officially the 'Cooler Vlad' according to the source code",
    "I guess it’s obvious which Vlad made this page",
    "We are polishing the pixels. Please stand by",
    "Pro tip: If it doesn't work, try turning the world off and on again",
    "Hello World! I guess..."
]

export const LoadingPage = () => {
    const [tipIndex, setTipIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % Tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        
        <div className='flex flex-col items-center h-dvh p-6'>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh] 
                    bg-[radial-gradient(ellipse_at_top,rgba(99,121,184,0.4)_0%,transparent_70%)] 
                    pointer-events-none blur-[60px] z-0" />
            <div className='flex-1 flex flex-col items-center justify-center gap-10'>
                <img src={FluxLogo} alt="Flux Logo" className='w-24 h-24 md:w-36 md:h-36'/>
                <LoadingSpinner widthClass='w-10 md:w-12' heightClass='h-10 md:h-12' borderClass='border-3 md:border-4'/>
            </div>
            <div className='h-12 flex items-center justify-center mb-6'>
                <AnimatePresence mode="wait">
                    <motion.p
                        key={tipIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className='text-[#6379B8] text-center text-sm md:text-base italic'
                    >
                        {Tips[tipIndex]}
                    </motion.p>
                </AnimatePresence>
            </div>
        </div>  
    )
}