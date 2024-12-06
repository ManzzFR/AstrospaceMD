const items = [
    'money', 'bank', 'potion', 'trash', 'wood',
    'rock', 'string', 'petFood', 'emerald',
    'diamond', 'gold', 'iron', 'common',
    'uncommon', 'mythic', 'legendary', 'pet', 'chip', 
    'anggur', 'apel', 'jeruk', 'mangga', 'pisang', 
    'bibitanggur', 'bibitapel', 'bibitjeruk', 'bibitmangga',
]

let lastGiveaway = {}

let handler = async (m, { conn, usedPrefix, command, args, groupMetadata }) => {
    let type = (args[0] || '').toLowerCase()
    let count = Math.min(200000, Math.max(1, (isNumber(args[1]) ? parseInt(args[1]) : 1))) * 1 // Batas maksimum item giveaway adalah 200.000
    let user = global.db.data.users

    if (!args[0]) return m.reply('Masukan nama item yang ingin di giveaway')
    if (!args[1]) return m.reply('Masukan jumlah item yang ingin di giveaway')
    if (!items.includes(type)) return m.reply(`List Item Yang Bisa Di Giveaway : \n${items.map(v => { return `${global.rpg.emoticon(v)} ${v}` }).join('\n')}`)
    if (user[m.sender][type] * 1 < count) return m.reply(`Mohon Maaf ${type} ${global.rpg.emoticon(type)} Tidak Cukup, Kamu hanya memiliki ${user[m.sender][type]} ${type} ${global.rpg.emoticon(type)} !`)

    let cooldown = lastGiveaway[m.sender] || 0
    if (new Date() - cooldown < 120000) return m.reply(`Mohon tunggu ${(120000 - (new Date() - cooldown)) / 1000} detik sebelum melakukan giveaway lagi`)

    let random = groupMetadata.participants.map(v => v.id)
    let winner = random.getRandom()

    await m.reply('Sedang Mencari Pemenang...')
    await delay(10000)

    if (typeof user[winner] === 'undefined' || user[winner] === m.sender || user[winner] === conn.user.jid) {
        let random2 = groupMetadata.participants.map(v => v.id)
        let winner2 = random2.getRandom()

        await m.reply('Pemenang Tidak Valid, Mencari Ulang...')
        await delay(10000)

        if (typeof user[winner2] === 'undefined' || user[winner2] === m.sender || user[winner2] === conn.user.jid) {
            let random3 = groupMetadata.participants.map(v => v.id)
            let winner3 = random2.getRandom()

            await m.reply('Pemenang Tidak Valid, Mencari Ulang...')
            await delay(10000)

            
            await m.reply(`Selamat Kepada @${winner3.split('@')[0]} Telah Mendapatkan ${count} ${type} ${global.rpg.emoticon(type)}`, false, { mentions: [winner3] }).then(() => {
                user[m.sender][type] -= count
                user[winner3][type] += count
            })
        } else {
            await m.reply(`Selamat Kepada @${winner2.split('@')[0]} Telah Mendapatkan ${count} ${type} ${global.rpg.emoticon(type)}`, false, { mentions: [winner2] }).then(() => {
                user[m.sender][type] -= count
                user[winner2][type] += count
            })
        }

    } else {
        await m.reply(`Selamat Kepada @${winner.split('@')[0]} Telah Mendapatkan ${count} ${type} ${global.rpg.emoticon(type)}`, false, { mentions: [winner] }).then(() => {
            user[m.sender][type] -= count
            user[winner][type] += count
        })
    }
    lastGiveaway[m.sender] = new Date()
}
handler.help = ['giveaway']
handler.tags = ['rpg']
handler.command = /^(giveaway|give)$/i
handler.group = true

export default handler

// New Line
function isNumber(x) {
    return !isNaN(x)
}

const delay = time => new Promise(res => setTimeout(res, time))