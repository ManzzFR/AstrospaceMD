import fs from "fs";

let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0]
    : m.fromMe
    ? conn.user.jid
    : m.sender;

  if (!(who in global.db.data.users)) {
    return m.reply(`User ${who} not in database`);
  }

  let user = global.db.data.users[who];
  const caption = `
*U S E R - B A N K*

∘ *Username:* 
∘ *Bank:* ${formatNumber(user.bank)}
∘ *Money:* ${formatNumber(user.money)}
∘ *Chip:* ${formatNumber(user.chip)}

∘ *Robo Protection:* ${user.robo > 0 ? 'Level ' + user.robo : '✖️'}
∘ *User Status:*

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

*E - W A L L E T*

∘ *Dana:* *${formatNumber(user.dana)}*
∘ *Gopay:* *${formatNumber(user.gopay)}*
∘ *Ovo:* *${formatNumber(user.ovo)}*
∘ *Paypal:* *${formatNumber(user.paypal)}*
∘ *ShopeePay:* * ${formatNumber(user.shopeepay)}*

*Status Registration:* ${user.registered ? 'Aktif' : 'Belum Aktif'}
`.trim();

  await conn.adReply(
    m.chat,
    caption,
    '',
    '',
    fs.readFileSync('./media/bank.jpg'),
    '',
    m
  );
};

handler.help = ['bank'];
handler.tags = ['rpg'];
handler.command = /^bank$/i;

handler.register = true;
handler.group = true;
handler.rpg = true;

export default handler;

// Helper Function: Format Number
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}