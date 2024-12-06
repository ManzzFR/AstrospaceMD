import fetch from "node-fetch"
const tfinventory = {
  others: {
    money: true,
  },
  tfitems: {
    potion: true,
    trash: true,
    wood: true,
    rock: true,
    string: true,
    emerald: true,
    diamond: true,
    gold: true,
    iron: true,
  },
  tfcrates: {
    common: true,
    uncommon: true,
    mythic: true,
    legendary: true,
  },
  tfpets: {
    horse: 10,
    cat: 10,
    fox: 10,
    dog: 10,
  }
}
const rewards = {
    common: {
        money: 101,
        trash: 11,
        potion: [0, 1, 0, 111, 0, 260, 0, 28, 0],
        common: [0, 1, 0, 1, 0, 62, 0, 720, 0, 200],
        uncommon: [0, 1, 10, 22, 828, 0, 0, 0, 290, 0, 0, 999]
    },
    uncommon: {
        money: 201,
        trash: 31,
        exp: 1101,
        potion: [0, 1, 0, 0, 0, 70, 0, 920],
        diamond: [0, 0, 0, 9, 20, 0, 0, 0, 0, 27, 1, 0, 0, 0, 0, 0, 90, 0, 20, 33, 0],
        common: [0, 1, 0, 20, 260, 0, 22, 0, 70],
        uncommon: [0, 1, 0, 0, 7, 0, 0, 0, 0, 80, 0],
        mythic: [0, 81, 0, 50, 82, 5, 50, 60, 0, 70, 0, 0, 8, 0],
        wood: [0, 1, 280, 260, 220, 220],
        rock: [0, 251, 0, 29, 0, 0],
        string: [0, 1, 0, 0, 0, 9]
    },
    mythic: {
        money: 99999,
        exp: 5000,
        trash: 8171,
        potion: [0, 1, 28, 10, 28, 111],
        emerald: [0, 1, 0, 0, 290, 82, 0, 20, 0, 0, 9, 0, 0],
        diamond: [0, 18, 110, 29, 1, 0, 92, 21, 20, 0, 0, 99],
        gold: [0, 1,22, 26, 29, 150, 1, 0, 20],
        iron: [0, 1, 0, 10, 10, 110, 10, 0],
        common: [0, 11, 0, 0, 20, 1],
        uncommon: [0, 1, 0, 0, 0, 0, 0, 2],
        mythic: [0, 1, 8, 0, 20, 0, 1, 0, 0, 0],
        legendary: [0, 1, 0, 0, 39, 1, 0, 0, 0, 0, 1, 20, 27],
        pet: [0, 1, 0, 150, 0, 0, 1, 27, 0, 20, 1],
        wood: [0, 1, 28, 0, 0],
        rock: [29, 55, 0, 60, 8],
        string: [25, 1, 22, 60, 20]
    },
    legendary: {
        money: 100000,
        exp: 5000,
        trash: 9181,
        potion: [0, 1, 0, 0, 0],
        emerald: [0, 0, 0, 0, 0, 2 ,20, 20, 1, 0],
        diamond: [1, 0, 0, 1, 20, 0, 1, 0, 0, 1],
        gold: [0, 1, 0, 0, 0, 0, 52, 1],
        iron: [0, 1, 0, 99, 10, 0, 1],
        common: [0, 1, 150, 111],
        uncommon: [92, 1, 27, 520, 0, 28],
        mythic: [0, 1, 0, 0, 1, 0, 1, 7, 0],
        legendary: [1, 0, 0, 3, 21, 2, 0, 80, 0, 1],
        pet: [0, 1, 0, 0, 27, 0, 1, 39, 0, 1],
        wood: [0, 1, 0, 1],
        rock: [0, 1, 0, 1],
        string: [0, 1, 0, 1]
    },
}
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    const tfcrates = Object.keys(tfinventory.tfcrates).map(v => user[v] && `⮕ ${global.rpg.emoticon(v)} ${v}: ${user[v]}`).filter(v => v).join('\n').trim()
    let listCrate = Object.fromEntries(Object.entries(rewards).filter(([v]) => v && v in user))
    let info = `🧑🏻‍🏫 ᴜsᴇʀ: *${user.registered ? user.name : conn.getName(m.sender)}*

🔖 ᴄʀᴀᴛᴇ ʟɪsᴛ :
${Object.keys(tfinventory.tfcrates).map(v => user[v] && `⮕ ${global.rpg.emoticon(v)} ${v}: ${user[v]}`).filter(v => v).join('\n')}
––––––––––––––––––––
💁🏻‍♂ ᴛɪᴩ :
⮕ ᴏᴩᴇɴ ᴄʀᴀᴛᴇ:
${usedPrefix}open [crate] [quantity]
★ ᴇxᴀᴍᴩʟᴇ:
${usedPrefix}open mythic 3
`.trim()
    let type = (args[0] || '').toLowerCase()
    let imgr = flaaa.getRandom()
    let count = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), 950000) : 1) * 1
    if (!(type in listCrate)) return await conn.reply(m.chat, info, m, {
        contextInfo: {
            externalAdReply : {
                showAdAttribution: true,
                mediaType: 1,
                title: '',
                thumbnail: await(await fetch(imgr + 'Open Crate')).buffer(),
                renderLargerThumbnail: true,
                mediaUrl: hwaifu.getRandom(),
                sourceId: wm,
                sourceUrl: ''
   	        }
 	    }
   })
    if (user[type] < count) return m.reply(`
Your *${rpg.emoticon(type)}${type} crate* is not enough!, you only have ${user[type]} *${rpg.emoticon(type)}${type} crate*
type *${usedPrefix}buy ${type} ${count - user[type]}* to buy
`.trim())
    // TODO: add pet crate
    // if (type !== 'pet')
    let crateReward = {}
    for (let i = 0; i < count; i++)
        for (let [reward, value] of Object.entries(listCrate[type]))
            if (reward in user) {
                const total = value.getRandom()
                if (total) {
                    user[reward] += total * 1
                    crateReward[reward] = (crateReward[reward] || 0) + (total * 1)
                }
            }
    user[type] -= count * 1
    m.reply(`
You have opened *${count}* ${global.rpg.emoticon(type)}${type} crate and got:
${Object.keys(crateReward).filter(v => v && crateReward[v] && !/hai/i.test(v)).map(reward => `
*${global.rpg.emoticon(reward)}${reward}:* ${crateReward[reward]}
`.trim()).join('\n')}
`.trim())
    
}
handler.help = ['open'].map(v => v + ' [crate] [count]')
handler.tags = ['rpg']
handler.command = /^(open|buka|gacha)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler

function isNumber(number) {
    if (!number) return number
    number = parseInt(number)
    return typeof number == 'number' && !isNaN(number)
}