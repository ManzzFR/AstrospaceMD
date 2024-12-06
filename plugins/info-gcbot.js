import fetch from 'node-fetch'
let handler = async (m, { conn, usedPrefix, command }) => {
	try {
   let maximus = `
-= *GROUP BOT WHATSAPP* =-

https://chat.whatsapp.com/Gtcectx7SUcAy21Rk4s851`
		await conn.sendMessage(m.chat, {
                text: maximus,
                contextInfo: {
                    externalAdReply: {
                        title: "Astrospace Group Chat",
                        body: "",
                        thumbnailUrl: "https://files.catbox.moe/k9k2qa.jpg",
                        sourceUrl: "https://chat.whatsapp.com/Gtcectx7SUcAy21Rk4s851",
                        mediaType: 1,
                        showAdAttribution: true,
                        renderLargerThumbnail: true
                    }
                }
            }, {quoted: m})
	} catch (e) {
		console.log(e)
		throw `Fitur Error.`
	}
}

handler.help = ['gcbot']
handler.tags = ['info']
handler.command = /^(gcbot)$/i

handler.register = false
handler.premium = false
handler.limit = false

export default handler