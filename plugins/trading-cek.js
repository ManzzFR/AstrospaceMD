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

  // Mengecek apakah pengguna memiliki trading yang aktif
  if (!senderData.trading) {
    return conn.reply(m.chat, "Anda tidak sedang melakukan trading.", m);
  }

  // Mengecek jika waktu trading masih berjalan
  let remainingTime = senderData.trading.endTime - Date.now();
  if (remainingTime > 0) {
    let minutesLeft = Math.floor(remainingTime / 60000);
    let secondsLeft = Math.floor((remainingTime % 60000) / 1000);
    return conn.reply(m.chat, `Trading Anda masih berlangsung.\nDurasi tersisa: ${minutesLeft} menit ${secondsLeft} detik.`, m);
  }

  // Jika waktu trading sudah selesai, tampilkan hasilnya
  let profitLoss = senderData.trading.amount - senderData.trading.originalAmount;
  let resultMessage = `Trading selesai.\n`;
  resultMessage += `Jumlah awal trading: ${formatNumber(senderData.trading.originalAmount)} money.\n`;
  resultMessage += `Jumlah akhir trading: ${formatNumber(senderData.trading.amount)} money.\n`;

  if (profitLoss > 0) {
    resultMessage += `Keuntungan Anda: ${formatNumber(profitLoss)} money.`;
  } else if (profitLoss < 0) {
    resultMessage += `Kerugian Anda: ${formatNumber(-profitLoss)} money.`;
  } else {
    resultMessage += `Tidak ada perubahan dalam trading Anda.`;
  }

  // Hapus data trading setelah selesai
  senderData.trading = null;

  db.data.users[sender] = senderData;

  return conn.reply(m.chat, resultMessage, m);
};

// Menambahkan perintah .cektrading untuk mengecek status trading
handler.help = ['cektrading'];
handler.command = /^(cektrading)$/i;

export default handler;