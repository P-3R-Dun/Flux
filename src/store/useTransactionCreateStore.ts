import { create } from "zustand";

interface TransactionCreateState {
    editingId: number | undefined;
    step: number;
    amount: number;
    date: string;
    description: string;
    brand_logo_url: string;
    category_id: string; 
    name: string;
    isTemplateMode: boolean;
    wallet_id: number | null;
    
    setStep: (step: number) => void,
    nextStep: () => void,
    prevStep: () => void,
    setField: <K extends keyof TransactionCreateState>(
        field: K, 
        value: TransactionCreateState[K]
    ) => void;
    reset: () => void;
    setEditData: (data: Partial<TransactionCreateState>) => void;
}

const initialState: Pick<TransactionCreateState, "editingId" | "step" | "amount" | "date" | "description" | "brand_logo_url" | "category_id" | "name" | "isTemplateMode" | "wallet_id"> = {
    editingId: undefined,
    step: 1,
    amount: 0,
    date: "",
    description: "",
    brand_logo_url: "",
    category_id: "",
    name: "",
    isTemplateMode: false,
    wallet_id: null,
}

export const useTransactionCreateStore = create<TransactionCreateState>((set) => ({
    ...initialState,

    setEditData: (data) => set((state) => ({ ...state, ...data })),
    setStep: (step) => set({ step }),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: state.step - 1 })),
    setField: (field, value) => set((state) => ({ ...state, [field]: value })),
    reset: () => set(initialState),
}));