import { 
    DefaultMainMenu, TldrawUiMenuGroup, ToggleSnapModeItem, ToggleGridItem, ToggleWrapModeItem, ToggleFocusModeItem, 
    ToggleEdgeScrollingItem, ToggleReduceMotionItem,TldrawUiMenuSubmenu, KeyboardShortcutsMenuItem, LanguageMenu, ToggleToolLockItem, 
    EditSubmenu, ViewSubmenu, ExportFileContentSubMenu, TldrawUiMenuActionItem, ToggleAutoSizeMenuItem, TldrawUiMenuActionCheckboxItem, 
    useEditor, useValue
} from "tldraw";

export default function CustomMainMenu() {
    function UploadMediaMenuItem() {
        return (
        <TldrawUiMenuGroup id="extras">
            <TldrawUiMenuActionItem actionId="insert-media" />
        </TldrawUiMenuGroup>
        )
    }
    
    function ToggleDynamicSizeModeItem() {
        const editor = useEditor()
        const isDynamicResizeMode = useValue(
            'dynamic resize',
            () => editor.user.getIsDynamicResizeMode(),
            [editor]
        )
        return (
            <TldrawUiMenuActionCheckboxItem
                actionId="toggle-dynamic-size-mode"
                checked={isDynamicResizeMode}
            />
        )
    }
    
    function TogglePasteAtCursorItem() {
        const editor = useEditor()
        const pasteAtCursor = useValue('paste at cursor', () => editor.user.getIsPasteAtCursorMode(), [
            editor,
        ])
        return (
            <TldrawUiMenuActionCheckboxItem actionId="toggle-paste-at-cursor" checked={pasteAtCursor} />
        )
    }

    function PreferencesGroup() {
        return (
            <TldrawUiMenuGroup id="preferences">
			    <TldrawUiMenuSubmenu id="preferences" label="menu.preferences">
				<TldrawUiMenuGroup id="preferences-actions">
					<ToggleSnapModeItem />
					<ToggleToolLockItem />
					<ToggleGridItem />
					<ToggleWrapModeItem />
					<ToggleFocusModeItem />
					<ToggleEdgeScrollingItem />
					<ToggleReduceMotionItem />
                    <ToggleAutoSizeMenuItem />
                    <TogglePasteAtCursorItem />
                    <ToggleDynamicSizeModeItem />
				</TldrawUiMenuGroup>
			</TldrawUiMenuSubmenu>
		</TldrawUiMenuGroup>
        )
    }

    return (
        <DefaultMainMenu>
            <EditSubmenu />
            <ViewSubmenu />
            <ExportFileContentSubMenu />
            <UploadMediaMenuItem />
            <PreferencesGroup />
            <LanguageMenu />
            <KeyboardShortcutsMenuItem />
        </DefaultMainMenu>
    )
}