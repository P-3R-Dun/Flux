import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate } from "react-router";
import { TransactionItem } from "@/components/ui/mobile/TransactionItem";
import { LoadingPage } from "@/pages/Loading_page";
import { type TemplateDT } from "@/services/dashboard.service";
import { useTransactionCreateStore } from "@/store/useTransactionCreateStore";
import { useTemplates } from "@/hooks/useTemplates"; 

export const TemplatesPage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    
    const { setEditData, reset, setField } = useTransactionCreateStore();
    const { templates, isLoading, fetchTemplates, deleteTemplate } = useTemplates();
    
    const [inputValue, setInputValue] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            fetchTemplates(token);
        }
    }, [token, fetchTemplates]);

    const filteredTemplates = templates.filter((template) => 
        template.template_name?.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleAddNewTemplate = () => {
        reset(); 
        setField('isTemplateMode', true);
        navigate("/add-transaction");
    };

    const handleUseTemplate = (template: TemplateDT) => {
        let startingStep = 1;
        if (template.amount && Number(template.amount) !== 0) startingStep = 2;
        if (startingStep === 2 && template.category) startingStep = 3;
        
        setEditData({
            amount: Number(template.amount) || 0,
            category_id: template.category || "",
            name: template.name || "",
            description: template.description || "",
            brand_logo_url: template.brand_logo_url || "",
            date: new Date().toISOString(), 
            isTemplateMode: false, 
            step: startingStep
        });
        
        navigate("/add-transaction");
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    };

    if (isLoading) return <LoadingPage />;

    return (
        <motion.div 
            className='flex flex-col w-full gap-5 h-dvh overflow-hidden'
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className='flex items-center justify-between p-4 pt-6 shrink-0 relative'>
                <motion.button onClick={() => {navigate("/"); }}
                    whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="bg-[#252836] rounded-2xl p-2 w-12 h-12">
                    <div className="flex items-center justify-center">
                        <ChevronLeft className="w-6 h-6"/>
                    </div>
                </motion.button>
                <h1 className='text-2xl font-bold absolute left-0 right-0 text-center text-white pointer-events-none'>
                    Templates
                </h1>
                <div className="w-10 z-10"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="px-4 shrink-0">
                <div className="relative flex items-center w-full bg-[#181D27] rounded-2xl px-4 py-3.5 border border-white/5 shadow-inner">
                    <Search className="w-5 h-5 text-gray-500 mr-3 shrink-0" />
                    <input 
                        type="text" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        placeholder="Search templates..."
                        className="w-full bg-transparent text-white outline-none placeholder-gray-500 font-medium"
                    />
                </div>
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className='flex-1 min-h-0 bg-[#181D27] rounded-t-4xl shadow-2xl flex flex-col overflow-hidden'
            >
                <div className='px-6 pt-6 pb-24 overflow-y-auto flex-1 scrollbar-hide'>
                    <div className='flex flex-col gap-4'>
                        <AnimatePresence mode="popLayout">
                            {filteredTemplates.length === 0 ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    exit={{ opacity: 0 }}
                                    className="flex justify-center items-center pt-10 text-gray-500"
                                >
                                    {inputValue ? "No templates match your search" : "No templates saved yet"}
                                </motion.div>
                            ) : (
                                filteredTemplates.map((template) => {
                                    const mappedTemplate = {
                                        ...template,
                                        id: template.id,
                                        name: template.template_name, 
                                        amount: template.amount || 0,
                                        date: new Date().toISOString(), 
                                        category_name: template.category_name || "Template",
                                    };

                                    return (
                                        <TransactionItem 
                                            key={template.id} 
                                            transaction={mappedTemplate} 
                                            expandedId={expandedId} 
                                            setExpandedId={setExpandedId} 
                                            onClickItem={() => handleUseTemplate(template)} // Передаем логику клика напрямую в айтем
                                            onEdit={() => {
                                                setEditData({
                                                    editingId: template.id,
                                                    amount: Number(template.amount) || 0,
                                                    category_id: template.category || "",
                                                    name: template.name || "",
                                                    description: template.description || "",
                                                    brand_logo_url: template.brand_logo_url || "",
                                                    date: new Date().toISOString(),
                                                    isTemplateMode: true, 
                                                    step: 1
                                                });
                                                navigate("/add-transaction");
                                            }}
                                            onDelete={async () => {
                                                if (token) {
                                                    try {
                                                        // Вызываем чисто, без всяких e.stopPropagation()
                                                        await deleteTemplate(template.id, token);
                                                    } catch (error) {
                                                        console.error("Failed to delete template", error);
                                                    }
                                                }
                                            }}
                                        />
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                variants={itemVariants} 
                className="absolute bottom-6 left-0 right-0 px-6 pt-8 bg-linear-to-t from-[#181D27] via-[#181D27] to-transparent pointer-events-none"
            >
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleAddNewTemplate} 
                    className="w-full rounded-2xl p-4 text-[17px] font-medium text-white bg-[#5D73B3] shadow-lg pointer-events-auto"
                >
                    Add New Template
                </motion.button>
            </motion.div>
        </motion.div>
    );
};