import { createHash } from 'crypto';

let otpStore = {}; // Penyimpanan sementara OTP

let handler = async function (m, { text, usedPrefix, command }) {
    let user = global.db.data.users[m.sender];
    const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

    // **Ganti Nomor**: Perintah `.ganti-nomor nomor-baru`
    if (command === 'ganti-nomor') {
        if (!text || !text.match(/^\d{10,15}$/)) return m.reply('Masukkan nomor baru yang valid. Nomor harus terdiri dari 10-15 digit.');
        
        let newNumber = text.trim();
        
        // Cek apakah pengguna sudah terdaftar
        if (!user.registered) {
            return m.reply('Anda belum terdaftar. Gunakan perintah *daftar* untuk mendaftar terlebih dahulu.');
        }

        // Kirim OTP ke nomor baru
        let otp = Math.floor(100 + Math.random() * 900).toString(); // OTP 3 digit
        otpStore[newNumber] = { otp, oldNumber: m.sender }; // Simpan OTP dan nomor lama

        await conn.reply(m.chat, `Kode OTP untuk mengganti nomor Anda: *${otp}*\nGunakan perintah *${usedPrefix}perif <kodeotp>* untuk memverifikasi.`, m);
    }

    // **Verifikasi OTP**: Perintah `.perif kodeotp`
    if (command === 'perif') {
        if (!text) return m.reply(`Masukkan kode OTP yang dikirimkan.\nGunakan format:\n*${usedPrefix}perif <kodeotp>*`);
        let otp = text.trim();

        // Cek OTP untuk nomor baru
        let data = otpStore[m.sender];

        if (!data || data.otp !== otp) {
            return m.reply('Kode OTP salah atau sudah kadaluarsa.');
        }

        // Verifikasi dan update nomor
        user.phoneNumber = data.oldNumber; // Mengganti nomor lama ke nomor baru
        delete otpStore[m.sender]; // Hapus data OTP setelah verifikasi

        let cap = `
*I N F O R M A S I*

*Nomor Lama:* ${data.oldNumber}
*Nomor Baru:* ${m.sender}
*Status:* _Berhasil_
`;
        await conn.sendMessage(m.chat, { text: cap, contextInfo: { "externalAdReply": { "title": "Pembaruan Nomor Berhasil", "mediaType": 1, "thumbnailUrl": pp, "renderLargerThumbnail": true }}}, m);
    }
};

handler.help = ['ganti-nomor', 'perif'];
handler.tags = ['main'];

handler.command = /^(ganti-nomor|perif)$/i;

export default handler;