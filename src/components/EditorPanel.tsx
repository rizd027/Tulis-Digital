"use client";

import React, { useState, useEffect } from "react";
import {
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Calendar,
    List,
    ListOrdered,
    Eraser,
    Minus
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { EditorState } from "@/hooks/use-editor-state";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import CustomSelect from "./ui/CustomSelect";

interface EditorPanelProps {
    state: EditorState;
    updateState: (updates: Partial<EditorState>) => void;
}

const TEMPLATES = [
    // ==================== SEKOLAH ====================
    { id: "sakit_sekolah", label: "🏫 [SEKOLAH] Sakit", value: "sakit_sekolah", content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini orang tua/wali murid dari:<br><br>Nama: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Memberitahukan bahwa anak saya tersebut tidak dapat mengikuti pelajaran seperti biasa pada hari ini dikarenakan sakit. Oleh karena itu, kami memohon izin agar anak kami dapat beristirahat di rumah.<br><br>Demikian surat ini kami sampaikan. Atas perhatian dan izin yang diberikan, kami ucapkan terima kasih.<br><br>Hormat kami,<br><br>[Nama Orang Tua]" },
    { id: "izin_sekolah", label: "🏫 [SEKOLAH] Izin Kepentingan", value: "izin_sekolah", content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini orang tua/wali murid dari:<br><br>Nama: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Memberitahukan bahwa anak saya tidak dapat mengikuti kegiatan belajar mengajar pada hari ini dikarenakan ada keperluan keluarga yang mendesak/penting. Mohon kiranya Bapak/Ibu berkenan memberikan izin.<br><br>Demikian surat permohonan izin ini kami buat. Atas perhatian Bapak/Ibu, kami ucapkan terima kasih.<br><br>Hormat kami,<br><br>[Nama Orang Tua]" },
    { id: "sakit_dokter_sekolah", label: "🏫 [SEKOLAH] Sakit + Surat Dokter", value: "sakit_dokter_sekolah", content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Dengan ini mengajukan izin tidak dapat mengikuti kegiatan belajar mengajar pada tanggal [Tanggal] sampai dengan [Tanggal] dikarenakan sedang dalam perawatan medis/sakit. Terlampir surat keterangan dari dokter.<br><br>Demikian surat ini saya sampaikan. Atas perhatian dan pengertiannya, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Siswa]" },
    { id: "dinas_ortu_sekolah", label: "🏫 [SEKOLAH] Orang Tua Dinas", value: "dinas_ortu_sekolah", content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Orang Tua]<br>Orang Tua/Wali dari: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Memberitahukan bahwa anak saya tidak dapat mengikuti pelajaran pada tanggal [Tanggal] karena harus menemani orang tua yang sedang bertugas/dinas luar kota.<br><br>Demikian surat ini kami buat. Atas pengertiannya, kami ucapkan terima kasih.<br><br>Hormat kami,<br><br>[Nama Orang Tua]" },
    { id: "acara_keluarga_sekolah", label: "🏫 [SEKOLAH] Acara Keluarga", value: "acara_keluarga_sekolah", content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini orang tua dari:<br><br>Nama: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Mohon izin untuk anak kami tidak dapat hadir di sekolah pada hari [Hari, Tanggal] dikarenakan ada acara keluarga yang tidak dapat ditinggalkan.<br><br>Atas perhatian dan izin yang diberikan, kami mengucapkan terima kasih.<br><br>Hormat kami,<br><br>[Nama Orang Tua]" },
    { id: "terlambat_sekolah", label: "🏫 [SEKOLAH] Terlambat Masuk", value: "terlambat_sekolah", content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Dengan ini menyampaikan permohonan maaf karena terlambat masuk sekolah pada hari ini dikarenakan [Alasan, misal: kendala transportasi/kondisi cuaca/keperluan mendadak].<br><br>Saya berjanji akan lebih disiplin dalam mengatur waktu keberangkatan ke sekolah.<br><br>Demikian surat ini saya buat. Terima kasih atas pengertiannya.<br><br>Hormat saya,<br><br>[Nama Siswa]" },
    { id: "pulang_cepat_sekolah", label: "🏫 [SEKOLAH] Pulang Lebih Awal", value: "pulang_cepat_sekolah", content: "Kepada Yth,<br>Bapak/Ibu Guru Wali Kelas<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Siswa]<br>Kelas: [Kelas]<br><br>Mohon izin untuk pulang lebih awal pada jam [Jam] dikarenakan ada keperluan mendesak/kondisi kesehatan yang kurang baik.<br><br>Atas izin dan pengertian Bapak/Ibu, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Siswa]" },

    // ==================== KERJA ====================
    { id: "sakit_kerja", label: "🏢 [KERJA] Sakit", value: "sakit_kerja", content: "Kepada Yth,<br>HRD / Pimpinan [Nama Perusahaan]<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Jabatan: [Jabatan Anda]<br><br>Melalui surat ini bermaksud memberitahukan bahwa saya tidak dapat masuk kerja pada hari ini dikarenakan kondisi kesehatan yang sedang menurun (sakit). Saya memohon izin untuk beristirahat agar dapat segera pulih dan kembali bekerja.<br><br>Demikian surat ini saya sampaikan. Atas pengertian dan izin yang diberikan, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "cuti_kerja", label: "🏢 [KERJA] Permohonan Cuti", value: "cuti_kerja", content: "Kepada Yth,<br>HRD / Pimpinan [Nama Perusahaan]<br>di Tempat<br><br>Perihal: Permohonan Cuti<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Jabatan: [Jabatan Anda]<br><br>Bermaksud mengajukan permohonan cuti selama [Jumlah] hari, terhitung mulai tanggal [Tanggal Mulai] sampai dengan [Tanggal Selesai], dikarenakan [Alasan Cuti].<br><br>Selama saya cuti, saya akan tetap dapat dihubungi untuk hal-hal yang bersifat mendesak. Saya akan kembali bekerja pada tanggal [Tanggal Masuk].<br><br>Demikian permohonan ini saya ajukan. Atas perhatian dan persetujuannya, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "izin_kerja", label: "🏢 [KERJA] Izin Umum", value: "izin_kerja", content: "Kepada Yth,<br>HRD / Pimpinan [Nama Perusahaan]<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Jabatan: [Jabatan Anda]<br><br>Bermaksud memohon izin tidak masuk kerja pada hari ini, [Hari, Tanggal], dikarenakan adanya keperluan mendesak yang tidak dapat ditinggalkan.<br><br>Saya akan berusaha menyelesaikan tugas-tugas saya yang tertunda segera setelah saya kembali masuk kerja.<br><br>Demikian permohonan izin ini saya sampaikan. Atas pengertian Bapak/Ibu, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "lamaran_kerja", label: "🏢 [KERJA] Lamaran Kerja", value: "lamaran_kerja", content: "Kepada Yth,<br>HRD [Nama Perusahaan]<br>di Tempat<br><br>Dengan hormat,<br><br>Berdasarkan informasi lowongan pekerjaan yang saya dapatkan, saya bermaksud mengajukan lamaran pekerjaan di perusahaan Bapak/Ibu untuk posisi [Nama Posisi].<br><br>Saya memiliki latar belakang pendidikan [Pendidikan Terakhir] dan memiliki pengalaman di bidang [Bidang Keahlian]. Saya yakin dapat memberikan kontribusi positif bagi perusahaan.<br><br>Bersama surat ini, saya lampirkan dokumen pendukung sebagai bahan pertimbangan. Saya berharap dapat diberikan kesempatan wawancara.<br><br>Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "resign", label: "🏢 [KERJA] Resign", value: "resign", content: "Kepada Yth,<br>Pimpinan [Nama Perusahaan]<br>di Tempat<br><br>Perihal: Pengunduran Diri<br><br>Dengan hormat,<br><br>Melalui surat ini, saya [Nama Anda], dengan jabatan [Jabatan Anda], bermaksud mengajukan pengunduran diri dari [Nama Perusahaan], efektif mulai tanggal [Tanggal Terakhir Bekerja].<br><br>Saya mengucapkan terima kasih yang sebesar-besarnya atas kesempatan dan pengalaman yang telah diberikan selama saya bekerja di sini. Saya memohon maaf jika ada kesalahan selama saya bekerja.<br><br>Semoga [Nama Perusahaan] semakin sukses di masa depan.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "opname_kerja", label: "🏢 [KERJA] Rawat Inap", value: "opname_kerja", content: "Kepada Yth,<br>HRD / Pimpinan [Nama Perusahaan]<br>di Tempat<br><br>Perihal: Izin Tidak Masuk Kerja (Rawat Inap)<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Jabatan: [Jabatan Anda]<br><br>Dengan ini memberitahukan bahwa saya sedang menjalani perawatan di rumah sakit dan tidak dapat bekerja mulai tanggal [Tanggal Mulai] sampai dengan [Tanggal Selesai].<br><br>Terlampir surat keterangan dari rumah sakit. Saya akan segera kembali bekerja setelah kondisi membaik.<br><br>Demikian surat ini saya sampaikan. Terima kasih atas pengertiannya.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "dinas_kerja", label: "🏢 [KERJA] Surat Tugas Dinas", value: "dinas_kerja", content: "Kepada Yth,<br>HRD / Tim Terkait<br>di Tempat<br><br>Perihal: Pemberitahuan Tugas Dinas<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Jabatan: [Jabatan Anda]<br><br>Memberitahukan bahwa saya akan menjalankan tugas dinas ke [Lokasi] pada tanggal [Tanggal Mulai] hingga [Tanggal Selesai] untuk keperluan [Tujuan Dinas].<br><br>Selama dinas, saya tetap dapat dihubungi melalui telepon/email untuk koordinasi pekerjaan.<br><br>Demikian surat ini saya sampaikan. Terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "cuti_menikah", label: "🏢 [KERJA] Cuti Menikah", value: "cuti_menikah", content: "Kepada Yth,<br>HRD / Pimpinan [Nama Perusahaan]<br>di Tempat<br><br>Perihal: Permohonan Cuti Menikah<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Jabatan: [Jabatan Anda]<br><br>Bermaksud mengajukan cuti menikah selama [Jumlah] hari, terhitung mulai tanggal [Tanggal Mulai] sampai dengan [Tanggal Selesai].<br><br>Saya akan kembali bekerja pada tanggal [Tanggal Masuk]. Terlampir undangan pernikahan sebagai bukti.<br><br>Demikian permohonan ini. Atas persetujuannya, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "kenaikan_gaji", label: "🏢 [KERJA] Permohonan Kenaikan Gaji", value: "kenaikan_gaji", content: "Kepada Yth,<br>HRD / Pimpinan [Nama Perusahaan]<br>di Tempat<br><br>Perihal: Permohonan Kenaikan Gaji<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Jabatan: [Jabatan Anda]<br>Masa Kerja: [Lama Bekerja]<br><br>Melalui surat ini, saya ingin mengajukan permohonan kenaikan gaji. Selama bekerja di perusahaan ini, saya telah [Pencapaian/Kontribusi].<br><br>Saya berharap kontribusi saya dapat dipertimbangkan untuk penyesuaian kompensasi yang lebih baik.<br><br>Demikian surat ini. Atas pertimbangannya, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },

    // ==================== UMUM ====================
    { id: "maaf", label: "📄 [UMUM] Permohonan Maaf", value: "maaf", content: "Kepada Yth,<br>[Nama Penerima]<br>di Tempat<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br><br>Melalui surat ini, saya ingin menyampaikan permohonan maaf yang sebesar-besarnya atas kesalahan/kekhilafan yang telah saya perbuat, yaitu [Sebutkan Kesalahan].<br><br>Saya menyadari bahwa hal tersebut telah menimbulkan ketidaknyamanan. Saya berjanji tidak akan mengulangi kesalahan yang sama di kemudian hari.<br><br>Demikian surat permohonan maaf ini saya buat dengan tulus. Atas kebesaran hati untuk memaafkan, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "kuasa", label: "📄 [UMUM] Surat Kuasa", value: "kuasa", content: "SURAT KUASA<br><br>Saya yang bertanda tangan di bawah ini:<br>Nama: [Nama Pemberi Kuasa]<br>NIK: [NIK Pemberi Kuasa]<br>Alamat: [Alamat Pemberi Kuasa]<br><br>Selanjutnya disebut PEMBERI KUASA.<br><br>Memberikan kuasa penuh kepada:<br>Nama: [Nama Penerima Kuasa]<br>NIK: [NIK Penerima Kuasa]<br>Alamat: [Alamat Penerima Kuasa]<br><br>Selanjutnya disebut PENERIMA KUASA.<br><br>KHUSUS<br>Untuk [Tujuan Pemberian Kuasa, misal: mengambil dokumen X di instansi Y].<br><br>Demikian Surat Kuasa ini dibuat untuk dipergunakan sebagaimana mestinya.<br><br>[Tempat, Tanggal]<br><br>Penerima Kuasa,\t\tPemberi Kuasa,<br><br><br>(materai)<br><br>[Nama Penerima]\t\t[Nama Pemberi]" },
    { id: "pernyataan", label: "📄 [UMUM] Surat Pernyataan", value: "pernyataan", content: "SURAT PERNYATAAN<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Tempat/Tgl Lahir: [TTL]<br>Alamat: [Alamat Lengkap]<br><br>Dengan ini menyatakan dengan sesungguhnya bahwa:<br><br>1. [Poin Pernyataan 1]<br>2. [Poin Pernyataan 2]<br>3. [Poin Pernyataan 3]<br><br>Demikian surat pernyataan ini saya buat dengan sebenar-benarnya tanpa ada paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.<br><br>[Tempat, Tanggal]<br><br>Yang Membuat Pernyataan,<br><br><br>(materai)<br><br>[Nama Anda]" },
    { id: "keterangan", label: "📄 [UMUM] Surat Keterangan", value: "keterangan", content: "SURAT KETERANGAN<br><br>Yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Pembuat Surat]<br>Jabatan: [Jabatan]<br><br>Dengan ini menerangkan bahwa:<br><br>Nama: [Nama yang Diterangkan]<br>NIK/NIM/NIP: [Nomor Identitas]<br>Alamat: [Alamat]<br><br>Adalah benar [Keterangan, misal: warga RT 01/RW 05, karyawan perusahaan, mahasiswa aktif, dll].<br><br>Surat keterangan ini dibuat untuk keperluan [Tujuan].<br><br>Demikian surat keterangan ini dibuat dengan sebenarnya.<br><br>[Tempat, Tanggal]<br><br>Yang Membuat Keterangan,<br><br><br><br>[Nama & Tanda Tangan]" },
    { id: "undangan", label: "📄 [UMUM] Surat Undangan", value: "undangan", content: "SURAT UNDANGAN<br><br>Kepada Yth,<br>[Nama Undangan]<br>di Tempat<br><br>Dengan hormat,<br><br>Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara:<br><br>Acara: [Nama Acara]<br>Hari/Tanggal: [Hari, Tanggal]<br>Waktu: [Jam]<br>Tempat: [Lokasi Lengkap]<br><br>Mengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu tepat waktu.<br><br>Demikian undangan ini kami sampaikan. Atas perhatian dan kehadirannya, kami ucapkan terima kasih.<br><br>[Tempat, Tanggal]<br><br>Hormat kami,<br><br><br>[Nama Penyelenggara]" },
    { id: "pengaduan", label: "📄 [UMUM] Surat Pengaduan", value: "pengaduan", content: "Kepada Yth,<br>[Nama Instansi/Pihak yang Dituju]<br>di Tempat<br><br>Perihal: Pengaduan<br><br>Dengan hormat,<br><br>Saya yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Anda]<br>Alamat: [Alamat Lengkap]<br>No. HP: [Nomor HP]<br><br>Melalui surat ini ingin menyampaikan pengaduan mengenai [Subjek Pengaduan]. Kronologi kejadian adalah sebagai berikut:<br><br>[Ceritakan kronologi secara detail]<br><br>Saya berharap pihak terkait dapat menindaklanjuti pengaduan ini dengan segera dan memberikan solusi yang tepat.<br><br>Demikian surat pengaduan ini. Atas perhatiannya, saya ucapkan terima kasih.<br><br>Hormat saya,<br><br>[Nama Anda]" },
    { id: "rekomendasi", label: "📄 [UMUM] Surat Rekomendasi", value: "rekomendasi", content: "SURAT REKOMENDASI<br><br>Yang bertanda tangan di bawah ini:<br><br>Nama: [Nama Pemberi Rekomendasi]<br>Jabatan: [Jabatan]<br>Instansi: [Nama Instansi]<br><br>Dengan ini memberikan rekomendasi kepada:<br><br>Nama: [Nama yang Direkomendasikan]<br>NIK/NIM: [Nomor Identitas]<br><br>Bahwa yang bersangkutan memiliki [Kualitas/Kemampuan] dan layak untuk [Tujuan Rekomendasi, misal: melanjutkan studi, melamar pekerjaan, dll].<br><br>Selama [periode waktu], yang bersangkutan telah menunjukkan [Pencapaian/Prestasi].<br><br>Demikian surat rekomendasi ini dibuat untuk dapat dipergunakan sebagaimana mestinya.<br><br>[Tempat, Tanggal]<br><br>Hormat saya,<br><br><br>[Nama & Tanda Tangan]" },
];

export default function EditorPanel({ state, updateState }: EditorPanelProps) {
    const editorRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (editorRef.current) {
            // Only update if the content is materially different to avoid losing selection
            // We use a temporary div to normalize the HTML for comparison
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = state.content;
            const normalizedStateContent = tempDiv.innerHTML;

            if (editorRef.current.innerHTML !== normalizedStateContent) {
                // If the user is focused on the editor, we should be extra careful
                // but usually if the content is different (e.g. from template or toolbar), we MUST update
                editorRef.current.innerHTML = state.content;
            }
        }
    }, [state.content]);

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            updateState({ content: editorRef.current.innerHTML });
        }
    };

    const [showDateOptions, setShowDateOptions] = useState(false);
    const [selectedCity, setSelectedCity] = useState("Jakarta");

    const cities = [
        "Jakarta", "Bandung", "Surabaya", "Medan", "Semarang",
        "Makassar", "Palembang", "Tangerang", "Depok", "Bekasi",
        "Yogyakarta", "Malang", "Bogor", "Denpasar"
    ];

    const getIndonesianDate = (city: string = selectedCity) => {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        const date = new Date();
        return `${city}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    const handleInsertDate = () => {
        const dateStr = getIndonesianDate();
        if (editorRef.current) {
            const currentContent = editorRef.current.innerHTML;
            const newContent = currentContent ? `${dateStr}<br>${currentContent}` : dateStr;
            updateState({ content: newContent });
        }
        setShowDateOptions(false);
    };

    // Keyboard shortcuts
    useKeyboardShortcuts({
        onSave: () => {
            toast.success('Perubahan tersimpan otomatis!', {
                position: 'top-center',
                duration: 2000,
                style: {
                    background: '#1e293b',
                    color: '#fff',
                    border: '1px solid rgba(14, 165, 233, 0.3)'
                }
            });
        },
        onUndo: () => handleFormat('undo'),
        onRedo: () => handleFormat('redo'),
        onBold: () => handleFormat('bold'),
        onItalic: () => handleFormat('italic'),
        onUnderline: () => handleFormat('underline')
    });

    // Show keyboard shortcut hint on mount 
    useEffect(() => {
        const hasSeenHint = localStorage.getItem('keyboard-hints-seen');
        if (!hasSeenHint) {
            setTimeout(() => {
                toast('💡 Tip: Gunakan Ctrl+S untuk menyimpan, Ctrl+B untuk bold!', {
                    position: 'bottom-center',
                    duration: 5000,
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid rgba(14, 165, 233, 0.3)'
                    }
                });
                localStorage.setItem('keyboard-hints-seen', 'true');
            }, 3000);
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Isi Surat</label>
                <div className="bg-[#0f172a]/40 rounded-2xl border border-white/10 focus-within:border-[#0ea5e9]/50 transition-all duration-500 shadow-2xl backdrop-blur-md">
                    {/* Unified Toolbar */}
                    <div className="flex items-center gap-1.5 md:gap-3 p-2 md:p-3 bg-white/[0.02] border-b border-white/5 flex-wrap rounded-t-2xl">
                        {/* Action Group */}
                        <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/5 shrink-0">
                            <ToolbarButton onClick={() => handleFormat("undo")} icon={<Undo size={14} />} title="Undo" />
                            <ToolbarButton onClick={() => handleFormat("redo")} icon={<Redo size={14} />} title="Redo" />
                        </div>

                        {/* Format Group */}
                        <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/5 shrink-0">
                            <ToolbarButton onClick={() => handleFormat("bold")} icon={<Bold size={14} />} title="Bold" />
                            <ToolbarButton onClick={() => handleFormat("italic")} icon={<Italic size={14} />} title="Italic" />
                            <ToolbarButton onClick={() => handleFormat("underline")} icon={<Underline size={14} />} title="Underline" />
                            <ToolbarButton onClick={() => handleFormat("strikeThrough")} icon={<Strikethrough size={14} />} title="Strikethrough" />
                        </div>

                        {/* Alignment Group */}
                        <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/5 shrink-0">
                            <ToolbarButton onClick={() => handleFormat("justifyLeft")} icon={<AlignLeft size={14} />} title="Align Left" />
                            <ToolbarButton onClick={() => handleFormat("justifyCenter")} icon={<AlignCenter size={14} />} title="Align Center" />
                            <ToolbarButton onClick={() => handleFormat("justifyRight")} icon={<AlignRight size={14} />} title="Align Right" />
                            <ToolbarButton onClick={() => handleFormat("justifyFull")} icon={<AlignJustify size={14} />} title="Justify" />
                        </div>

                        {/* List Group */}
                        <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/5 shrink-0">
                            <ToolbarButton onClick={() => handleFormat("insertUnorderedList")} icon={<List size={14} />} title="Bullet List" />
                            <ToolbarButton onClick={() => handleFormat("insertOrderedList")} icon={<ListOrdered size={14} />} title="Numbered List" />
                        </div>

                        {/* Misc Group */}
                        <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/5 shrink-0">
                            <ToolbarButton onClick={() => handleFormat("insertHorizontalRule")} icon={<Minus size={14} />} title="Horizontal Line" />
                            <ToolbarButton onClick={() => handleFormat("removeFormat")} icon={<Eraser size={14} />} title="Clear Formatting" />
                        </div>

                        {/* Date Tool */}
                        <div className="flex items-center bg-white/[0.03] rounded-lg p-0.5 border border-white/5 relative">
                            <button
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setShowDateOptions(!showDateOptions);
                                }}
                                className={cn(
                                    "h-7 px-3 rounded-md text-[10px] font-bold transition-all flex items-center gap-2",
                                    showDateOptions
                                        ? "bg-[#0ea5e9] text-white shadow-lg shadow-[#0ea5e9]/20"
                                        : "text-slate-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10"
                                )}
                                title="Insert Date"
                            >
                                <Calendar size={13} />
                                <span className="hidden sm:inline">TANGGAL</span>
                            </button>

                            {showDateOptions && (
                                <div className="absolute left-0 top-10 z-50 bg-[#1e293b] border border-white/10 rounded-xl p-3 shadow-2xl min-w-[200px] space-y-2 backdrop-blur-xl">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pilih Kota</label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full bg-[#0f172a]/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#0ea5e9]/50"
                                    >
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                    <div className="text-[10px] text-slate-400 mt-1 mb-1 bg-[#0f172a]/40 p-2 rounded-md border border-white/5">
                                        <span className="opacity-50 block mb-0.5">Preview:</span>
                                        <span className="text-[#0ea5e9] font-medium">{getIndonesianDate()}</span>
                                    </div>
                                    <button
                                        onClick={handleInsertDate}
                                        className="w-full py-2 bg-[#0ea5e9] hover:brightness-110 text-white rounded-lg text-[10px] font-black transition-all active:scale-95 shadow-lg shadow-[#0ea5e9]/20"
                                    >
                                        Sisipkan Tanggal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        onPaste={(e) => {
                            e.preventDefault();
                            const text = e.clipboardData.getData("text/plain");
                            document.execCommand("insertText", false, text);
                        }}
                        onInput={(e) => updateState({ content: e.currentTarget.innerHTML })}
                        className="editor-content w-full h-40 md:h-56 bg-transparent p-4 md:p-6 border-none focus:ring-0 overflow-auto text-sm outline-none text-slate-300 leading-relaxed custom-scrollbar"
                        style={{
                            minHeight: "10rem",
                        }}
                    />
                    <style>{`
                        .editor-content ul, .editor-content ol {
                            padding-left: 1.5rem;
                            margin: 0.5rem 0;
                        }
                        .editor-content ul {
                            list-style-type: disc;
                        }
                        .editor-content ol {
                            list-style-type: decimal;
                        }
                        .editor-content li {
                            display: list-item;
                            margin-bottom: 0.2rem;
                        }
                        .editor-content hr {
                            border: none;
                            border-top: 1px solid currentColor;
                            margin: 1rem 0;
                            opacity: 0.3;
                        }
                    `}</style>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Template Cepat</label>
                <CustomSelect
                    value=""
                    onChange={(val) => {
                        const tmpl = TEMPLATES.find(t => t.value === val);
                        if (tmpl) updateState({ content: tmpl.content });
                    }}
                    options={TEMPLATES}
                    placeholder="Pilih Template..."
                />
            </div>
        </div>
    );
}

function ToolbarButton({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) {
    return (
        <button
            onMouseDown={(e) => {
                e.preventDefault();
                onClick();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/10 transition-all duration-300 active:scale-90 group"
            title={title}
        >
            <div className="group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
        </button>
    );
}
