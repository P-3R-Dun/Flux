import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { useTransactionCreateStore } from "@/store/useTransactionCreateStore";
import { StepAmount } from "./StepAmount";
import { StepCategory } from "./StepCategory";
import { StepDateTime } from "./StepDateTime";
import { StepName } from "./StepName";
import { StepDescription } from "./StepDescription";

export const TransactionCreatePage = () => {
    const { step, isTemplateMode, prevStep, setStep, reset } = useTransactionCreateStore();
    const navigate = useNavigate();

    const handleBack = () => {
        if (step === 1) {
            reset();
            navigate(-1);
        } else {
            if (isTemplateMode && step === 4) {
                setStep(2);
                return
            }
            prevStep();
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1: return <StepAmount key="step-1" />;
            case 2: return <StepCategory key="step-2" />;
            case 3: return <StepDateTime key="step-3" />;
            case 4: return <StepName key="step-4" />;
            case 5: return <StepDescription key="step-5" />;
            default: return <StepAmount key="step-default "/>;
        }
    }

    return (
        <div className="flex flex-col h-dvh overflow-y-auto p-4">
            <motion.button onClick={() => {handleBack(); }}
            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="bg-[#252836] rounded-2xl p-2 w-12 h-12">
                <div className="flex items-center justify-center">
                    <ChevronLeft className="w-6 h-6"/>
                </div>
            </motion.button>
            <div className="flex flex-col justify-start items-center">
                <h1 className="text-2xl">Add a new Record</h1>
                <h2 className="font-medium">{`Step: ${useTransactionCreateStore().step} of 5`}</h2>
            </div>
            <div>
                <AnimatePresence mode="wait">
                    {renderStep()}
                </AnimatePresence>
            </div>
        </div>
    );
}