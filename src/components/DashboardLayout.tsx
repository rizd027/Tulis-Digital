"use client";

import React, { useState, useEffect } from "react";
import {
    FileText,
    Palette,
    User,
    Layout,
    ChevronLeft,
    ChevronRight,
    Download,
    HelpCircle,
    Minus,
    Plus,
    Maximize2,
    Coffee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useEditorState } from "@/hooks/use-editor-state";
import EditorPanel from "./EditorPanel";
import StylePanel from "./StylePanel";
import SignaturePanel from "./SignaturePanel";
import LayoutPanel from "./LayoutPanel";
import PaperPreview from "./PaperPreview";
import ExportOptions from "./ExportOptions";
import HelpPanel from "./HelpPanel";

type Tab = "editor" | "style" | "signature" | "layout" | "export" | "help";

export default function DashboardLayout() {
    const { state, updateState, updateSignature, updatePaperMargin, updateInteraction } = useEditorState();
    const [activeTab, setActiveTab] = useState<Tab>("editor");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const tabs = [
        { id: "editor", icon: FileText, title: "Isi Surat" },
        { id: "style", icon: Palette, title: "Gaya & Font" },
        { id: "signature", icon: User, title: "Tanda Tangan" },
        { id: "layout", icon: Layout, title: "Layout & Zoom" },
        { id: "export", icon: Download, title: "Export" },
        { id: "help", icon: HelpCircle, title: "Bantuan" },
    ];

    const [isExporting, setIsExporting] = useState(false);
    const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

    // Close mobile panel when tab changes if it was already open with same tab, or keep open
    // Actually, usually on mobile: click tab -> open panel. Click active tab -> close panel?
    // Let's implement: Click tab -> if different, switch tab and open panel. If same, toggle panel.
    const handleTabClick = (id: Tab) => {
        if (activeTab === id) {
            setIsSidebarCollapsed(!isSidebarCollapsed); // Desktop toggle
            setIsMobilePanelOpen(!isMobilePanelOpen); // Mobile toggle
        } else {
            setActiveTab(id);
            setIsSidebarCollapsed(false); // Open on desktop
            setIsMobilePanelOpen(true); // Open on mobile
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen w-full bg-[#0f172a] text-slate-200 overflow-hidden relative">
            {/* Top Bar for Mobile (Logo) */}
            {!state.isInteracting && (
                <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-white/5 z-40 shrink-0">
                    <div className="flex flex-col">
                        <h1 className="text-lg font-black italic tracking-tighter">
                            Tulis<span className="text-[#0ea5e9] -ml-0.5">Izin</span>
                        </h1>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Digital Prescription</p>
                    </div>
                    <div className="hidden">Export on mobile via bottom panel</div>
                </div>
            )}

            {/* Sidebar Navigation (Desktop: Left, Mobile: Floating Bottom Bar) */}
            <aside className={cn(
                "z-50 flex md:flex-col flex-row justify-around md:justify-between items-center transition-all duration-500 shrink-0",
                // Mobile Floating Style
                "fixed bottom-6 left-4 right-4 h-16 bg-[#1e293b]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-2",
                // Desktop Reset
                "md:relative md:bottom-auto md:left-auto md:right-auto md:w-16 md:h-full md:rounded-none md:border-r md:border-t-0 md:bg-[#1e293b] md:backdrop-blur-none md:shadow-none md:py-6 md:px-0 md:order-first",
                state.isInteracting && "translate-y-32 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto",
                isExporting && "pointer-events-none opacity-50"
            )}>
                <div className="flex md:flex-col flex-row gap-0 md:gap-4 w-full md:w-auto justify-center md:justify-start relative">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id as Tab)}
                            whileTap={{ scale: 0.92 }}
                            className={cn(
                                "flex-1 md:flex-none p-2 md:p-3 rounded-xl transition-all duration-300 relative group flex flex-col items-center gap-0.5 md:gap-1 z-10",
                                activeTab === tab.id
                                    ? "text-white"
                                    : "text-slate-400 hover:text-white"
                            )}
                            title={tab.title}
                        >
                            {/* Mobile Active Indicator Pill */}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabIndicatorMobile"
                                    className="absolute inset-x-1 inset-y-1.5 bg-[#0ea5e9]/10 rounded-xl md:hidden"
                                    initial={false}
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            <div className={cn(
                                "p-1 md:p-1.5 rounded-lg transition-all duration-300",
                                activeTab === tab.id && "bg-[#0ea5e9]/15 md:bg-[#0ea5e9]/20"
                            )}>
                                <tab.icon
                                    size={18}
                                    strokeWidth={activeTab === tab.id ? 2.5 : 2}
                                    className={cn(
                                        "transition-transform duration-300",
                                        activeTab === tab.id ? "text-[#0ea5e9] scale-110" : "group-hover:text-white"
                                    )}
                                />
                            </div>
                            {/* Mobile Label */}
                            <span className={cn(
                                "text-[9px] font-black md:hidden tracking-tighter transition-colors duration-300",
                                activeTab === tab.id ? "text-[#0ea5e9]" : "text-slate-500"
                            )}>
                                {tab.id === "editor" ? "SURAT" :
                                    tab.id === "style" ? "GAYA" :
                                        tab.id === "signature" ? "TANDA" :
                                            tab.id === "layout" ? "LAYOUT" :
                                                tab.id === "export" ? "UNDUH" : "INFO"}
                            </span>

                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabIndicatorDesktop"
                                    className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.5)] hidden md:block"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                <div className="flex md:flex-col items-center gap-4">
                    <a
                        href="https://saweria.co/frd027"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-slate-500 hover:text-[#0ea5e9] transition-all relative group hidden md:block"
                        title="Traktir Kopi"
                    >
                        <Coffee size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="absolute left-full ml-2 px-2 py-1 bg-[#0f172a] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Traktir Kopi ☕
                        </span>
                    </a>

                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-3 text-slate-500 hover:text-white transition-colors hidden md:block"
                    >
                        {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </aside>

            {/* Toast Notifications */}
            <Toaster position="top-center" />

            {/* Control Panel (Desktop: Sidebar) */}
            <div className="hidden md:flex flex-col h-full bg-[#1e293b]/50 backdrop-blur-xl border-r border-white/5 overflow-hidden">
                <motion.div
                    key="desktop-panel"
                    className="flex h-full flex-col"
                    initial={{ width: 320, opacity: 1 }}
                    animate={{
                        width: isSidebarCollapsed ? 0 : 320,
                        opacity: isSidebarCollapsed ? 0 : 1
                    }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                >
                    <div className="p-6 border-b border-white/5 flex flex-col gap-1">
                        <h1 className="text-xl font-black italic tracking-tighter">
                            Tulis<span className="text-[#0ea5e9] -ml-0.5">Izin</span>
                        </h1>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Digital Prescription</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <div className="space-y-4">
                            {activeTab === "editor" && <EditorPanel state={state} updateState={updateState} />}
                            {activeTab === "style" && <StylePanel state={state} updateState={updateState} updateInteraction={updateInteraction} />}
                            {activeTab === "signature" && <SignaturePanel state={state} updateSignature={updateSignature} updateInteraction={updateInteraction} />}
                            {activeTab === "layout" && <LayoutPanel state={state} updatePaperMargin={updatePaperMargin} updateState={updateState} updateInteraction={updateInteraction} />}
                            {activeTab === "export" && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base font-black text-white mb-1">Export Surat</h3>
                                        <p className="text-[10px] text-slate-400">Pilih format export</p>
                                    </div>
                                    <ExportOptions
                                        isExporting={isExporting}
                                        onExportStart={() => setIsExporting(true)}
                                        onExportEnd={() => setIsExporting(false)}
                                    />
                                </div>
                            )}
                            {activeTab === "help" && <HelpPanel />}
                        </div>
                    </div>

                </motion.div>
            </div>

            {/* Mobile Panel (Bottom Sheet) */}
            <AnimatePresence>
                {isMobilePanelOpen && (
                    <motion.div
                        key="mobile-panel"
                        className={cn(
                            "md:hidden fixed left-4 right-4 z-40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 pb-safe",
                            state.isInteracting
                                ? "bg-transparent border-transparent shadow-none max-h-[15vh] bottom-40"
                                : "bg-[#1e293b]/95 max-h-[55vh] bottom-24 shadow-[0_20px_60px_-15px_rgba(0,0,0,1)]"
                        )}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    >
                        {!state.isInteracting && (
                            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                                <h3 className="text-sm font-bold text-slate-200">
                                    {tabs.find(t => t.id === activeTab)?.title}
                                </h3>
                                <button
                                    onClick={() => setIsMobilePanelOpen(false)}
                                    className="text-xs text-slate-400 font-medium bg-white/5 px-2 py-1 rounded"
                                >
                                    Tutup
                                </button>
                            </div>
                        )}
                        <div className={cn(
                            "flex-1 overflow-y-auto p-4 space-y-6 transition-all",
                            state.isInteracting && "overflow-hidden p-0"
                        )}>
                            {activeTab === "editor" && <EditorPanel state={state} updateState={updateState} />}
                            {activeTab === "style" && <StylePanel state={state} updateState={updateState} updateInteraction={updateInteraction} />}
                            {activeTab === "signature" && <SignaturePanel state={state} updateSignature={updateSignature} updateInteraction={updateInteraction} />}
                            {activeTab === "layout" && <LayoutPanel state={state} updatePaperMargin={updatePaperMargin} updateState={updateState} updateInteraction={updateInteraction} />}
                            {activeTab === "export" && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base font-black text-white mb-1">Export Surat</h3>
                                        <p className="text-[10px] text-slate-400">Pilih format export</p>
                                    </div>
                                    <ExportOptions
                                        isExporting={isExporting}
                                        onExportStart={() => setIsExporting(true)}
                                        onExportEnd={() => setIsExporting(false)}
                                    />
                                </div>
                            )}
                            {activeTab === "help" && <HelpPanel />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preview Area */}
            <main className="flex-1 overflow-auto bg-[#0c111d] p-4 md:p-12 flex justify-center items-start custom-scrollbar pb-32 md:pb-12">
                <PaperPreview state={state} />
            </main>

            {/* Premium Zoom Control */}
            <div className="fixed bottom-[94px] md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-[49] flex flex-col items-center md:items-end gap-3 pointer-events-none w-full max-w-[90vw] md:w-auto">
                <AnimatePresence mode="wait">
                    {!state.isInteracting && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 p-1.5 md:p-3 rounded-full md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 md:gap-4 pointer-events-auto"
                        >
                            <div className="flex items-center gap-0.5 md:gap-1.5">
                                <button
                                    onClick={() => updateState({ zoom: Math.max(0.3, state.zoom - 0.1) })}
                                    className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                                    title="Zoom Out"
                                >
                                    <Minus size={14} />
                                </button>

                                <div className="min-w-[35px] md:min-w-[45px] text-center">
                                    <span className="text-[10px] md:text-[11px] font-black text-[#0ea5e9]">
                                        {Math.round(state.zoom * 100)}%
                                    </span>
                                </div>

                                <button
                                    onClick={() => updateState({ zoom: Math.min(1.5, state.zoom + 0.1) })}
                                    className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                                    title="Zoom In"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 pl-2 border-l border-white/5 md:border-white/10">
                                <input
                                    type="range"
                                    min="0.3"
                                    max="1.5"
                                    step="0.05"
                                    value={state.zoom}
                                    onChange={(e) => updateState({ zoom: parseFloat(e.target.value) })}
                                    onMouseDown={() => updateInteraction(true)}
                                    onTouchStart={() => updateInteraction(true)}
                                    onMouseUp={() => updateInteraction(false)}
                                    onTouchEnd={() => updateInteraction(false)}
                                    className="w-16 sm:w-20 md:w-32 h-1 md:h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#0ea5e9] hover:accent-[#38bdf8] transition-all"
                                />

                                <button
                                    onClick={() => updateState({ zoom: 0.7 })}
                                    className="p-1 md:p-2 text-slate-500 hover:text-white transition-colors"
                                    title="Reset Zoom"
                                >
                                    <Maximize2 size={12} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>


        </div>
    );
}
