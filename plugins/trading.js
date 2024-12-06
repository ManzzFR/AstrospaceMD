// Fungsi untuk memformat angka dengan pemisah ribuan
function formatNumber(number) {
  return number.toLocaleString('id-ID');
}

let handler = async (m, { conn, text }) => {
  let sender = m.sender;

  // Memastikan data pengguna sudah ada di database (db.data.users)
  if (!db.data.users[sender]) {
    return conn.reply(m.chat, "Data pengguna tidak ditemukan. Coba lagi.", m);
  }

  let senderData = db.data.users[sender];

  // Mengecek apakah pengguna sudah memiliki trading yang sedang berlangsung
  if (senderData.trading) {
    return conn.reply(m.chat, "Anda sudah memiliki trading yang sedang berlangsung.", m);
  }

  // Parsing input: apakah input sesuai format .trading [jumlah] [durasi]
  let args = text.split(' ');
  let amount = parseInt(args[0]); // jumlah money untuk trading
  let duration = args[1]; // durasi trading dalam format seperti 5m (5 menit)
  
  if (isNaN(amount)) {
    return conn.reply(m.chat, "Jumlah money tidak valid.", m);
  }

  if (!duration || !duration.match(/^\d+[mhs]$/)) {
    return conn.reply(m.chat, "Format durasi tidak valid. Contoh: 5m, 1h, 30s.", m);
  }

  // Memeriksa apakah pengguna memiliki money yang cukup
  if (senderData.money < amount) {
    return conn.reply(m.chat, `Money Anda tidak cukup. Anda memerlukan ${formatNumber(amount)} money untuk melakukan trading.`, m);
  }

  // Memotong money pengguna untuk trading
  senderData.money -= amount;

  // Menghitung waktu akhir trading berdasarkan durasi yang diberikan
  let timeUnit = duration.slice(-1); // 'm', 'h', atau 's'
  let timeValue = parseInt(duration.slice(0, -1));
  let endTime;

  if (timeUnit === 'm') {
    endTime = Date.now() + timeValue * 60000; // menit ke milidetik
  } else if (timeUnit === 'h') {
    endTime = Date.now() + timeValue * 3600000; // jam ke milidetik
  } else if (timeUnit === 's') {
    endTime = Date.now() + timeValue * 1000; // detik ke milidetik
  }

  // Menyimpan data trading di db
  senderData.trading = {
    originalAmount: amount,
    amount: amount,
    endTime: endTime
  };

  db.data.users[sender] = senderData;

  // Memberikan konfirmasi bahwa trading telah dimulai
  conn.reply(m.chat, `Trading dimulai! Anda telah trading ${formatNumber(amount)} money.\nDurasi: ${duration}.`, m);

  // Fungsi untuk memproses hasil trading setelah durasi selesai
  setTimeout(async () => {
    let randomFactor = Math.random() * 0.2 - 0.1; // Faktor acak antara -10% hingga +10%
    let resultAmount = Math.round(senderData.trading.amount * (1 + randomFactor)); // Mengubah jumlah money sesuai faktor acak

    // Jika hasil trading berkurang, pastikan tidak menjadi negatif
    resultAmount = Math.max(resultAmount, 0);

    // Menghitung profit atau kerugian
    let profitLoss = resultAmount - senderData.trading.originalAmount;

    // Update statistik trading
    senderData.tradingTotal = (senderData.tradingTotal || 0) + resultAmount;
    senderData.tradingToday = (senderData.tradingToday || 0) + resultAmount;
    senderData.totalTrades = (senderData.totalTrades || 0) + 1;
    if (profitLoss > 0) {
      senderData.totalWins = (senderData.totalWins || 0) + 1;
    } else {
      senderData.totalLoss = (senderData.totalLoss || 0) + Math.abs(profitLoss);
    }

    // Pesan hasil trading
    let resultMessage = `Trading selesai!\n`;
    resultMessage += `Jumlah awal trading: ${formatNumber(senderData.trading.originalAmount)} money.\n`;
    resultMessage += `Jumlah akhir trading: ${formatNumber(resultAmount)} money.\n`;

    if (profitLoss > 0) {
      resultMessage += `Keuntungan Anda: ${formatNumber(profitLoss)} money.`;
    } else if (profitLoss < 0) {
      resultMessage += `Kerugian Anda: ${formatNumber(-profitLoss)} money.`;
    } else {
      resultMessage += `Tidak ada perubahan dalam trading Anda.`;
    }

    // Menambahkan hasil trading ke saldo trading
    senderData.tradingBalance = (senderData.tradingBalance || 0) + resultAmount;

    // Hapus data trading setelah selesai
    senderData.trading = null;

    db.data.users[sender] = senderData;

    // Kirim pesan hasil trading kepada pengguna
    conn.reply(m.chat, resultMessage, m);
  }, endTime - Date.now());
};

// Menambahkan perintah .trading untuk memulai trading
handler.help = ['trading'];
handler.command = /^(trading)$/i;

export default handler;