import { Avatar } from "./../../shared/Avatar";

export const DashboardHeader = ({ name }: { name: string }) => {
    return (
        <div className="flex flex-row justify-between items-center px-3 pt-5">
            <div className="flex flex-row gap-2 items-center">
                <span className="select-none"><Avatar name={name} w="w-12" h="h-12" /></span>
                <div className="flex flex-col">
                    <span className="text-xs leading-none">Welcome back</span>
                    <span className="text-base font-semibold">{name}</span>
                </div>
            </div>
            <h2 className="text-sm">Daily Cap streak: 🔥<span className="text-[#FF9B40]">210</span></h2>
        </div>
    )
}