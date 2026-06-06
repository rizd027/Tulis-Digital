<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import { ChevronDown, Check } from "lucide-vue-next";

interface Option {
    label: string;
    value: string;
    fontFamily?: string;
}

const props = withDefaults(defineProps<{
    modelValue: string;
    options: Option[];
    placeholder?: string;
}>(), {
    placeholder: "Select..."
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "change", value: string): void;
}>();

const isOpen = ref(false);
const containerRef = ref<HTMLDivElement | null>(null);

const selectedOption = computed(() => {
    return props.options.find(opt => opt.value === props.modelValue);
});

const selectOption = (val: string) => {
    emit("update:modelValue", val);
    emit("change", val);
    isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
    <div class="relative" ref="containerRef">
        <button
            type="button"
            @click="isOpen = !isOpen"
            class="w-full flex items-center justify-between bg-black/20 border border-white/5 rounded-xl p-3 text-sm text-left transition-all duration-200"
            :class="isOpen ? 'border-[#0ea5e9]/50 bg-black/40 shadow-[0_0_20px_rgba(14,165,233,0.1)]' : 'hover:bg-white/5 hover:border-white/10'"
        >
            <span
                class="truncate text-slate-200"
                :style="{ fontFamily: selectedOption?.fontFamily }"
            >
                {{ selectedOption ? selectedOption.label : placeholder }}
            </span>
            <ChevronDown
                size="16"
                class="text-slate-500 transition-transform duration-200"
                :class="isOpen && 'transform rotate-180 text-[#0ea5e9]'"
            />
        </button>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
        >
            <div
                v-if="isOpen"
                class="absolute z-50 w-full mt-2 bg-[#1e293b]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
            >
                <div class="p-1.5 space-y-0.5">
                    <button
                        type="button"
                        v-for="option in options"
                        :key="option.value"
                        @click="selectOption(option.value)"
                        class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors text-left"
                        :class="modelValue === option.value ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] font-medium' : 'text-slate-400 hover:text-white hover:bg-white/5'"
                        :style="{ fontFamily: option.fontFamily }"
                    >
                        <span>{{ option.label }}</span>
                        <Check v-if="modelValue === option.value" size="14" />
                    </button>
                </div>
            </div>
        </Transition>
    </div>
</template>
