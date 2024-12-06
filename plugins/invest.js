let handler = async (m, { conn, args }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    // Pastikan ada dua argumen yang diberikan (nama cryptocurrency dan jumlah investasi)
    if (args.length < 2) {
        return conn.reply(m.chat, 'Silakan masukkan nama cryptocurrency dan jumlah investasi.\nContoh: `.invest raze 10000`', m);
    }

    // Cek apakah args[0] adalah nama cryptocurrency yang valid
    let cryptoName = args[0].toLowerCase();
    let amount = parseFloat(args[1]);

    // Validasi jumlah investasi
    if (amount <= 0 || isNaN(amount)) {
        return conn.reply(m.chat, 'Jumlah investasi harus lebih besar dari 0 dan valid.\nContoh: `.invest raze 10000`', m);
    }

    // Pastikan cryptocurrency valid
    let validCryptos = ['grow', 'raze', 'fate', 'myth', 'blaze', 'hybr'];
    if (!validCryptos.includes(cryptoName)) {
        return conn.reply(m.chat, 'Cryptocurrency tidak valid. Pilih dari: ' + validCryptos.join(', '), m);
    }

    // Harga cryptocurrency
    const cryptoPrices = {
        'grow': 1000000,    // harga per unit grow
        'raze': 2000000,    // harga per unit raze
        'fate': 15000000,    // harga per unit fate
        'myth': 25000000,    // harga per unit myth
        'blaze': 3000000,   // harga per unit blaze
        'hybr': 350000000000     // harga per unit hybr
    };
    
    let cryptoPrice = cryptoPrices[cryptoName];
    let totalCost = cryptoPrice * amount;

    // Cek saldo pengguna
    if (user.money < totalCost) {
        return conn.reply(m.chat, 'Saldo Anda tidak mencukupi untuk melakukan investasi.', m);
    }

    // Deduct money from user balance
    user.money -= totalCost;

    // Update investasi pengguna
    user[cryptoName] = user[cryptoName] || 0;  // Jika belum ada, buat properti investasi
    user[cryptoName] += amount;  // Tambahkan jumlah yang diinvestasikan ke saldo crypto pengguna

    // Kirimkan konfirmasi kepada pengguna
    return conn.reply(m.chat, `🎉 *Pembelian ${amount} ${cryptoName.toUpperCase()} berhasil!*\nTotal biaya: ${totalCost.toLocaleString()} money\nSaldo Anda saat ini: ${user.money.toLocaleString()} money.\n\n*Investment Management*

untuk melakukan investasi ketik:
.invest namacrypto jumlah

untuk melihat statistik ketik:
.mycoin

untuk menarik profit cryptoInvest ketik:
.cashout namacrypto

_Catatan:_
tarik profit saat saldo profit banyak, untuk mendapatkan hasil investasi yang berlipat ganda`, m);
};

handler.help = ['invest'];
handler.tags = ['rpg'];
handler.command = /^(invest)$/i;

export default handler;