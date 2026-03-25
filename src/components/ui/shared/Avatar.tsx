import { useAvatar } from "../../../hooks/useAvatar";

export const Avatar = ({ name, w = "w-10", h = "h-10", text = "text-base"}: { name: string; w?: string; h?: string; text?: string }) => {
    const { initials, gradientSelected } = useAvatar(name);
    return (
        <div className={`bg-linear-to-br ${gradientSelected} ${w} ${h} ${text} flex items-center justify-center text-white font-bold rounded-full`}>
            {initials}
        </div>
    )
}