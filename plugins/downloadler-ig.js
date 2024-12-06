import { igdl } from 'btch-downloader';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Masukan Link Nya`;
    let res = await igdl(args[0]);
    for (let i of res) {
        await conn.sendFile(m.chat, i.url, 'instagram.mp4', '', m);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Delay 1500ms
    }
};

handler.help = ['ig'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(ig(dl)?)$/i;
handler.limit = true;

export default handler;