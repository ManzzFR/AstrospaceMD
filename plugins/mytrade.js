// Fungsi untuk memformat angka dengan pemisah ribuan
function formatNumber(number) {
  return number.toLocaleString('id-ID');
}

let handler = async (m, { conn }) => {
  let sender = m.sender;

  // Memastikan data pengguna sudah ada di database (db.data.users)
  if (!db.data.users[sender]) {
    return conn.reply(m.chat, "Data pengguna tidak ditemukan. Coba lagi.", m);
  }

  let senderData = db.data.users[sender];

  // Mengambil informasi statistik trading
  let tradingToday = senderData.tradingToday || 0;
  let tradingTotal = senderData.tradingTotal || 0;
  let totalTrades = senderData.totalTrades || 0;
  let totalLoss = senderData.totalLoss || 0;
  let totalWins = senderData.totalWins || 0;
  let saldoTrading = senderData.money || 0;

  // Menghitung tingkat kemenangan dalam persentase
  let winRate = totalTrades > 0 ? ((totalWins / totalTrades) * 100).toFixed(2) : 0;

  // Menyusun pesan informasi statistik trading
  let statMessage = `📊 *Informasi Trading Anda* 📊\n\n`;
  statMessage += `*Nama User:* ${m.name || 'User'}\n`;
  statMessage += `*Saldo:* ${formatNumber(saldoTrading)} money\n`;
  statMessage += `*Jumlah Trading Hari Ini:* ${formatNumber(tradingToday)} money\n`;
  statMessage += `*Jumlah Trading Total:* ${formatNumber(tradingTotal)} money\n`;
  statMessage += `*Kerugian Total:* ${formatNumber(totalLoss)} money\n`;
  statMessage += `*Jumlah Total Trading:* ${totalTrades} kali\n`;
  statMessage += `*Tingkat Kemenangan:* ${winRate}%\n`;

  conn.reply(m.chat, statMessage, m);
};

// Menambahkan perintah .statstrading untuk melihat statistik trading
handler.help = ['statstrading'];
handler.command = /^(statstrading|mytrade|tstats)$/i;

export default handler;