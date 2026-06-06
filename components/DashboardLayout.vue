<script setup lang="ts">
import { ref } from "vue";
import {
    FileText,
    Palette,
    User,
    Layout,
    Download,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Maximize2,
    Coffee
} from "lucide-vue-next";

type Tab = "editor" | "style" | "signature" | "layout" | "export" | "help";

const { state, updateState, updateInteraction } = useEditorState();
const { toasts } = useToast();

const activeTab = ref<Tab>("editor");
const isSidebarCollapsed = ref(false);
const isExporting = ref(false);
const isMobilePanelOpen = ref(false);

const tabs = [
    { id: "editor", icon: FileText, title: "Isi Surat" },
    { id: "style", icon: Palette, title: "Gaya & Font" },
    { id: "signature", icon: User, title: "Tanda Tangan" },
    { id: "layout", icon: Layout, title: "Layout & Zoom" },
    { id: "export", icon: Download, title: "Export" },
    { id: "help", icon: HelpCircle, title: "Bantuan" },
];

const handleTabClick = (id: Tab) => {
    if (activeTab.value === id) {
        isSidebarCollapsed.value = !isSidebarCollapsed.value; // Desktop toggle
        isMobilePanelOpen.value = !isMobilePanelOpen.value; // Mobile toggle
    } else {
        activeTab.value = id;
        isSidebarCollapsed.value = false; // Open on desktop
        isMobilePanelOpen.value = true; // Open on mobile
    }
};
</script>

<template>
    <div class="flex flex-col md:flex-row h-screen w-full bg-[#0f172a] text-slate-200 overflow-hidden relative">
        <!-- Toast Notifications -->
        <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[100] space-y-2 pointer-events-none">
            <TransitionGroup
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform -translate-y-4 opacity-0 scale-95"
                enter-to-class="transform translate-y-0 opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="transform translate-y-0 opacity-100 scale-100"
                leave-to-class="transform -translate-y-4 opacity-0 scale-95"
            >
                <div
                    v-for="toast in toasts"
                    :key="toast.id"
                    class="pointer-events-auto bg-[#1e293b]/95 backdrop-blur-md text-white border border-[#0ea5e9]/20 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium tracking-wide"
                >
                    <div v-if="toast.type === 'success'" class="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <div v-else-if="toast.type === 'error'" class="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <div v-else class="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                    <span>{{ toast.message }}</span>
                </div>
            </TransitionGroup>
        </div>

        <!-- Top Bar for Mobile (Logo) -->
        <div v-if="!state.isInteracting" class="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-white/5 z-40 shrink-0">
            <div class="flex flex-col">
                <h1 class="text-lg font-black italic tracking-tighter">
                    Tulis<span class="text-[#0ea5e9] -ml-0.5">Izin</span>
                </h1>
                <p class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Digital Letter Maker</p>
            </div>
        </div>

        <!-- Sidebar Navigation (Desktop: Left, Mobile: Floating Bottom Bar) -->
        <aside
            class="z-50 flex md:flex-col flex-row justify-around md:justify-between items-center transition-all duration-500 shrink-0 fixed bottom-6 left-4 right-4 h-16 bg-[#1e293b]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] px-2 md:relative md:bottom-auto md:left-auto md:right-auto md:w-16 md:h-full md:rounded-none md:border-r md:border-t-0 md:bg-[#1e293b] md:backdrop-blur-none md:shadow-none md:py-6 md:px-0 md:order-first"
            :class="[
                state.isInteracting ? 'translate-y-32 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto' : '',
                isExporting ? 'pointer-events-none opacity-50' : ''
            ]"
        >
            <div class="flex md:flex-col flex-row gap-0 md:gap-4 w-full md:w-auto justify-center md:justify-start relative">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    type="button"
                    @click="handleTabClick(tab.id as Tab)"
                    class="flex-1 md:flex-none p-2 md:p-3 rounded-xl transition-all duration-300 relative group flex flex-col items-center gap-0.5 md:gap-1 z-10"
                    :class="activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-white'"
                    :title="tab.title"
                >
                    <!-- Mobile Active Indicator Pill -->
                    <div v-if="activeTab === tab.id" class="absolute inset-x-1 inset-y-1.5 bg-[#0ea5e9]/10 rounded-xl md:hidden" />

                    <div class="p-1 md:p-1.5 rounded-lg transition-all duration-300" :class="activeTab === tab.id ? 'bg-[#0ea5e9]/15 md:bg-[#0ea5e9]/20' : ''">
                        <component
                            :is="tab.icon"
                            :size="18"
                            :stroke-width="activeTab === tab.id ? 2.5 : 2"
                            class="transition-transform duration-300"
                            :class="activeTab === tab.id ? 'text-[#0ea5e9] scale-110' : 'group-hover:text-white'"
                        />
                    </div>
                    <!-- Mobile Label -->
                    <span class="text-[9px] font-black md:hidden tracking-tighter transition-colors duration-300" :class="activeTab === tab.id ? 'text-[#0ea5e9]' : 'text-slate-500'">
                        {{
                            tab.id === "editor" ? "SURAT" :
                            tab.id === "style" ? "GAYA" :
                            tab.id === "signature" ? "TANDA" :
                            tab.id === "layout" ? "LAYOUT" :
                            tab.id === "export" ? "UNDUH" : "INFO"
                        }}
                    </span>

                    <div v-if="activeTab === tab.id" class="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#0ea5e9] shadow-[0_0_10px_rgba(14,165,233,0.5)] hidden md:block" />
                </button>
            </div>

            <div class="flex md:flex-col items-center gap-4">
                <a
                    href="https://saweria.co/frd027"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-3 text-slate-500 hover:text-[#0ea5e9] transition-all relative group hidden md:block"
                    title="Traktir Kopi"
                >
                    <Coffee size="20" class="group-hover:scale-110 transition-transform" />
                    <span class="absolute left-full ml-2 px-2 py-1 bg-[#0f172a] text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Traktir Kopi ☕
                    </span>
                </a>

                <button
                    type="button"
                    @click="isSidebarCollapsed = !isSidebarCollapsed"
                    class="p-3 text-slate-500 hover:text-white transition-colors hidden md:block"
                >
                    <ChevronRight v-if="isSidebarCollapsed" :size="20" />
                    <ChevronLeft v-else :size="20" />
                </button>
            </div>
        </aside>

        <!-- Control Panel (Desktop: Sidebar) -->
        <div class="hidden md:flex flex-col h-full bg-[#1e293b]/50 backdrop-blur-xl border-r border-white/5 overflow-hidden">
            <div
                class="flex h-full flex-col transition-all duration-300"
                :style="{
                    width: isSidebarCollapsed ? '0px' : '320px',
                    opacity: isSidebarCollapsed ? 0 : 1
                }"
            >
                <div class="p-6 border-b border-white/5 flex flex-col gap-1">
                    <h1 class="text-xl font-black italic tracking-tighter">
                        Tulis<span class="text-[#0ea5e9] -ml-0.5">Izin</span>
                    </h1>
                    <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Digital Letter Maker</p>
                </div>

                <div class="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    <div class="space-y-4">
                        <EditorPanel v-if="activeTab === 'editor'" />
                        <StylePanel v-if="activeTab === 'style'" />
                        <SignaturePanel v-if="activeTab === 'signature'" />
                        <LayoutPanel v-if="activeTab === 'layout'" />
                        <div v-if="activeTab === 'export'" class="space-y-4">
                            <div>
                                <h3 class="text-base font-black text-white mb-1">Export Surat</h3>
                                <p class="text-[10px] text-slate-400">Pilih format export</p>
                            </div>
                            <ExportOptions
                                :is-exporting="isExporting"
                                @export-start="isExporting = true"
                                @export-end="isExporting = false"
                            />
                        </div>
                        <HelpPanel v-if="activeTab === 'help'" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile Panel (Bottom Sheet) -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-y-full opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-full opacity-0"
        >
            <div
                v-if="isMobilePanelOpen"
                class="md:hidden fixed left-4 right-4 z-40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl transition-all duration-300 pb-safe"
                :class="state.isInteracting ? 'bg-transparent border-transparent shadow-none max-h-[15vh] bottom-40' : 'bg-[#1e293b]/95 max-h-[55vh] bottom-24 shadow-[0_20px_60px_-15px_rgba(0,0,0,1)]'"
            >
                <div v-if="!state.isInteracting" class="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                    <h3 class="text-sm font-bold text-slate-200">
                        {{ tabs.find(t => t.id === activeTab)?.title }}
                    </h3>
                    <button
                        type="button"
                        @click="isMobilePanelOpen = false"
                        class="text-xs text-slate-400 font-medium bg-white/5 px-2 py-1 rounded"
                    >
                        Tutup
                    </button>
                </div>
                <div
                    class="flex-1 overflow-y-auto p-4 space-y-6 transition-all"
                    :class="state.isInteracting ? 'overflow-hidden p-0' : ''"
                >
                    <EditorPanel v-if="activeTab === 'editor'" />
                    <StylePanel v-if="activeTab === 'style'" />
                    <SignaturePanel v-if="activeTab === 'signature'" />
                    <LayoutPanel v-if="activeTab === 'layout'" />
                    <div v-if="activeTab === 'export'" class="space-y-4">
                        <div>
                            <h3 class="text-base font-black text-white mb-1">Export Surat</h3>
                            <p class="text-[10px] text-slate-400">Pilih format export</p>
                        </div>
                        <ExportOptions
                            :is-exporting="isExporting"
                            @export-start="isExporting = true"
                            @export-end="isExporting = false"
                        />
                    </div>
                    <HelpPanel v-if="activeTab === 'help'" />
                </div>
            </div>
        </Transition>

        <!-- Preview Area -->
        <main class="flex-1 overflow-auto bg-[#0c111d] p-4 md:p-12 flex justify-center items-start custom-scrollbar pb-32 md:pb-12">
            <PaperPreview />
        </main>

        <!-- Premium Zoom Control -->
        <div class="fixed bottom-[94px] md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-[49] flex flex-col items-center md:items-end gap-3 pointer-events-none w-full max-w-[90vw] md:w-auto">
            <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform translate-y-4 opacity-0 scale-95"
                enter-to-class="transform translate-y-0 opacity-100 scale-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="transform translate-y-0 opacity-100 scale-100"
                leave-to-class="transform translate-y-4 opacity-0 scale-95"
            >
                <div
                    v-if="!state.isInteracting"
                    class="bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 p-1.5 md:p-3 rounded-full md:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-2 md:gap-4 pointer-events-auto"
                >
                    <div class="flex items-center gap-0.5 md:gap-1.5">
                        <button
                            type="button"
                            @click="updateState({ zoom: Math.max(0.3, state.zoom - 0.1) })"
                            class="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                            title="Zoom Out"
                        >
                            <Minus :size="14" />
                        </button>

                        <div class="min-w-[35px] md:min-w-[45px] text-center">
                            <span class="text-[10px] md:text-[11px] font-black text-[#0ea5e9]">
                                {{ Math.round(state.zoom * 100) }}%
                            </span>
                        </div>

                        <button
                            type="button"
                            @click="updateState({ zoom: Math.min(1.5, state.zoom + 0.1) })"
                            class="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                            title="Zoom In"
                        >
                            <Plus :size="14" />
                        </button>
                    </div>

                    <div class="flex items-center gap-2 md:gap-3 pl-2 border-l border-white/5 md:border-white/10">
                        <input
                            type="range"
                            min="0.3"
                            max="1.5"
                            step="0.05"
                            :value="state.zoom"
                            @input="updateState({ zoom: parseFloat(($event.target as HTMLInputElement).value) })"
                            @mousedown="updateInteraction(true)"
                            @touchstart="updateInteraction(true)"
                            @mouseup="updateInteraction(false)"
                            @touchend="updateInteraction(false)"
                            class="w-16 sm:w-20 md:w-32 h-1 md:h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#0ea5e9] hover:accent-[#38bdf8] transition-all"
                        />

                        <button
                            type="button"
                            @click="updateState({ zoom: 0.7 })"
                            class="p-1 md:p-2 text-slate-500 hover:text-white transition-colors"
                            title="Reset Zoom"
                        >
                            <Maximize2 :size="12" />
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>
