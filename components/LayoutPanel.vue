<script setup lang="ts">
const { state, updateState, updatePaperMargin, updateInteraction } = useEditorState();
</script>

<template>
    <div class="space-y-8">
        <PaperTypeSelector
            :selected-paper="state.paperImage"
            @select-paper="(paper) => updateState({ paperImage: paper })"
        />

        <div class="space-y-4">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Margin Kertas</label>
            <div class="space-y-5">
                <RangeControl
                    label="Margin Atas"
                    :value="state.paperMargin.top"
                    :min="0"
                    :max="400"
                    @update:value="(v) => updatePaperMargin({ top: v })"
                    @update:interaction="updateInteraction"
                />
                <div class="grid grid-cols-2 gap-4">
                    <RangeControl
                        label="Kiri"
                        :value="state.paperMargin.left"
                        :min="0"
                        :max="300"
                        @update:value="(v) => updatePaperMargin({ left: v })"
                        @update:interaction="updateInteraction"
                    />
                    <RangeControl
                        label="Kanan"
                        :value="state.paperMargin.right"
                        :min="0"
                        :max="300"
                        @update:value="(v) => updatePaperMargin({ right: v })"
                        @update:interaction="updateInteraction"
                    />
                </div>
                <RangeControl
                    label="Margin Bawah"
                    :value="state.paperMargin.bottom"
                    :min="0"
                    :max="400"
                    @update:value="(v) => updatePaperMargin({ bottom: v })"
                    @update:interaction="updateInteraction"
                />
            </div>
        </div>

        <div class="space-y-4">
            <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detail Layout</label>
            <div class="space-y-5">
                <RangeControl
                    label="Jarak Baris"
                    :value="state.lineHeight"
                    :min="20"
                    :max="50"
                    :step="0.5"
                    @update:value="(v) => updateState({ lineHeight: v })"
                    @update:interaction="updateInteraction"
                />
                <RangeControl
                    label="Baseline Shift"
                    :value="state.baselineShift"
                    :min="-20"
                    :max="20"
                    :step="0.5"
                    @update:value="(v) => updateState({ baselineShift: v })"
                    @update:interaction="updateInteraction"
                />
                <RangeControl
                    label="Spacing Huruf"
                    :value="state.letterSpacing"
                    :min="-5"
                    :max="10"
                    :step="0.1"
                    @update:value="(v) => updateState({ letterSpacing: v })"
                    @update:interaction="updateInteraction"
                />
                <RangeControl
                    label="Kemiringan"
                    :value="state.textRotate"
                    :min="-2"
                    :max="2"
                    :step="0.1"
                    @update:value="(v) => updateState({ textRotate: v })"
                    @update:interaction="updateInteraction"
                />
            </div>
        </div>
    </div>
</template>
