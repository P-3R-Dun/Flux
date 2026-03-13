    import { useState } from "react";
    import { motion, AnimatePresence } from 'motion/react'
    import FluxLogo from '../../assets/icons/brand/flux-logo.svg'
    import { useSound } from '../../hooks/useSound'

    interface introSlides {
        title: string;
        subtitle: React.ReactNode;
    }

    interface IntroProps {
        onComplete: () => void;
    }

    const slides: introSlides[] = [
        {title:'Flux', subtitle:<>The IO-43 most fluid budget planner. It is <span className="text-[#6379B8]">simple</span>, <span className="text-[#6379B8]">intuitive</span>, and <span className="text-[#6379B8]">modern!</span></>,},
        {title:"Flow", subtitle:<>Flux delivers financial insights <span className="text-[#6379B8]">faster</span> than any other application!</>},
        {title:'Control', subtitle:<>Master your money flow. <span className="text-[#6379B8]">Track expenses</span>, <span className="text-[#6379B8]">set</span> goals, and <span className="text-[#6379B8]">build</span> your wealth without the stress!</>},
        {title:'Security', subtitle:<>Your data is encrypted and protected. Keep your finances <span className="text-[#6379B8]">private</span> and <span className="text-[#6379B8]">safe!</span></>},
        {title:'Smart', subtitle:<><span className="text-[#6379B8]">Track</span> your daily spending and <span className="text-[#6379B8]">build</span> better financial habits. The smartest way to <span className="text-[#6379B8]">manage</span> your flow!</>}
    ];

    export const Intro = ({onComplete}: IntroProps) => {
        const { play } = useSound();
        const [SlideCounter, setSlideCounter] = useState(0);
        const slideHandle = () => {  
            if (SlideCounter < slides.length - 1) {
                play('BUTTON_SOUND')
                setSlideCounter(prev => prev + 1);
            } else {
                play('BUTTON_SOUND')
                localStorage.setItem('IntroCompleted', 'true');
                onComplete();
            }
        }
        return (
            <div className="relative min-h-dvh w-full bg-auth-gradient flex items-center justify-center px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40vh] 
                bg-[radial-gradient(ellipse_at_top,_rgba(99,121,184,0.4)_0%,_transparent_70%)] 
                pointer-events-none blur-[60px] z-0" />
                <motion.div key={'intro-wrapper'} 
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }} 
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.1, y: -20, filter: "blur(15px)" }} 
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-end pb-36 md:pb-0 md:justify-center min-h-dvh">
                        <div className="flex flex-col gap-5 items-start w-full max-w-lg">
                            <div className="flex flex-col justify-center min-h-48">
                                <div className="flex flex-col gap-3 text-left">
                                    <div className="flex flex-row gap-1 md:gap-2 items-center user-select-none">
                                        <img src={FluxLogo} alt="Flux" draggable="false" className="w-6"/>
                                        <h2 className="font-semibold text-2xl select-none">Flux</h2>
                                    </div>
                                    <div className="flex flex-row gap-2 w-full">
                                        <h1 className="text-4xl md:text-5xl font-semibold "><span className="block">Keep Your</span> Finances in <AnimatePresence mode="wait"><motion.span 
                                            key={SlideCounter} 
                                            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                                            transition={{ duration: 0.4, ease: "easeOut" }} 
                                            className="text-[#6379B8] inline-block font-bold md:w-48">
                                                {slides[SlideCounter].title}</motion.span></AnimatePresence>
                                        </h1> 
                                    </div>
                                    <AnimatePresence mode='wait'>
                                        <motion.h2 
                                            key={SlideCounter} 
                                            initial={{ opacity: 0, x: 15, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, x: -15, filter: "blur(10px)" }}
                                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} 
                                            className="max-w-sm font-medium">
                                                {slides[SlideCounter].subtitle}
                                        </motion.h2>
                                    </AnimatePresence>
                                </div>
                            </div>
                        <div className="flex flex-row gap-3">
                            {slides.map((_, index) =>
                                <motion.div key={index} animate={{
                                    width: index === SlideCounter ? 32 : 8,
                                    backgroundColor: index === SlideCounter ? "var(--auth-main-color)" : "white"
                                }} className={`w-2 h-2 rounded-full ${index == SlideCounter ? 'bg-(--auth-main-color)' : 'bg-white'}`}>
                                </motion.div>)
                            }
                        </div>
                        <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={slideHandle} className="p-3 w-full bg-button-gradient rounded-2xl select-none cursor-pointer shadow-[0_0_40px_rgba(99,121,184,0.3)]">{SlideCounter < slides.length - 1 ? 'Continue' : 'Start planning'}</motion.button>
                        <motion.button whileHover={{scale: 1.10}} whileTap={{scale: 0.95}} onClick={() => {
                            play('BUTTON_SOUND')
                            localStorage.setItem('IntroCompleted', 'true');
                            onComplete();
                            }} className="w-full cursor-pointer select-none">{"> Skip"}
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        )
    } 