interface LoadingSpinnerProps {
    widthClass?: string;
    heightClass?: string;
    borderClass?: string;
}

export const LoadingSpinner = ({ widthClass, heightClass, borderClass }: LoadingSpinnerProps) => (
    <div className={`${widthClass || 'w-6'} ${heightClass || 'h-6'} ${borderClass || 'border-2'} border-white/30 border-t-white rounded-full animate-spin`}></div>
);