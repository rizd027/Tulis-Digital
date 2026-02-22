"use client";

import React from "react";
import { Download, FileText, Printer, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ExportOptionsProps {
    isExporting: boolean;
    onExportStart: () => void;
    onExportEnd: () => void;
}

export default function ExportOptions({ isExporting, onExportStart, onExportEnd }: ExportOptionsProps) {
    const handleExportPNG = async () => {
        const el = document.getElementById("paper-to-export");
        if (!el || isExporting) return;

        try {
            onExportStart();
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
                    boxShadow: 'none',
                    transform: 'scale(1)',
                    transition: 'none',
                },
                skipFonts: false
            });

            const link = document.createElement('a');
            link.download = `tulis-izin-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();

            el.style.transition = originalTransition;
            el.style.transform = originalTransform;

            toast.success('Berhasil disimpan sebagai PNG!', {
                position: 'top-center',
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(14, 165, 233, 0.3)'
                }
            });
        } catch (err) {
            console.error('Export PNG failed:', err);
            toast.error('Gagal menyimpan gambar');
        } finally {
            onExportEnd();
        }
    };

    const handleExportPDF = async () => {
        const el = document.getElementById("paper-to-export");
        if (!el || isExporting) return;

        try {
            onExportStart();
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
                    boxShadow: 'none',
                    transform: 'scale(1)',
                    transition: 'none',
                },
                skipFonts: false
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const imgHeight = 297;

            pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`tulis-izin-${Date.now()}.pdf`);

            el.style.transition = originalTransition;
            el.style.transform = originalTransform;

            toast.success('Berhasil disimpan sebagai PDF!', {
                position: 'top-center',
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(14, 165, 233, 0.3)'
                }
            });
        } catch (err) {
            console.error('Export PDF failed:', err);
            toast.error('Gagal membuat PDF');
        } finally {
            onExportEnd();
        }
    };

    const handlePrint = async () => {
        const el = document.getElementById("paper-to-export");
        if (!el) return;

        try {
            onExportStart();

            // Wait for fonts to load
            await document.fonts.ready;

            // Save original styles
            const originalTransform = el.style.transform;
            const originalTransition = el.style.transition;

            // Reset transform for accurate capture
            el.style.transition = "none";
            el.style.transform = "scale(1)";

            await new Promise(resolve => setTimeout(resolve, 100));

            // Convert to image first for pixel-perfect printing
            const dataUrl = await toPng(el, {
                quality: 1,
                pixelRatio: 2,
                style: {
                    boxShadow: 'none',
                    transform: 'scale(1)',
                    transition: 'none',
                },
                skipFonts: false
            });

            // Restore original styles
            el.style.transition = originalTransition;
            el.style.transform = originalTransform;

            // Open print window with image
            const printWindow = window.open('', '', 'width=900,height=1200');
            if (!printWindow) {
                toast.error('Popup diblokir! Izinkan popup untuk print.');
                onExportEnd();
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
                    onExportEnd();
                }, 100);
            }, 1000);

        } catch (err) {
            console.error('Print failed:', err);
            toast.error('Gagal melakukan print');
            onExportEnd();
        }
    };


    const handleShare = async () => {
        const el = document.getElementById("paper-to-export");
        if (!el || isExporting) return;

        try {
            onExportStart();
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
                    boxShadow: 'none',
                    transform: 'scale(1)',
                    transition: 'none',
                },
                skipFonts: false
            });

            el.style.transition = originalTransition;
            el.style.transform = originalTransform;

            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const file = new File([blob], 'surat-izin.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Surat Izin',
                    text: 'Surat izin yang dibuat dengan TulisIzin'
                });
                toast.success('Berhasil dibagikan!', {
                    position: 'top-center',
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid rgba(14, 165, 233, 0.3)'
                    }
                });
            } else {
                try {
                    await navigator.clipboard.write([
                        new ClipboardItem({
                            'image/png': blob
                        })
                    ]);
                    toast.success('Gambar disalin ke clipboard!', {
                        position: 'top-center',
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            border: '1px solid rgba(14, 165, 233, 0.3)'
                        }
                    });
                } catch (clipErr) {
                    toast.error('Browser tidak mendukung share/copy');
                }
            }
        } catch (err) {
            console.error('Share failed:', err);
            toast.error('Gagal membagikan');
        } finally {
            onExportEnd();
        }
    };

    return (
        <div className="space-y-2">
            <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className={cn(
                    "w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group",
                    isExporting
                        ? "bg-slate-700 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-[#0ea5e9] to-[#06b6d4] hover:brightness-110 shadow-lg active:scale-[0.98]"
                )}
            >
                <Download size={18} />
                <span className="text-sm">Simpan PNG</span>
            </button>

            <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className={cn(
                    "w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                    isExporting
                        ? "bg-slate-700 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:brightness-110 shadow-lg active:scale-[0.98]"
                )}
            >
                <FileText size={18} />
                <span className="text-sm">Simpan PDF</span>
            </button>

            <button
                onClick={handlePrint}
                disabled={isExporting}
                className={cn(
                    "w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                    isExporting
                        ? "bg-slate-700 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:brightness-110 shadow-lg active:scale-[0.98]"
                )}
            >
                <Printer size={18} />
                <span className="text-sm">Print</span>
            </button>

            <button
                onClick={handleShare}
                disabled={isExporting}
                className={cn(
                    "w-full py-3 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2",
                    isExporting
                        ? "bg-slate-700 cursor-not-allowed opacity-50"
                        : "bg-gradient-to-r from-[#10b981] to-[#059669] hover:brightness-110 shadow-lg active:scale-[0.98]"
                )}
            >
                <Share2 size={18} />
                <span className="text-sm">Share / Copy</span>
            </button>
        </div>
    );
}
