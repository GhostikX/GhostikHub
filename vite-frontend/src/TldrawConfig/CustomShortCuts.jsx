export default function CustomShortCuts() {
    return (
        {
        actions(_editor, actions) {
        const { 'insert-embed': _removedAction, ...newActions } = actions;
    
        return {
            ...newActions,
        };
        }
    }
    )
};