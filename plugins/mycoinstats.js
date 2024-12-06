let handler = async (m, { conn }) => {
    let sender = m.sender;
    let user = global.db.data.users[sender];

    // Pastikan pengguna memiliki data investasi
    if (!user.investments || Object.keys(user.investments).length === 0) {
        return conn.reply(m.chat, 'Anda belum melakukan investasi apapun.', m);
    }

    // Menyusun rincian total investasi
    let totalInvested = 0;  // Total investasi awal
    let totalCurrentValue = 0;  // Total nilai sekarang
    let totalProfit = 0;  // Total profit

    let text = '🎉 *Market Bot Alecia On 24 Jam* 🎉\n\n';
    text += `👤 *Investor:* ${sender}\n\n`;

    // Menyusun rincian investasi tiap crypto
    let investmentsDetails = [];
    for (let cryptoName in user.investments) {
        let investment = user.investments[cryptoName];
        let currentValue = investment.amount * (cryptoPrices[cryptoName] || 0);  // Harga crypto saat ini
        let profit = currentValue - investment.total;
        let profitPercentage = ((profit / investment.total) * 100).toFixed(2);

        // Update total investasi, nilai sekarang, dan profit
        totalInvested += investment.total;
        totalCurrentValue += currentValue;
        totalProfit += profit;

        investmentsDetails.push({
            cryptoName,
            investment,
            currentValue,
            profit,
            profitPercentage,
        });
    }

    // Menampilkan total investasi dan total profit
    let totalProfitPercentage = ((totalProfit / totalInvested) * 100).toFixed(2);

    text += `💰 *Total Investasi:* ${totalInvested.toLocaleString()} money\n`;
    text += `💵 *Total Investasi Sekarang:* ${totalCurrentValue.toLocaleString()} money\n`;
    text += `📈 *Total Profit:* ${totalProfit.toLocaleString()} money (${totalProfitPercentage}%)\n\n`;

    text += '🔍 *Rincian Investasi:* \n\n';

    // Menampilkan rincian tiap investasi
    investmentsDetails.forEach((item, index) => {
        text += `${index + 1}️⃣ *${item.cryptoName.toUpperCase()}*\n`;
        text += `📊 *Avarage:* ${item.investment.total.toLocaleString()}\n`;
        text += `💲 *Harga:* ${(cryptoPrices[item.cryptoName] || 0).toLocaleString()}\n`;
        text += `📦 *Stock:* ${item.investment.amount.toLocaleString()}\n`;
        text += `💸 *Investasi:* ${item.investment.total.toLocaleString()} money\n`;
        text += `💵 *Investasi Sekarang:* ${item.currentValue.toLocaleString()} money\n`;
        text += `📈 *Profit:* ${item.profit.toLocaleString()} money (${item.profitPercentage}%)\n\n`;
    });

    // Kirimkan pesan rincian investasi
    return conn.reply(m.chat, text, m);
};

handler.help = ['mycoinstats'];
handler.tags = ['rpg'];
handler.command = /^(mycoinstats)$/i;

export default handler;