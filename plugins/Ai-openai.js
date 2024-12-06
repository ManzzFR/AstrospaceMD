/**
    Dibuat Oleh Jaya ID
    Telah Menggunakan GPT 4

    Harap wm ini jangan dihapus
**/
import axios from "axios";

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) {
        throw `Apa yang pengen kamu tanyain?\n\nContoh: ${usedPrefix + command} halo bot`;
    }

    try {
        let d = new Date(new Date() + 3600000); // Tanggal sesuai saat ini
        let locale = 'id'; // Berlokasi di Indonesia
        const jam = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        let hari = d.toLocaleDateString(locale, { weekday: 'long' });
        let tgl = d.toLocaleDateString(locale, {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        let logic = `Nama kamu adalah Astrobot, kamu dibuat dan dikembangkan oleh Developer Amatir Bernama ManzzFR. Pakailah bahasa yg formal tapi tetap sopan. saat menjawab pertanyaan usahakan jangan ubah sebagaimana mestinya jawabannya. Kamu cerdas dalam menangani masalah apapun tapi tetap sopan dalam memanggil nama orang.Jangan pernah gunakan emoji Pelangi apapun pertanyaan nya,dan kamu Saya buat untuk TIDAK MENDUKUNG LGBT,RASIS,SARA DAN JOMOK.`;

        let json = await openai(text, logic); // Memanggil fungsi OpenAI

        // Membalas pesan langsung dengan m.reply
        await m.reply(`✨ *ChatGPT4*\n\n> ${json}`);
    } catch (e) {
        console.error(e);
        await m.reply(`❌ Terjadi kesalahan saat memproses permintaanmu. Coba lagi nanti.`);
    }
};

handler.help = ["openai <teks>", "ai"];
handler.tags = ["ai"];
handler.command = /^(ai|openai|gpt)$/i;

export default handler;

async function openai(text, logic) {
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
            "prompt": logic,
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