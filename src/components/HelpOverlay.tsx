"use client";

import React, { useState } from "react";
import { X, Keyboard, Mouse, Zap, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HelpOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HelpOverlay({ isOpen, onClose }: HelpOverlayProps) {
    const [activeTab, setActiveTab] = useState<"shortcuts" | "tips">("shortcuts");

    const shortcuts = [
        { keys: ["Ctrl", "S"], description: "Simpan perubahan" },
        { keys: ["Ctrl", "Z"], description: "Undo (Batal)" },
        { keys: ["Ctrl", "Y"], description: "Redo (Ulang)" },
        { keys: ["Ctrl", "B"], description: "Bold (Tebal)" },
        { keys: ["Ctrl", "I"], description: "Italic (Miring)" },
        { keys: ["Ctrl", "U"], description: "Underline (Garis bawah)" },
    ];

    const tips = [
        {
            icon: <FileText size={20} />,
            title: "Template Cepat",
            description: "Gunakan template yang sudah tersedia untuk memulai surat dengan cepat"
        },
        {
            icon: <Zap size={20} />,
            title: "Autosave Aktif",
            description: "Perubahan Anda otomatis tersimpan di browser. Tidak perlu khawatir kehilangan data!"
        },
        {
            icon: <Mouse size={20} />,
            title: "Seret Tanda Tangan",
            description: "Klik dan seret tanda tangan untuk memposisikannya dengan bebas"
        },
        {
            icon: <Keyboard size={20} />,
            title: "Shortcut Keyboard",
            description: "Gunakan Ctrl+B, Ctrl+I, Ctrl+U untuk formatting cepat saat mengetik"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-white">Bantuan & Tips</h2>
                                <p className="text-xs text-slate-400 mt-1">Pelajari cara menggunakan TulisIzin lebih efektif</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            <button
                                onClick={() => setActiveTab("shortcuts")}
                                className={cn(
                                    "flex-1 py-3 px-6 text-sm font-bold transition-all relative",
                                    activeTab === "shortcuts"
                                        ? "text-[#0ea5e9]"
                                        : "text-slate-400 hover:text-slate-300"
                                )}
                            >
                                <Keyboard size={16} className="inline mr-2" />
                                Keyboard Shortcuts
                                {activeTab === "shortcuts" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0ea5e9]"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("tips")}
                                className={cn(
                                    "flex-1 py-3 px-6 text-sm font-bold transition-all relative",
                                    activeTab === "tips"
                                        ? "text-[#0ea5e9]"
                                        : "text-slate-400 hover:text-slate-300"
                                )}
                            >
                                <Zap size={16} className="inline mr-2" />
                                Tips & Trik
                                {activeTab === "tips" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0ea5e9]"
                                    />
                                )}
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6 overflow-y-auto">
                            {activeTab === "shortcuts" && (
                                <div className="space-y-3">
                                    {shortcuts.map((shortcut, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors"
                                        >
                                            <span className="text-sm text-slate-300">{shortcut.description}</span>
                                            <div className="flex gap-1">
                                                {shortcut.keys.map((key, i) => (
                                                    <React.Fragment key={i}>
                                                        <kbd className="px-3 py-1.5 bg-[#0f172a] border border-white/10 rounded-lg text-xs font-mono text-[#0ea5e9] font-bold shadow-lg">
                                                            {key}
                                                        </kbd>
                                                        {i < shortcut.keys.length - 1 && (
                                                            <span className="text-slate-500 mx-1 text-xs">+</span>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "tips" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tips.map((tip, idx) => (
                                        <div
                                            key={idx}
                                            className="p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-[#0ea5e9]/10 rounded-lg text-[#0ea5e9]">
                                                    {tip.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm text-white mb-1">{tip.title}</h3>
                                                    <p className="text-xs text-slate-400 leading-relaxed">{tip.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-white/[0.02] shrink-0">
                            <p className="text-xs text-slate-500 text-center">
                                Tekan <kbd className="px-2 py-0.5 bg-[#0f172a] border border-white/10 rounded text-[#0ea5e9] font-mono text-[10px]">Esc</kbd> atau klik di luar untuk menutup
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
