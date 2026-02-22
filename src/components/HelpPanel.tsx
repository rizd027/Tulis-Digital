"use client";

import React, { useState } from "react";
import { Keyboard, Mouse, Zap, FileText, Coffee, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HelpPanel() {
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
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-black text-white mb-1">Bantuan & Tips</h3>
                <p className="text-xs text-slate-400">Pelajari cara menggunakan TulisIzin lebih efektif</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 -mx-6 px-6">
                <button
                    onClick={() => setActiveTab("shortcuts")}
                    className={cn(
                        "flex-1 py-2.5 px-4 text-xs font-bold transition-all relative",
                        activeTab === "shortcuts"
                            ? "text-[#0ea5e9]"
                            : "text-slate-400 hover:text-slate-300"
                    )}
                >
                    <Keyboard size={14} className="inline mr-1.5" />
                    Keyboard Shortcuts
                    {activeTab === "shortcuts" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0ea5e9]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("tips")}
                    className={cn(
                        "flex-1 py-2.5 px-4 text-xs font-bold transition-all relative",
                        activeTab === "tips"
                            ? "text-[#0ea5e9]"
                            : "text-slate-400 hover:text-slate-300"
                    )}
                >
                    <Zap size={14} className="inline mr-1.5" />
                    Tips & Trik
                    {activeTab === "tips" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0ea5e9]" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div>
                {activeTab === "shortcuts" && (
                    <div className="space-y-2">
                        {shortcuts.map((shortcut, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-colors"
                            >
                                <span className="text-xs text-slate-300">{shortcut.description}</span>
                                <div className="flex gap-1">
                                    {shortcut.keys.map((key, i) => (
                                        <React.Fragment key={i}>
                                            <kbd className="px-2 py-1 bg-[#0f172a] border border-white/10 rounded text-[10px] font-mono text-[#0ea5e9] font-bold">
                                                {key}
                                            </kbd>
                                            {i < shortcut.keys.length - 1 && (
                                                <span className="text-slate-500 mx-0.5 text-[10px]">+</span>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "tips" && (
                    <div className="space-y-3">
                        {tips.map((tip, idx) => (
                            <div
                                key={idx}
                                className="p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-colors"
                            >
                                <div className="flex items-start gap-2.5">
                                    <div className="p-1.5 bg-[#0ea5e9]/10 rounded-lg text-[#0ea5e9] shrink-0">
                                        {tip.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xs text-white mb-0.5">{tip.title}</h3>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">{tip.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Support Section */}
            <div className="pt-4 border-t border-white/10 mt-6">
                <a
                    href="https://saweria.co/frd027"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-4 bg-gradient-to-br from-[#0ea5e9]/10 to-[#38bdf8]/5 border border-[#0ea5e9]/20 rounded-2xl hover:border-[#0ea5e9]/40 transition-all duration-300"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0ea5e9]/20 group-hover:scale-110 transition-transform">
                            <Coffee size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-black text-white">Traktir Kopi ☕</h4>
                                <ExternalLink size={10} className="text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">Dukung pengembang agar aplikasi tetap gratis & update!</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
}
