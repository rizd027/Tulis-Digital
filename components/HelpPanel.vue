<script setup lang="ts">
import { ref } from "vue";
import { Keyboard, Zap, FileText, Mouse, Coffee, ExternalLink } from "lucide-vue-next";

const activeTab = ref<"shortcuts" | "tips">("shortcuts");

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
        icon: FileText,
        title: "Template Cepat",
        description: "Gunakan template yang sudah tersedia untuk memulai surat dengan cepat"
    },
    {
        icon: Zap,
        title: "Autosave Aktif",
        description: "Perubahan Anda otomatis tersimpan di browser. Tidak perlu khawatir kehilangan data!"
    },
    {
        icon: Mouse,
        title: "Seret Tanda Tangan",
        description: "Klik dan seret tanda tangan untuk memposisikannya dengan bebas"
    },
    {
        icon: Keyboard,
        title: "Shortcut Keyboard",
        description: "Gunakan Ctrl+B, Ctrl+I, Ctrl+U untuk formatting cepat saat mengetik"
    }
];
</script>

<template>
    <div class="space-y-4">
        <div>
            <h3 class="text-lg font-black text-white mb-1">Bantuan & Tips</h3>
            <p class="text-xs text-slate-400">Pelajari cara menggunakan TulisIzin lebih efektif</p>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-white/10 -mx-6 px-6">
            <button
                @click="activeTab = 'shortcuts'"
                class="flex-1 py-2.5 px-4 text-xs font-bold transition-all relative"
                :class="activeTab === 'shortcuts' ? 'text-[#0ea5e9]' : 'text-slate-400 hover:text-slate-300'"
            >
                <Keyboard size="14" class="inline mr-1.5" />
                Keyboard Shortcuts
                <div v-if="activeTab === 'shortcuts'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0ea5e9]" />
            </button>
            <button
                @click="activeTab = 'tips'"
                class="flex-1 py-2.5 px-4 text-xs font-bold transition-all relative"
                :class="activeTab === 'tips' ? 'text-[#0ea5e9]' : 'text-slate-400 hover:text-slate-300'"
            >
                <Zap size="14" class="inline mr-1.5" />
                Tips & Trik
                <div v-if="activeTab === 'tips'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0ea5e9]" />
            </button>
        </div>

        <!-- Content -->
        <div>
            <div v-if="activeTab === 'shortcuts'" class="space-y-2">
                <div
                    v-for="(shortcut, idx) in shortcuts"
                    :key="idx"
                    class="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                    <span class="text-xs text-slate-300">{{ shortcut.description }}</span>
                    <div class="flex gap-1">
                        <template v-for="(key, i) in shortcut.keys" :key="i">
                            <kbd class="px-2 py-1 bg-[#0f172a] border border-white/10 rounded text-[10px] font-mono text-[#0ea5e9] font-bold">
                                {{ key }}
                            </kbd>
                            <span v-if="i < shortcut.keys.length - 1" class="text-slate-500 mx-0.5 text-[10px]">+</span>
                        </template>
                    </div>
                </div>
            </div>

            <div v-else-if="activeTab === 'tips'" class="space-y-3">
                <div
                    v-for="(tip, idx) in tips"
                    :key="idx"
                    class="p-3 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                    <div class="flex items-start gap-2.5">
                        <div class="p-1.5 bg-[#0ea5e9]/10 rounded-lg text-[#0ea5e9] shrink-0">
                            <component :is="tip.icon" size="20" />
                        </div>
                        <div class="flex-1">
                            <h3 class="font-bold text-xs text-white mb-0.5">{{ tip.title }}</h3>
                            <p class="text-[11px] text-slate-400 leading-relaxed">{{ tip.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Support Section -->
        <div class="pt-4 border-t border-white/10 mt-6">
            <a
                href="https://saweria.co/frd027"
                target="_blank"
                rel="noopener noreferrer"
                class="group block p-4 bg-gradient-to-br from-[#0ea5e9]/10 to-[#38bdf8]/5 border border-[#0ea5e9]/20 rounded-2xl hover:border-[#0ea5e9]/40 transition-all duration-300"
            >
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[#0ea5e9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#0ea5e9]/20 group-hover:scale-110 transition-transform">
                        <Coffee size="20" />
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-1.5">
                            <h4 class="text-xs font-black text-white">Traktir Kopi ☕</h4>
                            <ExternalLink size="10" class="text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <p class="text-[10px] text-slate-400 mt-0.5">Dukung pengembang agar aplikasi tetap gratis & update!</p>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>
