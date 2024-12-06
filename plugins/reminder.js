const handler = async (m, { args }) => {
  if (args.length < 2) {
    return m.reply('Format: .remind [waktu (menit)] [pesan]');
  }

  const time = parseInt(args[0]);
  const reminder = args.slice(1).join(' ');

  if (isNaN(time)) {
    return m.reply('Masukkan waktu dalam menit yang valid!');
  }

  setTimeout(() => {
    m.reply(`Reminder: ${reminder}`);
  }, time * 60 * 1000);

  m.reply(`Pengingat set untuk ${time} menit dari sekarang.`);
};

handler.help = ['remind'];
handler.tags = ['utility'];
handler.command = /^(reminder|remind)$/i;
handler.register = false;

export default handler;