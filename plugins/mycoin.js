let handler = async (m, { conn }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    // Pastikan pengguna memiliki investasi
    let validCryptos = ['grow', 'raze', 'fate', 'myth', 'blaze', 'hybr'];
    let totalInvestment = 0;
    let totalCurrentValue = 0;
    let totalProfit = 0;
    let text = `🎉 *Information Investment*\n`;
    text += `👤 *Investor:* ${sender.split('@')[0]}\n\n`;

    // Harga cryptocurrency yang bisa berubah
    let cryptoPrices = {
        'grow': Math.floor(Math.random() * 100 + 100),  // Contoh harga acak
        'raze': Math.floor(Math.random() * 200 + 200),
        'fate': Math.floor(Math.random() * 150 + 150),
        'myth': Math.floor(Math.random() * 250 + 250),
        'blaze': Math.floor(Math.random() * 300 + 300),
        'hybr': Math.floor(Math.random() * 350 + 350)
    };

    // Cek total investasi dan total profit
    for (let crypto of validCryptos) {
        let amount = user[crypto] || 0;
        if (amount > 0) {
            // Mengambil harga cryptocurrency saat ini
            let currentPrice = cryptoPrices[crypto];

            // Total Investasi dan Profit
            let totalInvested = amount * 100; // Misalkan harga awal adalah 100 untuk setiap cryptocurrency
            let currentValue = amount * currentPrice;
            let profit = currentValue - totalInvested;
            let profitPercentage = ((profit / totalInvested) * 100).toFixed(2);

            totalInvestment += totalInvested;
            totalCurrentValue += currentValue;
            totalProfit += profit;

            text += `🔍 *Investment Details ${crypto.toUpperCase()}:*\n`;
            text += `📊 *Current price:* ${currentPrice.toLocaleString()} money\n`;
            text += `📦 *Stock:* ${amount.toLocaleString()}\n`;
            text += `💸 *Investasi:* ${totalInvested.toLocaleString()} money\n`;
            text += `💵 *Invest now:* ${currentValue.toLocaleString()} money\n`;
            text += `📈 *Profit:* ${profit.toLocaleString()} money (${profitPercentage}%)\n\n`;
        }
    }

    // Menampilkan statistik total
    let totalProfitPercentage = ((totalProfit / totalInvestment) * 100).toFixed(2);
    text += `💰 *Total Investasi:* ${totalInvestment.toLocaleString()} money\n`;
    text += `💵 *Total Investasi Sekarang:* ${totalCurrentValue.toLocaleString()} money\n`;
    text += `📈 *Total Profit:* ${totalProfit.toLocaleString()} money (${totalProfitPercentage}%)\n`;

    // Mengirim hasil statistik investasi dengan externalAdReply
    await conn.sendMessage(m.chat, {
        text: text,
        contextInfo: {
            externalAdReply: {
                title: 'Crypto Market Info',
                body: 'Check out your investment!',
                thumbnailUrl: 'https://pomf2.lain.la/f/oz6quv3.jpg', // Ganti dengan thumbnail yang sesuai (ikon kripto)
                sourceUrl: 'https://github.com/ManzzFR' // Link yang ingin ditampilkan
            }
        }
    });
};

handler.help = ['mycoin'];
handler.tags = ['rpg'];
handler.command = /^(mycoin)$/i;

export default handler;