import { useState } from "react";
import { motion, AnimatePresence } from 'motion/react'
import FluxLogo from '../../assets/icons/brand/flux-logo.svg'
import { useSound } from '../../hooks/useSound'

interface introSlides {
    title: string;
    subtitle: string;
    img?: string;
}

interface IntroProps {
    onComplete: () => void;
}

const slides: introSlides[] = [
    {img:FluxLogo, title:'Flux', subtitle:'The IO-43 most fluid budget planner. It is simple, intuitive, and modern!',},
    {title:"Flow", subtitle:'Flux delivers financial insightsfaster than any other application!'},
    {title:'Control', subtitle:'Flux makes planning your future effortless and clear!'},
    {title:'Security', subtitle:'Your data is encrypted and protected. Keep your finances private and safe!'},
    {title:'Smart', subtitle:'Flux tracks every penny. Get a clear view of your wealth!'}
];

export const Intro = ({onComplete}: IntroProps) => {
    const { play } = useSound();
    const [SlideCounter, setSlideCounter] = useState(0);
    const slideHandle = () => {
        play('BUTTON_SOUND')   
        if (SlideCounter < slides.length - 1) {
            setSlideCounter(prev => prev + 1);
        } else {
            localStorage.setItem('IntroCompleted', 'true');
            onComplete();
        }
    }
    return (
    <div className="px-6 flex flex-col gap-5 bg-main-gradient items-center justify-center min-h-screen text-center">
        <motion.div key={'intro-wrapper'} exit={{ opacity: 0, scale: 0.9, y:-20, filter: "blur(15px)" }} transition={{duration: 1}} className="flex flex-col gap-5 items-center justify-center min-h-screen text-center">
        <div className="flex flex-col justify-center h-40"><AnimatePresence mode="wait">
            <motion.div key={SlideCounter} 
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(15px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(15px)" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="flex flex-col gap-5 items-center">
                <div className="flex flex-row">
                    {slides[SlideCounter].img != undefined ? <img className="w-18 h-14" src={slides[SlideCounter].img} alt="" /> : null}
                    <h1 className="text-5xl font-semibold ">{slides[SlideCounter].title}</h1> 
                </div>
                <h2 className="text-lg max-w-md mx-auto">{slides[SlideCounter].subtitle}</h2>
            </motion.div>
        </AnimatePresence></div>
        <div className="flex flex-row gap-3">
            {slides.map((_, index) =>
                <motion.div key={index} animate={{
                    width: index === SlideCounter ? 24 : 12,
                    backgroundColor: index === SlideCounter ? "#4848A3" : "rgba(255,255,255,0.2)"
                    }} className={`w-3 h-3 rounded-full ${index == SlideCounter ? 'bg-(--auth-button-color)' : 'bg-white'}`}>
                </motion.div>)
            }
        </div>
        <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={slideHandle} className="p-3 w-72 bg-(--auth-button-color) drop-shadow-md rounded-2xl select-none cursor-pointer">{SlideCounter < slides.length - 1 ? 'Continue' : 'Start planning'}</motion.button>
        <motion.button whileHover={{scale: 1.20}} whileTap={{scale: 0.95}} onClick={() => {
                play('BUTTON_SOUND')
                localStorage.setItem('IntroCompleted', 'true');
                onComplete();
        }} className="w-72 cursor-pointer select-none">{"> Skip"}</motion.button>
        </motion.div>
    </div>
    )
} 