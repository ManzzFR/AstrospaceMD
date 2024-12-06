import { createHash } from 'crypto';

let otpStore = {}; // Penyimpanan sementara OTP

let handler = async function (m, { text, usedPrefix, command }) {
    let user = global.db.data.users[m.sender];
    const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg");

    // Jika user sudah terdaftar
    if (user.registered === true) throw `Anda sudah terdaftar. Untuk mendaftar ulang gunakan perintah *${usedPrefix}unreg*`;

    // **Mode Manual**: Perintah `.daftar nama.umur`
    if (command === 'daftar') {
        let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i;

        if (!Reg.test(text)) return m.reply(`Format salah! Gunakan format berikut:\n*${usedPrefix}daftar nama.umur*\nContoh: *${usedPrefix}daftar Agus.20*`);
        let [_, name, splitter, age] = text.match(Reg);

        if (!name) throw 'Nama tidak boleh kosong.';
        if (!age) throw 'Umur tidak boleh kosong.';
        age = parseInt(age);
        if (age > 99999) throw 'Umur terlalu besar!';
        if (age < 1) throw 'Umur terlalu kecil!';

        // Simpan data user
        user.name = name.trim();
        user.age = age;
        user.regTime = +new Date();
        user.registered = true;

        let sn = createHash('md5').update(m.sender).digest('hex');
        let cap = `
*I N F O R M A S I*

*Nama:* ${name}
*Umur:* ${age} Tahun
*Status:* _Berhasil_
*Nomor Serial:* ${sn}
`;
        await conn.sendMessage(m.chat, { text: cap, contextInfo: { "externalAdReply": { "title": "Pendaftaran Berhasil", "mediaType": 1, "thumbnailUrl": pp, "renderLargerThumbnail": true }}}, m);
    }

    // **Mode OTP**: Perintah `.otp nama`
    if (command === 'otp') {
        if (!text) return m.reply(`Gunakan format:\n*${usedPrefix}otp nama*\nContoh: *${usedPrefix}otp Agus*`);
        let name = text.trim();
        let otp = Math.floor(100 + Math.random() * 900).toString(); // OTP 3 digit
        otpStore[m.sender] = { otp, name }; // Simpan OTP dan nama sementara

        await conn.reply(m.chat, `Kode OTP Anda: *${otp}*\nGunakan perintah *${usedPrefix}konfir <kodeotp>* untuk memverifikasi pendaftaran.`, m);
    }

    // **Konfirmasi OTP**: Perintah `.konfir kodeotp`
    if (command === 'konfir') {
        if (!text) return m.reply(`Masukkan kode OTP yang dikirimkan.\nGunakan format:\n*${usedPrefix}konfir <kodeotp>*`);
        let otp = text.trim();
        let data = otpStore[m.sender];

        if (!data || data.otp !== otp) {
            return m.reply('Kode OTP salah atau sudah kadaluarsa.');
        }

        // Daftarkan user
        user.name = data.name;
        user.age = Math.floor(Math.random() * (40 - 18 + 1)) + 18; // Umur random antara 18-40
        user.regTime = +new Date();
        user.registered = true;
        delete otpStore[m.sender]; // Hapus data OTP setelah verifikasi

        let sn = createHash('md5').update(m.sender).digest('hex');
        let cap = `
*I N F O R M A S I*

*Nama:* ${user.name}
*Umur:* ${user.age} Tahun
*Status:* _Berhasil_
*Nomor Serial:* ${sn}
`;
        await conn.sendMessage(m.chat, { text: cap, contextInfo: { "externalAdReply": { "title": "Pendaftaran Berhasil", "mediaType": 1, "thumbnailUrl": pp, "renderLargerThumbnail": true }}}, m);
    }
};

handler.help = ['daftar', 'otp', 'konfir'];
handler.tags = ['main'];

handler.command = /^(daftar|register|reg)$/i;

export default handler;