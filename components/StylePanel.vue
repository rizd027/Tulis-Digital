<script setup lang="ts">
import { Bold, Italic, Underline, Strikethrough } from "lucide-vue-next";

const { state, updateState } = useEditorState();

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
</script>

<template>
    <div class="space-y-8">
        <!-- Typography Section -->
        <div class="space-y-4">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typography</label>

            <div class="space-y-4">
                <div class="space-y-2">
                    <span class="text-xs text-slate-400">Font Tulisan</span>
                    <UiCustomSelect
                        :model-value="state.fontFamily"
                        @update:model-value="(val) => updateState({ fontFamily: val })"
                        :options="FONTS"
                        placeholder="Pilih Font"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <span class="text-xs text-slate-400">Ukuran</span>
                        <input
                            type="number"
                            :value="state.fontSize"
                            @input="updateState({ fontSize: Number(($event.target as HTMLInputElement).value) })"
                            class="w-full bg-black/20 border border-white/5 rounded-lg p-2.5 text-sm focus:border-[#0ea5e9] transition-all"
                        />
                    </div>
                    <div class="space-y-2">
                        <span class="text-xs text-slate-400">Warna Tinta</span>
                        <div class="relative h-[42px] rounded-lg overflow-hidden border border-white/5">
                            <input
                                type="color"
                                :value="state.color"
                                @input="updateState({ color: ($event.target as HTMLInputElement).value })"
                                class="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-4 gap-2">
                    <button
                        type="button"
                        @click="updateState({ isBold: !state.isBold })"
                        class="p-3 rounded-lg border border-white/5 transition-all flex justify-center items-center"
                        :class="state.isBold ? 'bg-[#0ea5e9] text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'"
                    >
                        <Bold size="16" />
                    </button>
                    <button
                        type="button"
                        @click="updateState({ isItalic: !state.isItalic })"
                        class="p-3 rounded-lg border border-white/5 transition-all flex justify-center items-center"
                        :class="state.isItalic ? 'bg-[#0ea5e9] text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'"
                    >
                        <Italic size="16" />
                    </button>
                    <button
                        type="button"
                        @click="updateState({ isUnderline: !state.isUnderline })"
                        class="p-3 rounded-lg border border-white/5 transition-all flex justify-center items-center"
                        :class="state.isUnderline ? 'bg-[#0ea5e9] text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'"
                    >
                        <Underline size="16" />
                    </button>
                    <button
                        type="button"
                        @click="updateState({ isStrikethrough: !state.isStrikethrough })"
                        class="p-3 rounded-lg border border-white/5 transition-all flex justify-center items-center"
                        :class="state.isStrikethrough ? 'bg-[#0ea5e9] text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'"
                    >
                        <Strikethrough size="16" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
