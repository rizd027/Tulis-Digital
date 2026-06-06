<script setup lang="ts">
const { state } = useEditorState();
</script>

<template>
    <div class="w-full min-h-full flex items-center justify-center p-4 md:p-8">
        <div
            id="paper-to-export"
            class="relative bg-white shadow-[0_40px_100px_rgba(0,0,0,0.6)] w-[794px] h-[1123px] flex-shrink-0 transition-all origin-top overflow-hidden"
            :style="{
                transform: `scale(${state.zoom})`,
                backgroundImage: `url('${state.paperImage}')`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }"
        >
            <!-- Content Layer -->
            <div class="absolute inset-0 z-10 flex flex-col pointer-events-none">
                <!-- Top Margin Spacer -->
                <div :style="{ height: `${state.paperMargin.top}px` }" class="w-full shrink-0" />

                <div class="flex-1 flex overflow-hidden">
                    <!-- Left Margin Spacer -->
                    <div :style="{ width: `${state.paperMargin.left}px` }" class="h-full shrink-0" />

                    <!-- Content Area -->
                    <div
                        class="flex-1"
                        :style="{
                            paddingRight: `${state.paperMargin.right}px`,
                            paddingBottom: `${state.paperMargin.bottom}px`,
                        }"
                    >
                        <div
                            class="paper-content"
                            :style="{
                                fontFamily: state.fontFamily,
                                fontSize: `${state.fontSize}px`,
                                color: state.color,
                                fontWeight: state.isBold ? 'bold' : 'normal',
                                fontStyle: state.isItalic ? 'italic' : 'normal',
                                textDecoration: [
                                    state.isUnderline ? 'underline' : '',
                                    state.isStrikethrough ? 'line-through' : ''
                                ].filter(Boolean).join(' '),
                                lineHeight: `${state.lineHeight}px`,
                                letterSpacing: `${state.letterSpacing}px`,
                                transform: `rotate(${state.textRotate}deg) translateY(${state.baselineShift}px)`,
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }"
                            v-html="state.content || ''"
                        />
                    </div>
                </div>
            </div>

            <!-- Signature Overlay -->
            <div
                v-if="state.signature.image"
                :style="{
                    position: 'absolute',
                    left: `${state.signature.x}px`,
                    top: `${state.signature.y}px`,
                    transform: `scale(${state.signature.scale})`,
                    pointerEvents: 'none',
                    zIndex: 20,
                }"
            >
                <img
                    :src="state.signature.image"
                    alt="Signature"
                    :style="{
                        filter: `drop-shadow(0 0 0 ${state.signature.color})`,
                        maxWidth: '300px',
                    }"
                />
            </div>
        </div>
    </div>
</template>

<style>
.paper-content * {
    font-family: inherit !important;
    font-size: inherit !important;
    color: inherit !important;
    line-height: inherit !important;
}
.paper-content p, .paper-content div {
    margin: 0;
    padding: 0;
}
.paper-content ul, .paper-content ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
}
.paper-content ul {
    list-style-type: disc;
}
.paper-content ol {
    list-style-type: decimal;
}
.paper-content li {
    display: list-item;
    margin-bottom: 0.2rem;
}
.paper-content hr {
    border: none;
    border-top: 1px solid currentColor;
    margin: 1rem 0;
    opacity: 0.3;
}
</style>
