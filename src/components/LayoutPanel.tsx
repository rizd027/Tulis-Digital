"use client";

import React from "react";
import { EditorState } from "@/hooks/use-editor-state";
import PaperTypeSelector from "./PaperTypeSelector";

interface LayoutPanelProps {
    state: EditorState;
    updatePaperMargin: (updates: Partial<EditorState["paperMargin"]>) => void;
    updateState: (updates: Partial<EditorState>) => void;
    updateInteraction: (isInteracting: boolean) => void;
}

export default function LayoutPanel({ state, updatePaperMargin, updateState, updateInteraction }: LayoutPanelProps) {
    return (
        <div className="space-y-8">


            <PaperTypeSelector
                selectedPaper={state.paperImage}
                onSelectPaper={(paper) => updateState({ paperImage: paper })}
            />

            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Margin Kertas</label>
                <div className="space-y-5">
                    <RangeControl
                        label="Margin Atas"
                        value={state.paperMargin.top}
                        min={0} max={400}
                        onChange={(v) => updatePaperMargin({ top: v })}
                        onInteractionChange={updateInteraction}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <RangeControl
                            label="Kiri"
                            value={state.paperMargin.left}
                            min={0} max={300}
                            onChange={(v) => updatePaperMargin({ left: v })}
                            onInteractionChange={updateInteraction}
                        />
                        <RangeControl
                            label="Kanan"
                            value={state.paperMargin.right}
                            min={0} max={300}
                            onChange={(v) => updatePaperMargin({ right: v })}
                            onInteractionChange={updateInteraction}
                        />
                    </div>
                    <RangeControl
                        label="Margin Bawah"
                        value={state.paperMargin.bottom}
                        min={0} max={400}
                        onChange={(v) => updatePaperMargin({ bottom: v })}
                        onInteractionChange={updateInteraction}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detail Layout</label>
                <div className="space-y-5">
                    <RangeControl
                        label="Jarak Baris"
                        value={state.lineHeight}
                        min={20} max={50} step={0.5}
                        onChange={(v) => updateState({ lineHeight: v })}
                        onInteractionChange={updateInteraction}
                    />
                    <RangeControl
                        label="Baseline Shift"
                        value={state.baselineShift}
                        min={-20} max={20} step={0.5}
                        onChange={(v) => updateState({ baselineShift: v })}
                        onInteractionChange={updateInteraction}
                    />
                    <RangeControl
                        label="Spacing Huruf"
                        value={state.letterSpacing}
                        min={-5} max={10} step={0.1}
                        onChange={(v) => updateState({ letterSpacing: v })}
                        onInteractionChange={updateInteraction}
                    />
                    <RangeControl
                        label="Kemiringan"
                        value={state.textRotate}
                        min={-2} max={2} step={0.1}
                        onChange={(v) => updateState({ textRotate: v })}
                        onInteractionChange={updateInteraction}
                    />
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
