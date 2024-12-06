import fetch from 'node-fetch'
global.nomerown = '19419318284'; // Masukkan nomor WhatsApp owner di sini
// Fungsi style untuk memformat teks
const style = (text, styleType = 1) => {
  const styles = [
    '𝒜𝒷𝒞𝒟𝒺𝒻𝒢𝒽𝒾𝒿𝒦𝒻𝑀𝒩𝒪𝒫𝒬ℝ𝒮𝒯𝒲𝒳𝒴𝒵0123456789', // Style 1
    '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗩𝗬𝗭0123456789', // Style 2
    '𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789', // Style 3
  ];
  let styleString = styles[styleType - 1] || styles[0]; // Default ke style 1
  let formattedText = text.split('').map(char => {
    const index = 'abcdefghijklmnopqrstuvwxyz0123456789'.indexOf(char.toLowerCase());
    return index !== -1 ? styleString.charAt(index) : char;
  }).join('');
  return formattedText;
};

let handler = async (m, { conn, usedPrefix, text, args, command }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let name = await conn.getName(who);

  // FAKE KONTAK
  const repPy = {
    key: {
      remoteJid: '0@s.whatsapp.net',
      fromMe: false,
      id: wm,
      participant: '0@s.whatsapp.net',
    },
    message: {
      requestPaymentMessage: {
        currencyCodeIso4217: "USD",
        amount1000: 999999999,
        requestFrom: '0@s.whatsapp.net',
        noteMessage: {
          extendedTextMessage: {
            text: 'N E X O R A - E M D E',
          },
        },
        expiryTimestamp: 999999999,
        amount: {
          value: 91929291929,
          offset: 1000,
          currencyCode: "INR",
        },
      },
    },
  };

  const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(global.nomerown + '@s.whatsapp.net')}\nFN:${await conn.getName(global.nomerown + '@s.whatsapp.net')}\nitem1.TEL;waid=${global.nomerown}:${global.nomerown}\nitem1.X-ABLabel:WhatsApp\nitem2.EMAIL;type=INTERNET: ferdiix01dbinary@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://github.com/ManzzFR\nitem3.X-ABLabel:Github\nitem4.ADR:;; United States;;;;\nitem4.X-ABLabel:Region\nitem5.X-ABLabel:skill issue\nEND:VCARD`;

  const msg = await conn.sendMessage(m.chat, {
    contacts: {
      displayName: global.nameown,
      contacts: [{ vcard }],
    },
    contextInfo: {
      externalAdReply: {
        title: await style(command, 1),
        body: await style('OWNER BOT', 1),
        thumbnail: await conn.resize('https://files.catbox.moe/i3s440.jpg', 300, 180),
        sourceUrl: `https://github.com/ManzzFR`,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  }, { quoted: repPy });

  await conn.reply(m.chat, `tuh bg ${name} nomor owner gw.`, msg);
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = /^(owner|creator)/i;
export default handler;