import { create } from "zustand";

interface TransactionCreateState {
    step: number;
    amount: number;
    date: string;
    description: string;
    brand_logo_url: string;
    category_id: string; 
    name: string;
    
    setStep: (step: number) => void,
    nextStep: () => void,
    prevStep: () => void,
    setField: <K extends keyof TransactionCreateState>(
        field: K, 
        value: TransactionCreateState[K]
    ) => void;
    reset: () => void;
}

const initialState: Pick<TransactionCreateState, "step" | "amount" | "date" | "description" | "brand_logo_url" | "category_id" | "name"> = {
    step: 1,
    amount: 0,
    date: "",
    description: "",
    brand_logo_url: "",
    category_id: "",
    name: "",
}

export const useTransactionCreateStore = create<TransactionCreateState>((set) => ({
    ...initialState,

    setStep: (step) => set({ step }),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: state.step - 1 })),
    setField: (field, value) => set((state) => ({ ...state, [field]: value })),
    reset: () => set(initialState),
}));