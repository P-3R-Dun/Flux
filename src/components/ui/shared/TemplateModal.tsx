import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X } from 'lucide-react';

interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (templateName: string) => void;
    isLoading: boolean;
}

export const TemplateModal = ({ isOpen, onClose, onSave, isLoading }: TemplateModalProps) => {
    const [templateName, setTemplateName] = useState('');

    const handleSave = () => {
        if (templateName.trim()) {
            onSave(templateName.trim());
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setTemplateName('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#252836] rounded-[32px] p-6 shadow-2xl flex flex-col gap-6"
                    >
                        <button 
                            onClick={handleClose}
                            disabled={isLoading}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col items-center mt-2 text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Save Template</h2>
                            <p className="text-gray-400 text-sm px-2">
                                Give your template a short name so you can easily find it later.
                            </p>
                        </div>

                        <div className="w-full">
                            <input
                                type="text"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="e.g. Morning Coffee"
                                disabled={isLoading}
                                autoFocus
                                className="w-full bg-[#1E2333] text-white rounded-2xl py-4 px-5 outline-none placeholder-gray-500 transition-colors focus:bg-[#2A314A] shadow-inner text-lg"
                            />
                        </div>

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex-1 py-4 rounded-2xl font-medium text-white bg-[#374056] hover:bg-[#47526D] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!templateName.trim() || isLoading}
                                className={`flex-1 py-4 rounded-2xl font-medium text-white transition-all flex justify-center items-center ${
                                    !templateName.trim() || isLoading 
                                    ? 'bg-button-disabled-gradient cursor-not-allowed opacity-80' 
                                    : 'bg-button-gradient'
                                }`}
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Save Template'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};