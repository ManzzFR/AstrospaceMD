import yts from 'yt-search';
import fs from 'fs';
import os from 'os';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';

const handler = async (m, { conn, command, text, usedPrefix }) => {
    if (!text) throw `Use example: ${usedPrefix}${command} <search term>`;

    // Pencarian video berdasarkan query
    const search = await yts(text);
    const vid = search.videos[0];
    if (!vid) throw 'Video tidak ditemukan, coba judul lain';

    const { title, thumbnail, timestamp, views, ago, url, description, author } = vid;

    try {
        // Mengunduh URL audio dari API ryzendesu
        const response = await axios.get(`https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(url)}`);
        const downloadUrl = response.data.url;
        if (!downloadUrl) throw new Error('Audio URL not found');

        // Membuat teks detail untuk pesan
        const caption = `
∘ 🎟️ *Title*: ${title}
∘ 📍 *Ext*: Search
∘ 🎬 *Duration*: ${timestamp}
∘ 👁️ *Viewers*: ${views}
∘ 🆙 *Uploaded*: ${ago}
∘ ✍️ *Author*: ${author.name}
∘ 🔗 *URL*: ${url}

∘ 📝 *Description*: ${description.slice(0, 200)}...
`;

        // Mengirim gambar dengan caption
        await conn.sendMessage(m.chat, { 
            image: { url: thumbnail }, 
            caption 
        }, { quoted: m });

        // Mengirim audio
        await conn.sendMessage(m.chat, {
            audio: {
                url: downloadUrl
            },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 2,
                    mediaUrl: url,
                    title: title,
                    body: 'Audio Download',
                    sourceUrl: url,
                    thumbnail: await (await conn.getFile(thumbnail)).data,
                },
            },
        }, { quoted: m });
    } catch (error) {
        console.error('Error:', error.message);
        throw `Error: ${error.message}. Coba ulangi lagi..`;
    }
};

handler.help = ['play'].map((v) => v + ' <query>');
handler.tags = ['downloader'];
handler.command = /^(play)$/i;

handler.limit = 1;
handler.register = true;
handler.disable = false;

export default handler;