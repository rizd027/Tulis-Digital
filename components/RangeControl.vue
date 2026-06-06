<script setup lang="ts">
defineProps<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
}>();

const emit = defineEmits<{
  (e: "update:value", val: number): void;
  (e: "update:interaction", active: boolean): void;
}>();
</script>

<template>
  <div class="space-y-2">
      <div class="flex justify-between items-center">
          <span class="text-[11px] font-medium text-slate-400">{{ label }}</span>
          <span class="text-[11px] font-black text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-0.5 rounded-full">{{ value }}</span>
      </div>
      <input
          type="range"
          :min="min"
          :max="max"
          :step="step"
          :value="value"
          @input="emit('update:value', Number(($event.target as HTMLInputElement).value))"
          @mousedown="emit('update:interaction', true)"
          @touchstart="emit('update:interaction', true)"
          @mouseup="emit('update:interaction', false)"
          @touchend="emit('update:interaction', false)"
          class="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#0ea5e9]"
      />
  </div>
</template>
