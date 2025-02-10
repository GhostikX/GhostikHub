import { useEffect } from "react";
import { useEditor } from "tldraw";

export default function UseDetectEditorChanges({ changeDetectedRef, isSnapshotLoading  }) {
    const editor = useEditor();

    useEffect(() => {
        editor.updateInstanceState({isDebugMode: false})
        if (!editor) return;
        if (isSnapshotLoading) return; 
        
        const handleChangeEvent = (change) => {
            if (changeDetectedRef.current === true) return;

            if (Object.values(change.changes.added).some(record => record.typeName === 'shape')) {
                changeDetectedRef.current = true;
                return;
            }

            for (const [from, to] of Object.values(change.changes.updated)) {
                if (from.typeName === 'shape' && to.typeName === 'shape') {
                    changeDetectedRef.current = true;

                    return;
                }
            }

            if (Object.values(change.changes.removed).some(record => record.typeName === 'shape')) {
                changeDetectedRef.current = true;
                return;
            }
        };

        const cleanupFunction = editor.store.listen(handleChangeEvent, { source: 'user', scope: 'all' });

        return () => {
            cleanupFunction();
        };
    }, [editor, isSnapshotLoading, changeDetectedRef]);
    
    return null;
}