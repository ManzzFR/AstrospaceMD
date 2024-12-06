const otpGenerator = require('otp-generator'); // Untuk membuat OTP
const db = global.db.data.users; // Data pengguna disimpan di sini

// Handler untuk memulai proses migrasi akun
let handler = async (m, { conn, args, command }) => {
    let sender = m.sender;

    if (command === 'migrate') {
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

        conn.reply(m.chat, `Kode OTP telah dikirim ke nomor ${newNumber}. Masukkan OTP dengan perintah:\n.konfirmasi <OTP>`, m);
    }

    if (command === 'konfirmasi') {
        // Memastikan input cukup
        if (args.length < 1) {
            return conn.reply(m.chat, 'Masukkan kode OTP.\nContoh: .konfirmasi 123456', m);
        }

        let otp = args[0]; // OTP yang diberikan oleh user
        let user = Object.values(db).find(u => u.otp === otp); // Cari pengguna berdasarkan OTP

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

        conn.reply(m.chat, `✅ Akun berhasil dipindahkan ke nomor ${newNumber}.`, m);
    }
};

// Daftarkan perintah
handler.command = /^(migrate|konfirmasi)$/i;

export default handler;