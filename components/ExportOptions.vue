<script setup lang="ts">
import { Download, FileText, Printer, Share2 } from "lucide-vue-next";

const props = defineProps<{
  isExporting: boolean;
}>();

const emit = defineEmits<{
  (e: "exportStart"): void;
  (e: "exportEnd"): void;
}>();

const toast = useToast();

const handleExportPNG = async () => {
    const el = document.getElementById("paper-to-export");
    if (!el || props.isExporting) return;

    try {
        emit("exportStart");
        const { toPng } = await import("html-to-image");
        await document.fonts.ready;

        const originalTransform = el.style.transform;
        const originalTransition = el.style.transition;

        el.style.transition = "none";
        el.style.transform = "scale(1)";

        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await toPng(el, {
            quality: 1,
            pixelRatio: 2,
            style: {
                boxShadow: "none",
                transform: "scale(1)",
                transition: "none",
            },
            skipFonts: false
        });

        const link = document.createElement("a");
        link.download = `tulis-izin-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        el.style.transition = originalTransition;
        el.style.transform = originalTransform;

        toast.success("Berhasil disimpan sebagai PNG!");
    } catch (err) {
        console.error("Export PNG failed:", err);
        toast.error("Gagal menyimpan gambar");
    } finally {
        emit("exportEnd");
    }
};

const handleExportPDF = async () => {
    const el = document.getElementById("paper-to-export");
    if (!el || props.isExporting) return;

    try {
        emit("exportStart");
        const { toPng } = await import("html-to-image");
        const { jsPDF } = await import("jspdf");
        await document.fonts.ready;

        const originalTransform = el.style.transform;
        const originalTransition = el.style.transition;

        el.style.transition = "none";
        el.style.transform = "scale(1)";

        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await toPng(el, {
            quality: 1,
            pixelRatio: 3,
            style: {
                boxShadow: "none",
                transform: "scale(1)",
                transition: "none",
            },
            skipFonts: false
        });

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const imgWidth = 210;
        const imgHeight = 297;

        pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(`tulis-izin-${Date.now()}.pdf`);

        el.style.transition = originalTransition;
        el.style.transform = originalTransform;

        toast.success("Berhasil disimpan sebagai PDF!");
    } catch (err) {
        console.error("Export PDF failed:", err);
        toast.error("Gagal membuat PDF");
    } finally {
        emit("exportEnd");
    }
};

const handlePrint = async () => {
    const el = document.getElementById("paper-to-export");
    if (!el) return;

    try {
        emit("exportStart");
        const { toPng } = await import("html-to-image");
        await document.fonts.ready;

        const originalTransform = el.style.transform;
        const originalTransition = el.style.transition;

        el.style.transition = "none";
        el.style.transform = "scale(1)";

        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await toPng(el, {
            quality: 1,
            pixelRatio: 2,
            style: {
                boxShadow: "none",
                transform: "scale(1)",
                transition: "none",
            },
            skipFonts: false
        });

        el.style.transition = originalTransition;
        el.style.transform = originalTransform;

        const printWindow = window.open("", "", "width=900,height=1200");
        if (!printWindow) {
            toast.error("Popup diblokir! Izinkan popup untuk print.");
            emit("exportEnd");
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Surat Izin</title>
                <style>
                    @page { 
                        margin: 0; 
                        size: A4 portrait;
                    }
                    body { 
                        margin: 0; 
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    img {
                        width: 210mm;
                        height: 297mm;
                        object-fit: contain;
                        page-break-after: avoid;
                    }
                    @media print {
                        body { margin: 0; }
                        img { width: 100%; height: 100%; }
                    }
                </style>
            </head>
            <body>
                <img src="${dataUrl}" alt="Surat Izin" />
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            setTimeout(() => {
                printWindow.close();
                emit("exportEnd");
            }, 100);
        }, 1000);

    } catch (err) {
        console.error("Print failed:", err);
        toast.error("Gagal melakukan print");
        emit("exportEnd");
    }
};

const handleShare = async () => {
    const el = document.getElementById("paper-to-export");
    if (!el || props.isExporting) return;

    try {
        emit("exportStart");
        const { toPng } = await import("html-to-image");
        await document.fonts.ready;

        const originalTransform = el.style.transform;
        const originalTransition = el.style.transition;

        el.style.transition = "none";
        el.style.transform = "scale(1)";

        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await toPng(el, {
            quality: 1,
            pixelRatio: 2,
            style: {
                boxShadow: "none",
                transform: "scale(1)",
                transition: "none",
            },
            skipFonts: false
        });

        el.style.transition = originalTransition;
        el.style.transform = originalTransform;

        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "surat-izin.png", { type: "image/png" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: "Surat Izin",
                text: "Surat izin yang dibuat dengan TulisIzin"
            });
            toast.success("Berhasil dibagikan!");
        } else {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        "image/png": blob
                    })
                ]);
                toast.success("Gambar disalin ke clipboard!");
            } catch (clipErr) {
                toast.error("Browser tidak mendukung share/copy");
            }
        }
    } catch (err) {
        console.error("Share failed:", err);
        toast.error("Gagal membagikan");
    } finally {
        emit("exportEnd");
    }
};
</script>

<template>
    <div class="space-y-2">
        <button
            @click="handleExportPNG"
            :disabled="isExporting"
            class="w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
            :class="isExporting ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:brightness-110 shadow-lg active:scale-[0.98]'"
        >
            <Download size="18" />
            <span class="text-sm">Simpan PNG</span>
        </button>

        <button
            @click="handleExportPDF"
            :disabled="isExporting"
            class="w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            :class="isExporting ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:brightness-110 shadow-lg active:scale-[0.98]'"
        >
            <FileText size="18" />
            <span class="text-sm">Simpan PDF</span>
        </button>

        <button
            @click="handlePrint"
            :disabled="isExporting"
            class="w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            :class="isExporting ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:brightness-110 shadow-lg active:scale-[0.98]'"
        >
            <Printer size="18" />
            <span class="text-sm">Print</span>
        </button>

        <button
            @click="handleShare"
            :disabled="isExporting"
            class="w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            :class="isExporting ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 shadow-lg active:scale-[0.98]'"
        >
            <Share2 size="18" />
            <span class="text-sm">Share / Copy</span>
        </button>
    </div>
</template>
