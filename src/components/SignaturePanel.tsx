"use client";

import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Trash2, Upload, Maximize2, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorState } from "@/hooks/use-editor-state";

interface SignaturePanelProps {
    state: EditorState;
    updateSignature: (updates: Partial<EditorState["signature"]>) => void;
    updateInteraction: (isInteracting: boolean) => void;
}

export default function SignaturePanel({ state, updateSignature, updateInteraction }: SignaturePanelProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clear = () => {
        sigCanvas.current?.clear();
        updateSignature({ image: null });
    };

    const save = () => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            updateSignature({ image: sigCanvas.current.toDataURL("image/png") });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                updateSignature({ image: event.target?.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanda Tangan</label>
                    <button
                        onClick={clear}
                        className="p-1 px-2 text-[10px] font-bold text-red-400 hover:bg-red-400/10 rounded-md transition-colors flex items-center gap-1"
                    >
                        <Trash2 size={12} /> CLEAR
                    </button>
                </div>

                <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                    <SignatureCanvas
                        ref={sigCanvas}
                        penColor={state.signature.color}
                        onEnd={save}
                        canvasProps={{
                            className: "w-full h-40 cursor-crosshair",
                        }}
                    />
                </div>

                <div className="flex gap-2">
                    <label className="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-white/10 cursor-pointer transition-all">
                        <Upload size={14} /> PNG/JPG
                        <input type="file" onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </label>
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/5 relative bg-white/5 group">
                        <input
                            type="color"
                            value={state.signature.color}
                            onChange={(e) => updateSignature({ color: e.target.value })}
                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transformasi</label>

                <div className="space-y-5">
                    <RangeControl
                        label="Skala"
                        value={state.signature.scale}
                        min={0.1} max={2} step={0.1}
                        onChange={(v) => updateSignature({ scale: v })}
                        onInteractionChange={updateInteraction}
                    />
                    <RangeControl
                        label="Posisi X"
                        value={state.signature.x}
                        min={0} max={800}
                        onChange={(v) => updateSignature({ x: v })}
                        onInteractionChange={updateInteraction}
                    />
                    <RangeControl
                        label="Posisi Y"
                        value={state.signature.y}
                        min={0} max={1100}
                        onChange={(v) => updateSignature({ y: v })}
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
