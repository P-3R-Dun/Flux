import { useTransactionCreateStore } from "@/store/useTransactionCreateStore";
import { useCallback } from "react";

export const useEditTransaction = () => {
    const { setEditData } = useTransactionCreateStore();
    const startEditing = useCallback((transaction: any) => {
        setEditData({
            editingId: transaction.id,
            amount: transaction.amount,
            date: transaction.date,
            description: transaction.description,
            brand_logo_url: transaction.brand_logo_url,
            category_id: transaction.category || "",
            name: transaction.name,
        });  
    }, [setEditData]);
    
    return { startEditing };
}