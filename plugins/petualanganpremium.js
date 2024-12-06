let petualanganPremiumHandler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    
    // Mengecek apakah pengguna sudah melakukan petualangan
    if (user.petualanganPremiumCooldown && user.petualanganPremiumCooldown > Date.now()) {
        let remainingTime = user.petualanganPremiumCooldown - Date.now();
        return conn.reply(m.chat, `⏳ Kamu sudah melakukan petualangan premium. Tunggu ${formatTime(remainingTime)} lagi sebelum bisa petualangan lagi.`, m);
    }

    // Menetapkan cooldown 24 jam untuk petualangan
    user.petualanganPremiumCooldown = Date.now() + 86400000; // 24 jam dari sekarang
    
    // Hadiah
    let expReward = 50000;
    let spaghettiReward = 500;
    let ratatouilleReward = 79;
    let burgerReward = 400;

    // Menambahkan hadiah ke pengguna
    user.exp += expReward;
    user.spaghetti = (user.spaghetti || 0) + spaghettiReward;
    user.ratatouille = (user.ratatouille || 0) + ratatouilleReward;
    user.burger = (user.burger || 0) + burgerReward;

    // Mengirim pesan hasil petualangan
    let message = `✨ *Petualangan Premium Selesai* ✨\n\nKamu telah berhasil menyelesaikan petualangan premium dan mendapatkan hadiah berikut:\n\n` +
                  `💥 EXP: +${expReward}\n🍝 Spaghetti: +${spaghettiReward}\n🍽️ Ratatouille: +${ratatouilleReward}\n🍔 Burger: +${burgerReward}\n\n` +
                  `Jangan lupa untuk melanjutkan petualangan lainnya besok!`;

    await conn.reply(m.chat, message, m);
};

petualanganPremiumHandler.help = ['petualanganpremium'];
petualanganPremiumHandler.tags = ['game'];
petualanganPremiumHandler.command = /^petualanganpremium$/i;

export default petualanganPremiumHandler;

// Fungsi format waktu untuk cooldown
function formatTime(ms) {
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours} jam ${minutes} menit ${seconds} detik`;
}