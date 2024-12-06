let cooldowns = {}; // Objek untuk menyimpan cooldown per pengguna

let handler = async (m, { conn }) => {
    let sender = m.sender;
    let now = new Date().getTime();

    // Cek apakah pengguna sudah dalam cooldown
    if (cooldowns[sender] && now - cooldowns[sender] < 5 * 60 * 1000) {
        let timeLeft = (5 * 60 * 1000 - (now - cooldowns[sender])) / 1000; // Hitung sisa waktu cooldown dalam detik
        return conn.reply(m.chat, `Anda masih dalam cooldown. Cobalah lagi setelah ${Math.ceil(timeLeft / 60)} menit.`, m);
    }

    // Update waktu cooldown
    cooldowns[sender] = now;

    // Hadiah yang tersedia
    let rewards = {
        diamond: 5000,
        gold: 3000,
        mythic: 4000,
        legendary: 4500
    };

    // Menentukan hadiah secara acak
    let rewardType = ['diamond', 'gold', 'mythic', 'legendary'];
    let reward = rewardType[Math.floor(Math.random() * rewardType.length)];
    let amount = rewards[reward];

    // Mengakses data pengguna dari global.db
    let user = global.db.data.users[sender];

    // Jika pengguna belum memiliki properti untuk hadiah ini, set default 0
    if (!user[reward]) user[reward] = 0;

    // Menambahkan hadiah ke pengguna
    user[reward] += amount; // Tambah hadiah ke jumlah yang dimiliki

    // Kirim pesan kepada pengguna
    return conn.reply(m.chat, `🎉 *Selamat!* Anda berhasil menyelesaikan misi penyelamatan di desa!\nHadiah Anda: ${amount} ${reward.charAt(0).toUpperCase() + reward.slice(1)}\nTotal ${reward.charAt(0).toUpperCase() + reward.slice(1)} Anda sekarang: ${user[reward].toLocaleString()}`, m);
};

handler.help = ['rescue'];
handler.tags = ['game'];
handler.command = /^rescue$/i;

export default handler;