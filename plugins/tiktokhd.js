import axios from 'axios';

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    let input = `[!] *Wrong input*
    
Example: ${usedPrefix + command} https://vt.tiktok.com/ZSFJnLnen/`;
    if (!text) return m.reply(input);

    // Indikasi proses dimulai
    await m.reply('⏱️ Processing...');
    try {
        const { data } = await tiktok(text);

        // Filter video dengan kualitas HD
        const videoUrl = data.medias
            .filter(item => item.quality === "hd")
            .map(item => item.url)[0];

        // Filter audio (biasanya formatnya mp3 atau m4a)
        const audioUrl = data.medias
            .filter(item => item.extension === "mp3" || item.extension === "m4a")
            .map(item => item.url)[0];

        // Buat caption
        let caption = `💬: ${data.title}\n▶️: ${data.duration}\n🎦: HD\n🔗: ${text}`;

        // Kirim video
        if (videoUrl) {
            await conn.sendFile(m.chat, videoUrl, '', caption, m);
            await conn.delay(500);
        }

        // Kirim audio
        if (audioUrl) {
            await conn.sendFile(m.chat, audioUrl, 'audio.mp3', '🎵 Audio from TikTok', m);
            await conn.delay(500);
        }

        // Indikasi proses selesai
        await m.reply('✅ Done!');
    } catch (e) {
        console.error(e);
        await m.reply(`[!] Error: ${e.message}`);
    }
};

handler.help = ['tiktokhd'];
handler.tags = ['downloader'];
handler.command = /^(tiktokhd|tthd)$/i;
handler.limit = true;
handler.register = true;

export default handler;

// Fungsi untuk mengambil data dari TikTok
async function tiktok(url) {
    const urls = { url };
    try {
        const response = await axios.post('https://snaptikapp.me/wp-json/aio-dl/video-data', urls, {
            headers: {
                Accept: '*/*',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Mobile Safari/537.36',
            },
        });
        const data = response.data;
        return { data };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch TikTok data');
    }
}