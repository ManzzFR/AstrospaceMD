const otpGenerator = require('otp-generator'); // Untuk membuat OTP
const db = global.db.data.users; // Data pengguna disimpan di sini

let handler = async (m, { conn, args }) => {
    let sender = m.sender;

    // Memastikan input cukup
    if (args.length < 2) {
        return conn.reply(m.chat, 'Masukkan nomor lama dan nomor baru.\nContoh: .migrate 6281234567890 6289876543210', m);
    }

    let oldNumber = args[0]; // Nomor lama
    let newNumber = args[1]; // Nomor baru

    // Periksa apakah nomor lama ada di database
    if (!db[oldNumber]) {
        return conn.reply(m.chat, `Nomor lama ${oldNumber} tidak ditemukan dalam database.`, m);
    }

    // Periksa apakah nomor baru sudah terdaftar
    if (db[newNumber]) {
        return conn.reply(m.chat, `Nomor baru ${newNumber} sudah terdaftar. Gunakan nomor lain.`, m);
    }

    // Hasilkan OTP
    let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    // Simpan OTP dan nomor baru ke data sementara
    db[oldNumber].otp = otp; // Simpan OTP ke akun lama
    db[oldNumber].newNumber = newNumber; // Simpan nomor baru untuk verifikasi

    // Kirim OTP ke nomor baru
    conn.reply(newNumber + '@s.whatsapp.net', `Kode OTP Anda untuk memindahkan akun adalah: ${otp}\nJangan bagikan kode ini kepada siapa pun.`, null);

    conn.reply(m.chat, `Kode OTP telah dikirim ke nomor ${newNumber}. Masukkan OTP dengan perintah:\n.verify [OTP]`, m);
};

handler.command = /^(migrate)$/i; // Perintah untuk memulai migrasi

// Handler untuk verifikasi OTP
let verifyHandler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = Object.values(db).find(u => u.otp === args[0]); // Cari pengguna berdasarkan OTP

    if (!user) {
        return conn.reply(m.chat, 'Kode OTP salah atau sudah kadaluarsa.', m);
    }

    // Pindahkan data ke nomor baru
    let newNumber = user.newNumber;
    db[newNumber] = { ...user }; // Salin data ke nomor baru
    delete db[user.phoneNumber]; // Hapus data di nomor lama
    db[newNumber].phoneNumber = newNumber; // Perbarui nomor di data baru
    db[newNumber].otp = null; // Hapus OTP setelah verifikasi
    db[newNumber].newNumber = null; // Hapus data nomor baru

    conn.reply(m.chat, `Akun berhasil dipindahkan ke nomor ${newNumber}.`, m);
};

verifyHandler.command = /^(verify)$/i; // Perintah untuk verifikasi OTP

export default [handler, verifyHandler];