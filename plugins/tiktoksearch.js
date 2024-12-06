import axios from 'axios';
const { prepareWAMessageMedia } = (await import('@adiwajshing/baileys')).default;

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  try {
    await m.reply('Processing...');

    let { title, no_watermark } = await tiktoks(text);

    // Menyiapkan pesan media dengan video
    let msg = await prepareWAMessageMedia(
      { video: { url: no_watermark } },
      { upload: conn.waUploadToServer }
    );

    // Membuat pesan dengan teks
    let message = {
      videoMessage: msg.videoMessage,
      caption: `*Title:* ${title}`,
      footer: 'Powered by your bot',
    };

    // Mengirim pesan video tanpa button atau elemen interaktif lainnya
    conn.relayMessage(m.chat, message, { messageId: m.key.id });

  } catch (e) {
    console.error(e);
    m.reply('An error occurred while processing your request.');
  }
};

handler.help = ['ttiktoksearch'];
handler.tags = ['downloader'];
handler.command = /^(ttsearch|tiktoksearch)$/i;
handler.limit = true;
handler.register = true;

export default handler;

async function tiktoks(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      });

      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("No videos found.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee];

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}