import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { WheelPicker } from '@/components/wheel-picker';
import { useTransactionCreateStore } from '@/store/useTransactionCreateStore';

export const StepDateTime = () => {
    const { date, name, brand_logo_url, setField, nextStep, setStep } = useTransactionCreateStore(); 
    const initialDate = date ? new Date(date) : new Date();
    const [selectionType, setSelectionType] = useState<'Date' | 'Time'>('Date'); 
    
    const [D, setD] = useState(String(initialDate.getDate()).padStart(2, '0'));
    const [M, setM] = useState(String(initialDate.getMonth() + 1).padStart(2, '0'));
    const [Y, setY] = useState(String(initialDate.getFullYear()));
    const [H, setH] = useState(String(initialDate.getHours()).padStart(2, '0'));
    const [Min, setMin] = useState(String(initialDate.getMinutes()).padStart(2, '0'));

    const Day = Array.from({length: 31}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString().padStart(2, '0') }));
    const Month = Array.from({length: 12}, (_, i) => ({ label: (i + 1).toString(), value: (i + 1).toString().padStart(2, '0') }));
    const Year = Array.from({length: 50}, (_, i) => { const year = (2010 + i).toString(); return { label: year, value: year }; });
    const Hours = Array.from({length: 24}, (_, i) => ({ label: i.toString(), value: i.toString().padStart(2, '0') }));
    const Minutes = Array.from({length: 60}, (_, i) => ({ label: i.toString(), value: i.toString().padStart(2, '0') }));

    const handleSubmit = () => {
        const finalDateTime = `${Y}-${M}-${D}T${H}:${Min}:00`;
        setField('date', finalDateTime);
        
        if (name && brand_logo_url !== null) {
            setStep(5);
        } else {
            nextStep();
        }
    };

    const pickerClassNames = {
        highlightWrapper: "bg-transparent",
        highlightItem: "text-white text-2xl",
        optionItem: "text-[#3A3F4E] font-medium text-lg"
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='flex flex-col h-full w-full pt-4'
        >
            <div className='flex bg-[#1E2333]/80 p-1 rounded-full w-3/4 mx-auto mb-10 relative shadow-inner'>
                {['Date', 'Time'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setSelectionType(tab as 'Date' | 'Time')}
                        className={`relative w-1/2 py-2.5 rounded-full text-sm font-medium z-10 transition-colors duration-300 ${
                            selectionType === tab ? 'text-white' : 'text-slate-400'
                        }`}
                    >
                        {selectionType === tab && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-linear-to-r from-[#4A6296] to-[#3B4F7D] rounded-full -z-10 shadow-lg shadow-blue-900/20"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            />
                        )}
                        {tab}
                    </button>
                ))}
            </div>
            
            <div className='flex flex-col items-center mb-10'>
                <h1 className='text-[22px] font-semibold text-white mb-1'>Date and Time</h1>
                <h2 className='text-slate-400 text-sm'>Tell us when it was</h2>    
            </div>

            <div className='relative h-55 w-full flex justify-center items-center overflow-hidden mb-auto'>
                <AnimatePresence mode="wait">
                    {selectionType === 'Date' ? (
                        <motion.div 
                            key="date-pickers"
                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.2 }}
                            className='flex flex-row w-full justify-center'
                        >
                            <WheelPicker options={Day} defaultValue={D} onValueChange={setD} classNames={pickerClassNames} />
                            <WheelPicker options={Month} defaultValue={M} onValueChange={setM} classNames={pickerClassNames} />
                            <WheelPicker options={Year} defaultValue={Y} onValueChange={setY} classNames={pickerClassNames} />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="time-pickers"
                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.2 }}
                            className='flex flex-row w-full justify-center'
                        >
                            <WheelPicker options={Hours} defaultValue={H} onValueChange={setH} classNames={pickerClassNames} />
                            <WheelPicker options={Minutes} defaultValue={Min} onValueChange={setMin} classNames={pickerClassNames} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-8 px-4 pb-8">
                <motion.button 
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.96 }}
                    className='bg-button-gradient w-full rounded-2xl p-4 text-lg flex items-center justify-center select-none text-white transition-all duration-300'
                >
                    Continue
                </motion.button>
            </div>
        </motion.div>
    )
}