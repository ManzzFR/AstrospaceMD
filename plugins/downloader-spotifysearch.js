import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Example: ${usedPrefix + command} 3gUZpvR4h9ErseH3AzaHJL`;

    m.reply("Searching...");

    // Menyiapkan URL API dengan ID album Spotify yang dimasukkan
    let albumId = text.trim(); // Menggunakan ID album yang dimasukkan
    let apiUrl = `https://api.siputzx.my.id/api/d/spotify?url=https://open.spotify.com/album/${albumId}`;

    // Memanggil API untuk mendapatkan data
    let res = await fetch(apiUrl);
    let data = await res.json();

    // Mengecek apakah ada hasil dari API
    if (!data || !data.result || data.result.length === 0) {
        m.reply("No results found.");
        return;
    }

    let get_result = data.result;
    let ini_txt = `Found: *${albumId}*\n`;

    // Menambahkan informasi hasil pencarian
    for (let x of get_result) {
        ini_txt += `\n\n*Title: ${x.title}*\n`;
        ini_txt += `Artists: ${x.artist}\n`;
        ini_txt += `Duration: ${x.duration}\n`;
        ini_txt += `Link: ${x.url}\n\n`;
        ini_txt += `───────────────────`;
    }

    m.reply(ini_txt);
};

handler.help = ['spotifysearch'].map(v => v + ' <album_id>');
handler.tags = ['downloader', 'tools'];
handler.command = /^spot(ify)?search$/i;
handler.limit = true;
handler.register = true;

export default handler;