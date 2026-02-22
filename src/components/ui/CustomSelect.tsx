"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string;
    fontFamily?: string; // Optional for font preview
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder = "Select...", className }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between bg-black/20 border border-white/5 rounded-xl p-3 text-sm text-left transition-all duration-200",
                    isOpen ? "border-[#0ea5e9]/50 bg-black/40 shadow-[0_0_20px_rgba(14,165,233,0.1)]" : "hover:bg-white/5 hover:border-white/10"
                )}
            >
                <span
                    className="truncate text-slate-200"
                    style={{ fontFamily: selectedOption?.fontFamily }}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={cn(
                        "text-slate-500 transition-transform duration-200",
                        isOpen && "transform rotate-180 text-[#0ea5e9]"
                    )}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                    >
                        <div className="p-1.5 space-y-0.5">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                                        value === option.value
                                            ? "bg-[#0ea5e9]/10 text-[#0ea5e9] font-medium"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    )}
                                    style={{ fontFamily: option.fontFamily }}
                                >
                                    <span>{option.label}</span>
                                    {value === option.value && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Check size={14} />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
