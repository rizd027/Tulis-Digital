"use client";

import { useEffect } from "react";

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
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if Ctrl or Cmd is pressed
            const isCtrlOrCmd = e.ctrlKey || e.metaKey;

            if (!isCtrlOrCmd) return;

            // Ctrl+S: Save
            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                onSave?.();
                return;
            }

            // Ctrl+Z: Undo
            if (e.key === 'z' || e.key === 'Z') {
                if (!e.shiftKey) {
                    e.preventDefault();
                    onUndo?.();
                    return;
                }
            }

            // Ctrl+Y or Ctrl+Shift+Z: Redo
            if (e.key === 'y' || e.key === 'Y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z'))) {
                e.preventDefault();
                onRedo?.();
                return;
            }

            // Ctrl+B: Bold
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                onBold?.();
                return;
            }

            // Ctrl+I: Italic
            if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                onItalic?.();
                return;
            }

            // Ctrl+U: Underline
            if (e.key === 'u' || e.key === 'U') {
                e.preventDefault();
                onUnderline?.();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onSave, onUndo, onRedo, onBold, onItalic, onUnderline]);
}
