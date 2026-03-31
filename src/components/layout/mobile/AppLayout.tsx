import { Outlet } from "react-router"
import { MobileNavigation } from "../../ui/mobile/MobileNavigation"

export const AppLayout = () => {
    return (
        <div className="flex flex-col min-h-dvh bg-main-gradient">
            <div className="flex-1 overflow-y-auto pb-20"><Outlet/></div>
            <div className="fixed bottom-0 left-0 w-full z-50"><MobileNavigation /></div>
        </div>
    )
}