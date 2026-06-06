import { ref, watch, onMounted } from "vue";

export type EditorState = {
    content: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikethrough: boolean;
    textAlign: "left" | "center" | "right" | "justify";
    lineHeight: number;
    letterSpacing: number;
    textRotate: number;
    baselineShift: number;
    paperMargin: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    signature: {
        scale: number;
        x: number;
        y: number;
        color: string;
        image: string | null;
    };
    zoom: number;
    paperImage: string;
    isInteracting: boolean;
};

const DEFAULT_STATE: EditorState = {
    content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini orang tua/wali murid dari:<br><br>Nama: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Memberitahukan bahwa anak saya tersebut tidak dapat mengikuti pelajaran seperti biasa pada hari ini dikarenakan sakit. Oleh karena itu, kami memohon izin agar anak kami dapat beristirahat di rumah.<br><br>Demikian surat ini kami sampaikan. Atas perhatian dan izin yang diberikan, kami ucapkan terima kasih.<br><br>Hormat kami,<br><br>[Nama Orang Tua]",
    fontFamily: "'Gloria Hallelujah', cursive",
    fontSize: 18,
    color: "#0e3691",
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    textAlign: "left",
    lineHeight: 31.5,
    letterSpacing: 0,
    textRotate: -0.5,
    baselineShift: 0,
    paperMargin: {
        top: 230,
        left: 130,
        right: 80,
        bottom: 50,
    },
    signature: {
        scale: 1,
        x: 500,
        y: 850,
        color: "#0e3691",
        image: null,
    },
    zoom: 0.7,
    paperImage: "/Buku Tulis B5.png",
    isInteracting: false,
};

// Global state singleton for Vue reactivity sharing
const state = ref<EditorState>({ ...DEFAULT_STATE });
const isInitialized = ref(false);

export function useEditorState() {
    onMounted(() => {
        if (!isInitialized.value) {
            const saved = localStorage.getItem("tulis-izin-state");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    state.value = { ...DEFAULT_STATE, ...parsed };
                } catch (e) {
                    console.error("Failed to parse saved state", e);
                }
            }
            isInitialized.value = true;
        }
    });

    watch(
        state,
        (newState) => {
            if (typeof window !== "undefined" && isInitialized.value) {
                localStorage.setItem("tulis-izin-state", JSON.stringify(newState));
            }
        },
        { deep: true }
    );

    const updateState = (updates: Partial<EditorState>) => {
        state.value = { ...state.value, ...updates };
    };

    const updatePaperMargin = (updates: Partial<EditorState["paperMargin"]>) => {
        state.value.paperMargin = { ...state.value.paperMargin, ...updates };
    };

    const updateSignature = (updates: Partial<EditorState["signature"]>) => {
        state.value.signature = { ...state.value.signature, ...updates };
    };

    const updateInteraction = (isInteracting: boolean) => {
        state.value.isInteracting = isInteracting;
    };

    return {
        state,
        updateState,
        updatePaperMargin,
        updateSignature,
        updateInteraction,
    };
}
