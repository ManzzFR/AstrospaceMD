import daily from './rpg-daily.js'
import weekly from './rpg-weekly.js'
import monthly from './rpg-monthly.js'
import adventure from './rpg-adventure.js'
import fetch from 'node-fetch'

function formatNumber(num) {
  return num.toLocaleString('id-ID').replace(/,/g, '.'); // Format dengan titik sebagai pemisah ribuan
}

const inventory = {
  others: {
    joinlimit: true,
    health: true,
    money: true,
    chip: true,
    exp: true,
  },
  items: {
    bibitanggur: true,
    bibitmangga: true,
    bibitpisang: true,
    bibitapel: true,
    bibitjeruk: true,
    anggur: true,
    mangga: true,
    pisang: true,
    apel: true,
    jeruk: true,
    potion: true,
    trash: true,
    wood: true,
    rock: true,
    string: true,
    emerald: true,
    diamond: true,
    gold: true,
    iron: true,
    umpan: true,
    upgrader: true,
    pet: true,
    petfood: true,
  },
  durabi: {
    sworddurability: true,
    pickaxedurability: true,
    fishingroddurability: true,
    armordurability: true,
  },
  tools: {
    armor: {
      '0': '❌',
      '1': 'Leather Armor',
      '2': 'Iron Armor',
      '3': 'Gold Armor',
      '4': 'Diamond Armor',
      '5': 'Emerald Armor',
      '6': 'Crystal Armor',
      '7': 'Obsidian Armor',
      '8': 'Netherite Armor',
      '9': 'Wither Armor',
      '10': 'Dragon Armor',
      '11': 'Hacker Armor'
    },
    sword: {
      '0': '❌',
      '1': 'Wooden Sword',
      '2': 'Stone Sword',
      '3': 'Iron Sword',
      '4': 'Gold Sword',
      '5': 'Copper Sword',
      '6': 'Diamond Sword',
      '7': 'Emerald Sword',
      '8': 'Obsidian Sword',
      '9': 'Netherite Sword',
      '10': 'Samurai Slayer Green Sword',
      '11': 'Hacker Sword'
    },
    pickaxe: {
      '0': '❌',
      '1': 'Wooden Pickaxe',
      '2': 'Stone Pickaxe',
      '3': 'Iron Pickaxe',
      '4': 'Gold Pickaxe',
      '5': 'Copper Pickaxe',
      '6': 'Diamond Pickaxe',
      '7': 'Emerald Pickaxe',
      '8': 'Crystal Pickaxe',
      '9': 'Obsidian Pickaxe',
      '10': 'Netherite Pickaxe',
      '11': 'Hacker Pickaxe'
    },
    fishingrod: {
      '0': '❌',
      '1': 'Wooden Fishingrod',
      '2': 'Stone Fishingrod',
      '3': 'Iron Fishingrod',
      '4': 'Gold Fishingrod',
      '5': 'Copper Fishingrod',
      '6': 'Diamond Fishingrod',
      '7': 'Emerald Fishingrod',
      '8': 'Crystal Fishingrod',
      '9': 'Obsidian Fishingrod',
      '10': 'God Fishingrod',
      '11': 'Hacker Fishingrod'
    }
  },
  crates: {
    common: true,
    uncommon: true,
    mythic: true,
    legendary: true,
  },
  pets: {
    horse: 10,
    cat: 10,
    fox: 10,
    dog: 10,
    robo: 10,
  },
  NewItem: {
    ShopFood: {
      kentang: '🍟 Kentang',
      burger: '🍔 Burger',
      pizza: '🍕 Pizza',
      spaghetti: '🍝 Spaghetti',
      ramen: '🍜 Ramen',
      steak: '🥩 Steak',
      sandwich: '🥪 Sandwich',
      kebab: '🌯 Kebab',
      paella: '🫓 Paella',
      tacos: '🌮 Tacos',
      ratatouille: '🥐 Ratatouille',
      croissant: '🥐 Croissant',
      baguette: '🥖 Baguette',
      macaron: '🍲 Macaron',
      bacon: '🥓 Bacon'
    },
    ShopsDrink: {
      vodka: '🥂 Vodka',
      wine: '🍷 Wine',
      coffe: '☕ Coffe',
      matcha: '🍵 Matcha',
      kelp: '🧃 Kelp',
      boba: '🧋 Boba'
    },
    Snack: {
      candy: '🍬 Candy',
      lolipop: '🍭 Lolipop',
      cokelat: '🍫 Cokelat',
      popcorn: '🍿 Popcorn',
      cookies: '🍪 Cookies'
    }
  },
  cooldowns: {
    lastclaim: {
      name: 'claim',
      time: daily.cooldown
    },
    lastweekly: {
    	name: 'weekly',
        time: weekly.cooldown
        },
    lastmonthly: {
      name: 'monthly',
      time: monthly.cooldown
    },
    lastadventure: {
      name: 'adventure',
      time: adventure.cooldown
    }
  }
}

let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] 
    ? m.mentionedJid[0] 
    : m.fromMe 
    ? conn.user.jid 
    : m.sender;

  if (!(who in db.data.users)) {
    return m.reply(`User ${who} not in database`);
  }

  let user = db.data.users[who];
  let sortedlevel = Object.entries(db.data.users).sort((a, b) => b[1].level - a[1].level);
  let userslevel = sortedlevel.map(v => v[0]);
  let sortedmoney = Object.entries(db.data.users).sort((a, b) => b[1].money - a[1].money);
  let usersmoney = sortedmoney.map(v => v[0]);
  let sorteddiamond = Object.entries(db.data.users).sort((a, b) => b[1].diamond - a[1].diamond);
  let usersdiamond = sorteddiamond.map(v => v[0]);
  let sortedbank = Object.entries(db.data.users).sort((a, b) => b[1].bank - a[1].bank);
  let usersbank = sortedbank.map(v => v[0]);
  let sortedgold = Object.entries(db.data.users).sort((a, b) => b[1].gold - a[1].gold);
  let usersgold = sortedgold.map(v => v[0]);

  let imgr = flaaa.getRandom();
  let limit = user.premiumTime >= 1 ? 'Unlimited' : user.limit;

  const tools = Object.keys(inventory.tools)
    .map(v => user[v] && `*${rpg.emoticon(v)} ${v}:* ${formatNumber(user[v])}`)
    .filter(v => v)
    .join('\n')
    .trim();

  const items = Object.keys(inventory.items)
    .map(v => user[v] && `*${rpg.emoticon(v)} ${v}:* ${formatNumber(user[v])}`)
    .filter(v => v)
    .join('\n')
    .trim();

  const crates = Object.keys(inventory.crates)
    .map(v => user[v] && `*${rpg.emoticon(v)} ${v}:* ${formatNumber(user[v])}`)
    .filter(v => v)
    .join('\n')
    .trim();

  const pets = Object.keys(inventory.pets)
    .map(v => user[v] && `*${rpg.emoticon(v)} ${v}:* ${user[v] >= inventory.pets[v] ? 'Max Levels' : `Level(s) ${formatNumber(user[v])}`}`)
    .filter(v => v)
    .join('\n')
    .trim();

  const newItems = Object.entries(inventory.NewItem)
    .map(([category, items]) => {
      return `${category}: \n` + Object.values(items).join('\n');
    })
    .join('\n\n');

  const cooldowns = Object.entries(inventory.cooldowns)
    .map(([cd, { name, time }]) => cd in user && `*✧ ${name}*: ${new Date() - user[cd] >= time ? '✅' : '❌'}`)
    .filter(v => v)
    .join('\n')
    .trim();

    const caption = `
🧑🏻‍🏫 ᴜsᴇʀ: *${user.registered ? user.name : conn.getName(who)}* ${user.level ? `
➠ ${rpg.emoticon('level')} level: ${formatNumber(user.level)}` : ''} ${user.limit ? `
➠ ${rpg.emoticon('limit')} limit: ${limit}` : ''}
${Object.keys(inventory.others)
    .map(v => user[v] && `➠ ${rpg.emoticon(v)} ${v}: ${formatNumber(user[v])}`)
    .filter(v => v)
    .join('\n')} ${tools ? `

*ʟɪꜱᴛ ᴛᴏᴏʟs* :
${tools}` : ''}${items ? `

*ʟɪꜱᴛ ɪᴛᴇᴍs* :
${items}` : ''}${crates ? `

*ʟɪꜱᴛ ᴄʀᴀᴛᴇs* :
${crates}` : ''}${pets ? `

*ʟɪꜱᴛ ᴩᴇᴛs* :
${pets}` : ''}${cooldowns ? `

*ʟɪꜱᴛ ᴀʀᴄʜɪᴇᴠᴇᴍᴇɴᴇᴛ* :
${rpg.emoticon('money')} ᴛᴏᴘ ᴍᴏɴᴇʏ *${formatNumber(usersmoney.indexOf(who) + 1)}* ᴅᴀʀɪ *${formatNumber(usersmoney.length)}*
${rpg.emoticon('bank')} ᴛᴏᴘ ʙᴀɴᴋ *${formatNumber(usersbank.indexOf(who) + 1)}* ᴅᴀʀɪ *${formatNumber(usersbank.length)}*
${rpg.emoticon('level')} ᴛᴏᴘ ʟᴇᴠᴇʟ *${formatNumber(userslevel.indexOf(who) + 1)}* ᴅᴀʀɪ *${formatNumber(userslevel.length)}*
${rpg.emoticon('diamond')} ᴛᴏᴘ ᴅɪᴀᴍᴏɴᴅ *${formatNumber(usersdiamond.indexOf(who) + 1)}* ᴅᴀʀɪ *${formatNumber(usersdiamond.length)}*
${rpg.emoticon('gold')} ᴛᴏᴘ ɢᴏʟᴅ *${formatNumber(usersgold.indexOf(who) + 1)}* ᴅᴀʀɪ *${formatNumber(usersgold.length)}*

♻️ *ᴄᴏʟʟᴇᴄᴛ ʀᴇᴡᴀʀᴅs* :
${cooldowns}` : ''}
*✧ dungeon: ${user.lastdungeon == 0 ? '✅' : '❌'}*
*✧ mining: ${user.lastmining == 0 ? '✅' : '❌'}*`.trim();

  await conn.reply(m.chat, caption, m, {
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        mediaType: 1,
        title: 'I N V E N T O R Y',
        thumbnail: await (await fetch(imgr + 'inventory')).buffer(),
        renderLargerThumbnail: true,
        mediaUrl: elainajpg.getRandom(),
        sourceId: '',
        sourceUrl: 'https://chat.whatsapp.com/Gtcectx7SUcAy21Rk4s851',       
   	 }
 	}
   })  
}
handler.help = ['inventory', 'inv']
handler.tags = ['rpg']
handler.command = /^(inv(entory)?|bal(ance)?|money|e?xp)$/i
handler.register = true
handler.group = true
handler.rpg = true
export default handler