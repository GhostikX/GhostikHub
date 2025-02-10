import { useEffect } from "react";
import { useToasts } from "tldraw";
import { toastStatus } from "../utils/toastStatus";

const UseShowNoteToast = ({ showToast, setShowNoteToast, type }) => {
    const { addToast } = useToasts();

    useEffect(() => {
        if (showToast) {
            if (type === toastStatus.SUCCESS)
                addToast({ title: 'Successfully saved!', severity: 'success' })
            else if (type === toastStatus.FAILED)
                addToast({ title: 'Something went wrong. Please try again.', severity: 'error' })
            setShowNoteToast(false);
            return;
        }
    }, [showToast])

    return null;
}

export default UseShowNoteToast;