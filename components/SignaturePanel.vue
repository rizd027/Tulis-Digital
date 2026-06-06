<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Trash2, Upload } from "lucide-vue-next";

const { state, updateSignature, updateInteraction } = useEditorState();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let isDrawing = false;

const startDrawing = (e: MouseEvent | TouchEvent) => {
    isDrawing = true;
    draw(e);
};

const stopDrawing = () => {
    if (!isDrawing) return;
    isDrawing = false;
    ctx?.beginPath();
    saveSignature();
};

const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing || !canvasRef.value || !ctx) return;
    const canvas = canvasRef.value;
    const rect = canvas.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = state.value.signature.color;

    if (e.type === "mousedown" || e.type === "touchstart") {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
};

const saveSignature = () => {
    if (canvasRef.value) {
        updateSignature({ image: canvasRef.value.toDataURL("image/png") });
    }
};

const clear = () => {
    if (canvasRef.value && ctx) {
        ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        updateSignature({ image: null });
    }
};

const handleFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            updateSignature({ image: event.target?.result as string });
        };
        reader.readAsDataURL(file);
    }
};

onMounted(() => {
    if (canvasRef.value) {
        ctx = canvasRef.value.getContext("2d");
        canvasRef.value.width = canvasRef.value.offsetWidth;
        canvasRef.value.height = canvasRef.value.offsetHeight;
    }
});
</script>

<template>
    <div class="space-y-8">
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanda Tangan</label>
                <button
                    type="button"
                    @click="clear"
                    class="p-1 px-2 text-[10px] font-bold text-red-400 hover:bg-red-400/10 rounded-md transition-colors flex items-center gap-1"
                >
                    <Trash2 size="12" /> CLEAR
                </button>
            </div>

            <div class="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                <canvas
                    ref="canvasRef"
                    @mousedown="startDrawing"
                    @mousemove="draw"
                    @mouseup="stopDrawing"
                    @mouseleave="stopDrawing"
                    @touchstart.passive="startDrawing"
                    @touchmove.passive="draw"
                    @touchend="stopDrawing"
                    class="w-full h-40 cursor-crosshair bg-transparent"
                />
            </div>

            <div class="flex gap-2">
                <label class="flex-1 py-3 bg-white/5 border border-white/5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-white/10 cursor-pointer transition-all">
                    <Upload size="14" /> PNG/JPG
                    <input type="file" @change="handleFileUpload" class="hidden" accept="image/*" />
                </label>
                <div class="w-12 h-12 rounded-xl overflow-hidden border border-white/5 relative bg-white/5 group">
                    <input
                        type="color"
                        :value="state.signature.color"
                        @input="updateSignature({ color: ($event.target as HTMLInputElement).value })"
                        class="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer"
                    />
                </div>
            </div>
        </div>

        <div class="space-y-6">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transformasi</label>

            <div class="space-y-5">
                <RangeControl
                    label="Skala"
                    :value="state.signature.scale"
                    :min="0.1"
                    :max="2"
                    :step="0.1"
                    @update:value="(v) => updateSignature({ scale: v })"
                    @update:interaction="updateInteraction"
                />
                <RangeControl
                    label="Posisi X"
                    :value="state.signature.x"
                    :min="0"
                    :max="800"
                    @update:value="(v) => updateSignature({ x: v })"
                    @update:interaction="updateInteraction"
                />
                <RangeControl
                    label="Posisi Y"
                    :value="state.signature.y"
                    :min="0"
                    :max="1100"
                    @update:value="(v) => updateSignature({ y: v })"
                    @update:interaction="updateInteraction"
                />
            </div>
        </div>
    </div>
</template>
