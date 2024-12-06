import fs from "fs"

const items = {
    buy: {
        limit: {
            money: 100
        },
        chip: {
            money: 1500000
        },
        potion: {
            money: 1250
        },
        trash: {
            money: 40
        },
        wood: {
            money: 700
        },
        rock: {
            money: 850
        },
        string: {
            money: 400
        },
        iron: { 
            money: 3000
        },
        diamond: {
            money: 500000
        },
        emerald: {
            money: 100000
        },
        gold: {
            money: 100000
        },
        common: {
            money: 2000
        },
        uncommon: {
            money: 20000
        },
        mythic: {
            money: 75000
        },
        legendary: {
            money: 200000
        },
        petfood: {
            money: 3500
        },
        pet: {
            money: 120000
        },
        anggur: {
            money: 2000
        },
        apel: {
            money: 2000
        },
        jeruk: {
            money: 2000
        },
        mangga: {
            money: 2000
        },
        pisang: {
            money: 2000
        },
        bibitanggur: {
            money: 2000
        },
        bibitapel: {
            money: 2000
        },
        bibitjeruk: {
            money: 2000
        },
        bibitmangga: {
            money: 2000
        },
        bibitpisang: {
            money: 2000
        },
        umpan: {
            money: 5000
        }     
    },
    sell: {
        limit: {
            money: 50000
        },
        chip: {
            money: 100000000
        },
        potion: {
            money: 6777777
        },
        trash: {
            money: 20000000
        },
        wood: {
            money: 20000000
        },
        rock: {
            money: 20000000
        },
        string: {
            money: 20000000
        },
        iron: { 
            money: 999999999
        },
        diamond: {
            money: 999999999
        },
        emerald: {
            money: 999999999
        },
        gold: {
            money: 500000
        },
        common: {
            money: 37000000
        },
        uncommon: {
            money: 37000000
        },
        mythic: {
            money: 370000000
        },
        legendary: {
            money: 370000000
        },
        petfood: {
            money: 100000000
        },
        pet: {
            money: 255555555
        },
        anggur: {
            money: 255555555
        },
        apel: {
            money: 255555555
        },
        jeruk: {
            money: 255555555
        },
        mangga: {
            money: 255555555
        },
        pisang: {
            money: 255555555
        },
        bibitanggur: {
            money: 255555555
        },
        bibitapel: {
            money: 255555555
        },
        bibitjeruk: {
            money: 255555555
        },
        bibitmangga: {
            money: 255555555
        },
        bibitpisang: {
            money: 255555555
        },
        umpan: {
            money: 255555555
        },
        credit: {
            money: 1500000000
        }
    }
}

// Handler untuk perintah buy dan sell
let handler = async (m, { conn, command, usedPrefix, args }) => {
    const item = (args[0] || '').toLowerCase();

    if (!item.match('limit') && db.data.chats[m.chat].rpg == false && m.isGroup) return dfail('rpg', m, conn);

    let user = db.data.users[m.sender];

    const listItems = Object.fromEntries(Object.entries(items[command.toLowerCase()]).filter(([v]) => v && v in user));
    let text = '';
    let footer = '';
    let image = '';
    let buttons = '';

    text = (command.toLowerCase() == 'buy' ?
(`
*𝗕𝘂𝘆𝗶𝗻𝗴*
`.trim()) : 
(`
*𝗦𝗲𝗹𝗹𝗶𝗻𝗴*
`.trim())
);
    footer = (command.toLowerCase() == 'buy' ?
(`
🛒 List Items :

${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user);
        return `1 ${rpg.emoticon(v)} ${capitalize(v)} : ${listItems[v][paymentMethod].toLocaleString('id-ID')} ${capitalize(paymentMethod)}`.trim();
    }).join('\n')}
–––––––––––––––––––––––––
💁🏻‍♂ Tips :
➠ To buy items:
${usedPrefix}${command} [item] [quantity]
▧ Example:
${usedPrefix}${command} potion 10
`.trim()) : 
(`
🛒 List Items :
${Object.keys(listItems).map((v) => {
        let paymentMethod = Object.keys(listItems[v]).find(v => v in user);
        return `1 ${rpg.emoticon(v)} ${capitalize(v)} : ${listItems[v][paymentMethod].toLocaleString('id-ID')} ${capitalize(paymentMethod)}`.trim();
    }).join('\n')}
–––––––––––––––––––––––––
💁🏻‍♂ Tips :
➠ To sell items:
${usedPrefix}${command} [item] [quantity]
▧ Example:
${usedPrefix}${command} potion 10
`.trim())
);

    const total = Math.floor(isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 1), Number.MAX_SAFE_INTEGER) : 1) * 1;
    
    if (!listItems[item]) return m.reply(footer);
    
    if (user.lastBuySell && Date.now() - user.lastBuySell < 1000) {
        const timeUntilAvailable = (1000 - (Date.now() - user.lastBuySell)) / 1000;
        return m.reply(`Mohon tunggu ${timeUntilAvailable.toFixed(0)} detik lagi sebelum menggunakan perintah ini lagi.`);
    }

    if (command.toLowerCase() == 'buy') {
        let paymentMethod = Object.keys(listItems[item]).find(v => v in user);
        if (user[paymentMethod] < listItems[item][paymentMethod] * total) 
            return m.reply(`You need *${((listItems[item][paymentMethod] * total) - user[paymentMethod]).toLocaleString('id-ID')}* ${capitalize(paymentMethod)} ${rpg.emoticon(paymentMethod)} more, to buy *${total.toLocaleString('id-ID')}* ${capitalize(item)} ${rpg.emoticon(item)}. You only have *${user[paymentMethod].toLocaleString('id-ID')}* ${capitalize(paymentMethod)} ${rpg.emoticon(paymentMethod)}.`);
        
        user[paymentMethod] -= listItems[item][paymentMethod] * total;
        user[item] += total;
        user.lastBuySell = Date.now();
        return conn.reply(m.chat, `Successfully bought *${total.toLocaleString('id-ID')} ${capitalize(item)} ${rpg.emoticon(item)}*, priced at *${(listItems[item][paymentMethod] * total).toLocaleString('id-ID')} ${capitalize(paymentMethod)} ${rpg.emoticon(paymentMethod)}*`, m);
    } else {
        let paymentMethod = Object.keys(listItems[item]).find(v => v in user);
        if (user[item] < total) 
            return m.reply(`Kamu tidak punya cukup *${capitalize(item)} ${rpg.emoticon(item)}* untuk menjual, Anda hanya memiliki ${user[item].toLocaleString('id-ID')} item`);
        
        user[item] -= total;
        user[paymentMethod] += listItems[item][paymentMethod] * total;
        user.lastBuySell = Date.now();
        return conn.reply(m.chat, `Successfully sold *${total.toLocaleString('id-ID')} ${capitalize(item)} ${rpg.emoticon(item)}*, priced at *${(listItems[item][paymentMethod] * total).toLocaleString('id-ID')} ${capitalize(paymentMethod)} ${rpg.emoticon(paymentMethod)}*`, m);
    }
};

handler.help = ['buy', 'sell'].map(v => v + ' <item> <count>');
handler.tags = ['rpg'];
handler.command = /^(buy|sell)$/i;
handler.register = true;
handler.group = true;
handler.disabled = false;

export default handler;

function isNumber(number) {
    if (!number) return number;
    number = parseInt(number);
    return typeof number == 'number' && !isNaN(number);
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.substr(1);
}