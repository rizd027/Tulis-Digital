import { onMounted, onUnmounted } from "vue";

interface UseKeyboardShortcutsProps {
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onBold?: () => void;
    onItalic?: () => void;
    onUnderline?: () => void;
}

export function useKeyboardShortcuts({
    onSave,
    onUndo,
    onRedo,
    onBold,
    onItalic,
    onUnderline
}: UseKeyboardShortcutsProps) {
    const handleKeyDown = (e: KeyboardEvent) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        if (!isCtrlOrCmd) return;

        if (e.key === "s" || e.key === "S") {
            e.preventDefault();
            onSave?.();
            return;
        }

        if (e.key === "z" || e.key === "Z") {
            if (!e.shiftKey) {
                e.preventDefault();
                onUndo?.();
                return;
            }
        }

        if (e.key === "y" || e.key === "Y" || (e.shiftKey && (e.key === "z" || e.key === "Z"))) {
            e.preventDefault();
            onRedo?.();
            return;
        }

        if (e.key === "b" || e.key === "B") {
            e.preventDefault();
            onBold?.();
            return;
        }

        if (e.key === "i" || e.key === "I") {
            e.preventDefault();
            onItalic?.();
            return;
        }

        if (e.key === "u" || e.key === "U") {
            e.preventDefault();
            onUnderline?.();
            return;
        }
    };

    onMounted(() => {
        window.addEventListener("keydown", handleKeyDown);
    });

    onUnmounted(() => {
        window.removeEventListener("keydown", handleKeyDown);
    });
}
