let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    // Pastikan ada dua argumen yang diberikan (nama cryptocurrency dan jumlah penarikan)
    if (args.length < 2) {
        return conn.reply(m.chat, 'Silakan masukkan nama cryptocurrency dan jumlah yang ingin ditarik.\nContoh: `.cashout raze 100000`', m);
    }

    // Cek apakah args[0] adalah nama cryptocurrency yang valid
    let cryptoName = args[0].toLowerCase();

    // Validasi cryptocurrency
    let validCryptos = ['grow', 'raze', 'fate', 'myth', 'blaze', 'hybr'];
    if (!validCryptos.includes(cryptoName)) {
        return conn.reply(m.chat, 'Cryptocurrency tidak valid. Pilih dari: ' + validCryptos.join(', '), m);
    }

    // Cek apakah user memiliki investasi pada crypto tersebut
    if (!user[cryptoName] || user[cryptoName] <= 0) {
        return conn.reply(m.chat, `Anda tidak memiliki investasi di ${cryptoName.toUpperCase()}.`, m);
    }

    // Harga cryptocurrency sekarang
    const cryptoPrices = {
        'grow': 12000000,    // harga per unit grow
        'raze': 25000000,    // harga per unit raze
        'fate': 180000000,   // harga per unit fate
        'myth': 3000000,     // harga per unit myth
        'blaze': 35000000,   // harga per unit blaze
        'hybr': 400000000    // harga per unit hybr
    };

    let cryptoPrice = cryptoPrices[cryptoName];
    let totalInvestment = user[cryptoName] * cryptoPrice;  // Total nilai investasi saat ini
    let originalInvestment = user[cryptoName] * 100;  // Misalnya, harga awal adalah 100 untuk setiap cryptocurrency
    let profit = totalInvestment - originalInvestment;

    // Mengambil jumlah yang ingin ditarik
    let withdrawalAmount = parseFloat(args[1]);

    // Pastikan jumlah yang ditarik tidak lebih dari profit yang tersedia
    if (withdrawalAmount > profit) {
        return conn.reply(m.chat, `Jumlah yang ingin ditarik melebihi profit yang tersedia. Profit yang dapat ditarik: ${profit.toLocaleString()} money`, m);
    }

    // Jika ada profit
    if (profit > 0) {
        user.money += withdrawalAmount;  // Menambahkan jumlah yang ditarik ke saldo pengguna
        user[cryptoName] = 0;  // Investasi crypto ini sudah ditarik, jadi set menjadi 0

        return conn.reply(m.chat, `🎉 *Penarikan Profit ${cryptoName.toUpperCase()} berhasil!*\nJumlah yang ditarik: ${withdrawalAmount.toLocaleString()} money\nSaldo Anda sekarang: ${user.money.toLocaleString()} money`, m);
    } else {
        return conn.reply(m.chat, `Anda tidak memiliki profit yang dapat ditarik di ${cryptoName.toUpperCase()}.`, m);
    }
};

handler.help = ['cashout'];
handler.tags = ['rpg'];
handler.command = /^(cashout)$/i;

export default handler;