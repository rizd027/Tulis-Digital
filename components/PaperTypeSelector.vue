<script setup lang="ts">
import { Check } from "lucide-vue-next";

defineProps<{
    selectedPaper: string;
}>();

const emit = defineEmits<{
    (e: "selectPaper", paper: string): void;
}>();

const PAPER_TYPES = [
    {
        id: "buku_b5",
        name: "Buku Tulis B5",
        image: "/Buku Tulis B5.png",
        description: "Kertas bergaris standar B5"
    },
    {
        id: "buku_kecil",
        name: "Buku Tulis Kecil",
        image: "/Buku Tulis Kecil.png",
        description: "Buku tulis ukuran kecil"
    },
    {
        id: "kertas_polos",
        name: "Kertas Polos",
        image: "/paper1.svg",
        description: "Kertas polos tanpa garis"
    }
];
</script>

<template>
    <div class="space-y-3">
        <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Jenis Kertas
        </label>
        <div class="grid grid-cols-3 gap-2">
            <button
                type="button"
                v-for="paper in PAPER_TYPES"
                :key="paper.id"
                @click="emit('selectPaper', paper.image)"
                class="relative p-3 rounded-xl border-2 transition-all duration-300 group overflow-hidden"
                :class="selectedPaper === paper.image ? 'border-[#0ea5e9] bg-[#0ea5e9]/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'"
            >
                <!-- Preview -->
                <div class="aspect-[3/4] bg-[#0f172a]/60 rounded-lg mb-2 overflow-hidden border border-white/5">
                    <div
                        class="w-full h-full bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity"
                        :style="{ backgroundImage: `url(${paper.image})` }"
                    />
                </div>

                <!-- Info -->
                <div class="text-left">
                    <div class="font-bold text-xs text-slate-200 mb-0.5">
                        {{ paper.name }}
                    </div>
                    <div class="text-[9px] text-slate-400">
                        {{ paper.description }}
                    </div>
                </div>

                <!-- Selected Indicator -->
                <div v-if="selectedPaper === paper.image" class="absolute top-2 right-2 w-5 h-5 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                    <Check size="12" stroke-width="3" class="text-white" />
                </div>
            </button>
        </div>
    </div>
</template>
