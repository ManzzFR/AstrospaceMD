import axios from "axios";
import ocrapi from "ocr-space-api-wrapper"; // OCR API untuk ekstrak teks dari gambar
import uploadFile from '../lib/uploadFile.js'; // Upload file untuk OCR

let handler = async (m, { conn }) => {
    // Cek apakah pesan yang dikirim adalah gambar
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    // Pastikan gambar yang dikirim
    if (!mime) throw `Balas gambar dengan perintah .soal`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `_*Jenis ${mime} tidak didukung!*_`;

    try {
        // Mengunduh gambar yang dikirim pengguna
        let img = await q.download();
        
        // Upload gambar untuk OCR
        let url = await uploadFile(img);
        
        // Menggunakan OCR untuk mendapatkan teks dari gambar
        let hasil = await ocrapi.ocrSpace(url);
        const extractedText = hasil.ParsedResults[0]?.ParsedText.trim();
        
        if (!extractedText) throw 'Tidak ada teks yang ditemukan dalam gambar.';
        
        // Menggunakan teks hasil OCR sebagai input untuk GPT-4
        const responseText = await openai(extractedText);
        
        // Mengirimkan balasan dari OpenAI (GPT-4)
        await m.reply(`✨ *Chat-GPT4o*\n\n> ${responseText}\n\n_hasil jawaban AI tidak menjamin semua jawaban benar, cari literasi atau dari sumber lain untuk membenahi jawaban_`);
    } catch (e) {
        console.error(e);
        await m.reply(`❌ Terjadi kesalahan saat memproses permintaanmu. Coba lagi nanti.`);
    }
};

handler.help = ["aiimg <reply image>"];
handler.tags = ["ai"];
handler.command = /^(aiimg)$/i;

export default handler;

// Fungsi untuk memanggil OpenAI (GPT-4)
async function openai(text) {
    try {
        let response = await axios.post("https://chateverywhere.app/api/chat/", {
            "model": {
                "id": "gpt-4",
                "name": "GPT-4",
                "maxLength": 32000,
                "tokenLimit": 8000,
                "completionTokenLimit": 5000,
                "deploymentName": "gpt-4"
            },
            "messages": [
                {
                    "pluginId": null,
                    "content": text,
                    "role": "user"
                }
            ],
            "prompt": "Nama kamu adalah Astrobot, kamu dibuat dan dikembangkan oleh Developer Amatir Bernama ー Mαnzz. Pakailah bahasa yg formal tapi tetap sopan. saat menjawab pertanyaan usahakan jangan ubah sebagaimana mestinya jawabannya. Kamu cerdas dalam menangani masalah apapun tapi tetap sopan dalam memanggil nama orang.Jangan pernah gunakan emoji Pelangi apapun pertanyaan nya,dan kamu Saya buat untuk TIDAK MENDUKUNG LGBT,RASIS,SARA.",
            "temperature": 0.5
        }, {
            headers: {
                "Accept": "application/json",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
            }
        });

        return response.data; // Mengembalikan hasil dari API
    } catch (error) {
        console.error("Error saat memanggil API OpenAI:", error);
        throw "Gagal memproses permintaan. Coba lagi nanti.";
    }
}