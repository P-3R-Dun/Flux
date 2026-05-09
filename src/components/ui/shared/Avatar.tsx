import { useAvatar } from "../../../hooks/useAvatar";

export const Avatar = ({ name, className = "w-10 h-10 text-base",}: { name: string; className?: string; }) => {
    const { initials, gradientSelected } = useAvatar(name);
    return (
        <div className={`bg-linear-to-br ${gradientSelected} ${className} flex items-center justify-center text-white font-bold rounded-full select-none`}>
            {initials}
        </div>
    )
}