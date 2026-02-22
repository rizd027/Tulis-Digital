"use client";

import React from "react";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorState } from "@/hooks/use-editor-state";
import CustomSelect from "./ui/CustomSelect";

// ... existing code ...

const FONTS = [
    { label: "Gloria Hallelujah", value: "'Gloria Hallelujah', cursive", fontFamily: "'Gloria Hallelujah', cursive" },
    { label: "Shadows Into Light", value: "'Shadows Into Light', cursive", fontFamily: "'Shadows Into Light', cursive" },
    { label: "Indie Flower", value: "'Indie Flower', cursive", fontFamily: "'Indie Flower', cursive" },
    { label: "Kalam", value: "'Kalam', cursive", fontFamily: "'Kalam', cursive" },
    { label: "Caveat", value: "'Caveat', cursive", fontFamily: "'Caveat', cursive" },
    { label: "Architects Daughter", value: "'Architects Daughter', cursive", fontFamily: "'Architects Daughter', cursive" },
    { label: "Dancing Script", value: "'Dancing Script', cursive", fontFamily: "'Dancing Script', cursive" },
    { label: "Homemade Apple", value: "'Homemade Apple', cursive", fontFamily: "'Homemade Apple', cursive" },
];

interface StylePanelProps {
    state: EditorState;
    updateState: (updates: Partial<EditorState>) => void;
    updateInteraction: (isInteracting: boolean) => void;
}

export default function StylePanel({ state, updateState, updateInteraction }: StylePanelProps) {
    return (
        <div className="space-y-8">
            {/* Typography Section */}
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typography</label>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <span className="text-xs text-slate-400">Font Tulisan</span>
                        <CustomSelect
                            value={state.fontFamily}
                            onChange={(value) => updateState({ fontFamily: value })}
                            options={FONTS}
                            placeholder="Pilih Font"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-xs text-slate-400">Ukuran</span>
                            <input
                                type="number"
                                value={state.fontSize}
                                onChange={(e) => updateState({ fontSize: Number(e.target.value) })}
                                className="w-full bg-black/20 border border-white/5 rounded-lg p-2.5 text-sm focus:border-[#0ea5e9] transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-slate-400">Warna Tinta</span>
                            <div className="relative h-[42px] rounded-lg overflow-hidden border border-white/5">
                                <input
                                    type="color"
                                    value={state.color}
                                    onChange={(e) => updateState({ color: e.target.value })}
                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {[
                            { id: "isBold", icon: Bold },
                            { id: "isItalic", icon: Italic },
                            { id: "isUnderline", icon: Underline },
                            { id: "isStrikethrough", icon: Strikethrough },
                        ].map(({ id, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => updateState({ [id]: !state[id as keyof EditorState] })}
                                className={cn(
                                    "p-3 rounded-lg border border-white/5 transition-all flex justify-center items-center",
                                    state[id as keyof EditorState] ? "bg-[#0ea5e9] text-white" : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <Icon size={16} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
}

function RangeControl({ label, value, min, max, step, onChange, onInteractionChange }: {
    label: string,
    value: number,
    min: number,
    max: number,
    step?: number,
    onChange: (v: number) => void,
    onInteractionChange: (v: boolean) => void
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-slate-400">{label}</span>
                <span className="text-[11px] font-black text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 rounded-full">{value}</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                onMouseDown={() => onInteractionChange(true)}
                onTouchStart={() => onInteractionChange(true)}
                onMouseUp={() => onInteractionChange(false)}
                onTouchEnd={() => onInteractionChange(false)}
                className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#0ea5e9]"
            />
        </div>
    );
}
