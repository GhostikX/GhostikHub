import { useBreakpoint, useTldrawUiComponents } from "tldraw";

export default function CustomMenuPanel() {
    const breakpoint = useBreakpoint()

    const { MainMenu, QuickActions, ActionsMenu, PageMenu } = useTldrawUiComponents()

    if (!MainMenu && !PageMenu && breakpoint < 6) return null

    return (
        <div className="top-center-wrapper absolute top-0 left-1/2 transform -translate-x-1/2 mt-2">
            <div className="tlui-menu-zone">
                <div className="tlui-buttons__horizontal">
                    {MainMenu && <MainMenu />}
                    {QuickActions && <QuickActions />}
                    {ActionsMenu && <ActionsMenu />}
                </div>
            </div>
        </div>
    )
}