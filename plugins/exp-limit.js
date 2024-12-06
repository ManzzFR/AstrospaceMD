let handler = async (m, { conn, command }) => {
    let who = m.isGroup ? (m.mentionedJid[0] ? m.mentionedJid[0] : m.sender) : m.sender
    let user = global.db.data.users[who]
    if (!user) throw 'Pengguna tidak ada di dalam database'

    const caption = `
*📊 User Statuses*

👤 ◦ *Name* : ${user.registered ? user.name : conn.getName(who)}
💎 ◦ *Status* : ${who.split`@`[0] == info.nomorown ? 'Developer' : user.premiumTime > 0 ? 'Premium User' : user.level >= 1000 ? 'Elite User' : 'Free User'}
💪 ◦ *Levels* : ${user.level}
💰 ◦ *Money* : ${user.money.toLocaleString('id-ID')} 💵
💎 ◦ *Diamonds* : ${user.diamond.toLocaleString('id-ID')} 💎
⚔️ ◦ *Experience* : ${user.exp.toLocaleString('id-ID')} XP
📊 ◦ *Limits* : ${user.premiumTime > 0 ? 'Unlimited' : user.limit.toLocaleString('id-ID')} / ${user.maxLimit || 1000}
    `.trim()

    await conn.sendMessage(m.chat, {
        text: caption,
        contextInfo: {
            externalAdReply: {
                title: 'S T A T U S !',
                body: 'Statistics your account',
                thumbnailUrl: 'https://files.catbox.moe/891emw.png', // URL gambar sebagai thumbnail
                sourceUrl: 'https://github.com/ManzzFR' // Link yang ingin ditampilkan, bisa diubah atau dihapus
            }
        }
    })
}

handler.help = ['limit']
handler.tags = ['xp']
handler.command = /^(status|limit)$/i

export default handler