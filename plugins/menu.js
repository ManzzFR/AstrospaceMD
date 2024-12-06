import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const cmd = args[0] || 'list';
  // Define the thumbnail URL (replace with your own image URL)
const thumbnail = "https://files.catbox.moe/2f0ydk.jpeg"; // You can use your desired thumbnail URL here

// Continue with the rest of your code
  let type = (args[0] || '').toLowerCase()
  let _menu = global.db.data.settings[conn.user.jid]
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  const tagCount = {};
  const tagHelpMapping = {};
  Object.keys(global.plugins)
    .filter(plugin => !plugin.disabled)
    .forEach(plugin => {
      const tagsArray = Array.isArray(global.plugins[plugin].tags)
        ? global.plugins[plugin].tags
        : [];

      if (tagsArray.length > 0) {
        const helpArray = Array.isArray(global.plugins[plugin].help)
          ? global.plugins[plugin].help
          : [global.plugins[plugin].help];

        tagsArray.forEach(tag => {
          if (tag) {
            if (tagCount[tag]) {
              tagCount[tag]++;
              tagHelpMapping[tag].push(...helpArray);
            } else {
              tagCount[tag] = 1;
              tagHelpMapping[tag] = [...helpArray];
            }
          }
        });
      }
    });
           let isiMenu = []
          let objekk = Object.keys(tagCount)
          Object.entries(tagCount).map(([key, value]) => isiMenu.push({
          header: `Menu ${key}`,
                    title: `📌 Show Menu [ ${key} ]`,
                    description: `Total ${value} Command`,
                    id: ".menu " + key,
                    })
          ).join();
          const datas = {
    title: "Open here!",
    sections: [{
            title: "Menu All",
            highlight_label: "Tampilkan semua menu",
            rows: [{
                    header: "Menu All",
                    title: "Menampilkan semua menu",
                    description: "",
                    id: ".menu all",
                }],
        },
        {
            title: 'Menu List',
            highlight_label: "MENU LIST",
            rows: [...isiMenu]
        },
        {
            title: 'Info Bot',
            highlight_label: "INFORMATION",
            rows: [
            {
                    header: "Info Script",
                    title: "Informasi mengenai script Bot",
                    description: "",
                    id: ".sc",
                },
            {
                    header: "Info Owner",
                    title: "Informasi mengenai owner Bot",
                    description: "",
                    id: ".owner",
                },
            {
                    header: "Info total fitur",
                    title: "Informasi mengenai total fitur Bot",
                    description: "",
                    id: ".totalfitur",
                },
            {
                    header: "Info kecepatan respon",
                    title: "Informasi mengenai kecepatan respon Bot",
                    description: "",
                    id: ".os",
                }
                ]
        }
    ]
};

  let objek = Object.values(db.data.stats).map(v => v.success)
  let totalHit = 0
   for (let b of objek) {
    totalHit += b
    }
  let docUrl = 'https://files.catbox.moe/fyys9l.jpeg';
  let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
    return {
      help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
      enabled: !plugin.disabled,
    }
  });
    
   let data = db.data.users[m.sender];
   let fitur = Object.values(plugins).filter(v => v.help).map(v => v.help).flat(1);
   let tUser = Object.keys(db.data.users).length;
   let userReg = Object.values(global.db.data.users).filter(user => user.registered == true).length
   
let headers = `
*み  I N F O - U S E R*
[🎐] ⌕ Name : ${m.pushName || 'User'}
[⌛] ⌕ Limit : ${data.limit}
[💰] ⌕ Money : ${data.money}

*み  I N F O - B O T*
[📡] ⌕ Mode: ${global.opts['self'] ? 'Self' : 'Public'}
[📠] ⌕ Total Menu: ${Object.keys(tagCount).length}
[📋] ⌕ Total Fitur: ${fitur.length}
[📊] ⌕ User: ${tUser}
[📈] ⌕ Total Hit: ${totalHit}
[💌] ⌕ Owner: +1 941 931 8284
\n\n`

  if (cmd === 'list') {
    const daftarTag = Object.keys(tagCount)
      .sort()
      .join('\n│❐ ' + usedPrefix + command + '  ');
    const more = String.fromCharCode(8206)
    const readMore = more.repeat(4001)
    let _mpt
    if (process.send) {
      process.send('uptime')
      _mpt = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let mpt = clockString(_mpt)
    let name = m.pushName || conn.getName(m.sender)
    let list = `${headers}${readMore}\n┎──「 LIST MENU 」\n│❐ ${usedPrefix + command} all\n│❐ ${daftarTag}\n┖──────────•`
 const pp = await conn.profilePictureUrl(m.sender, 'image').catch((_) => "https://files.catbox.moe/2f0ydk.jpeg");
if (_menu.image) {

conn.sendMessage(m.chat, {
      text: list,
      contextInfo: {
      externalAdReply: {
      title: 'Nexora MD',
      body: 'M E N U',
      thumbnailUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
      souceUrl: 'https://github.com/ManzzFR',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: m})
      
      } else if (_menu.gif) {

conn.sendMessage(m.chat, {
      video: {url: "https://files.catbox.moe/59biwo.mp4"},
      gifPlayback: true,
      caption: list,
      jpegThumbnail: await conn.resize((await conn.getFile(docUrl)).data, 180, 72),
      contextInfo: {
      externalAdReply: {
      title: 'Nexora MD',
      body: 'M E N U',
      thumbnailUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
      souceUrl: 'https://github.com/ManzzFR',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: m})

} else if (_menu.teks) {

conn.reply(m.chat, list, m)

} else if (_menu.doc) {

conn.sendMessage(m.chat, {
            document: fs.readFileSync("./package.json"),
            fileName: 'Nexora MD',
            fileLength: new Date(),
            pageCount: "2024",
            caption: list,
            jpegThumbnail: await conn.resize((await conn.getFile(docUrl)).data, 180, 72),
            contextInfo: {
              externalAdReply: {
                containsAutoReply: true,
                mediaType: 1,
                mediaUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
                renderLargerThumbnail: true,
                showAdAttribution: true,
                sourceUrl: 'https://github.com/ManzzFR',
                thumbnailUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
                title: `${date}`,
                body: '',
              },
            },
          }, {quoted: m});
          } else if (_menu.button) {
          
 conn.sendListImageButton(m.chat, `Hai kak ${m.pushName ? m.pushName : 'Ganteng/cantik'}\nSaya adalah Nexora MD✨\nSebuah progam yang dirancang sedemikian rupa untuk membuat para pengguna mudah dalam menggunakan Bot ini. Berbagai fitur menari dan berguna bisa kalian dapatkan di Nexora MD.\nSaya di rancang oleh *${global.info.nameown}*.\n${headers}`, datas, wm, thumbnail)
          }
  } else if (tagCount[cmd]) {
    const daftarHelp = tagHelpMapping[cmd].map((helpItem, index) => {
        
      const premiumSign = help[index].premium ? '🅟' : '';
      const limitSign = help[index].limit ? 'Ⓛ' : '';
      return `.${helpItem} ${premiumSign}${limitSign}`;
    }).join('\n│❐'  + ' ');
        const more = String.fromCharCode(8206)
        const readMore = more.repeat(4001)
        
    const list2 =  `${headers}${readMore}┎──「 MENU ${cmd.toUpperCase()} 」\n├──────────────\n│❐ ${daftarHelp}\n┖──────────•\n\n*Total menu ${cmd}: ${tagHelpMapping[cmd].length}*`
     const pp = await conn.profilePictureUrl(m.sender, 'image').catch((_) => "https://files.catbox.moe/2f0ydk.jpeg");
if (_menu.image) {

conn.sendMessage(m.chat, {
      
      text: list2,
      contextInfo: {
      externalAdReply: {
      title: 'Nexora MD',
      body: 'M E N U',
      thumbnailUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
      souceUrl: 'https://github.com/ManzzFR',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: m})
      
      } else if (_menu.gif) {

conn.sendMessage(m.chat, {
      video: {url: "https://files.catbox.moe/59biwo.mp4"},
      gifPlayback: true,
      caption: list2,
      contextInfo: {
      externalAdReply: {
      title: 'Nexora MD',
      body: 'M E N U',
      thumbnailUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
      souceUrl: 'https://github.com/ManzzFR',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: m})

} else if (_menu.teks) {

conn.reply(m.chat, list2, m)

} else if (_menu.doc) {

conn.sendMessage(m.chat, {
            document: fs.readFileSync("./package.json"),
            fileName: 'Nexora MD',
            fileLength: new Date(),
            pageCount: "2024",
            jpegThumbnail: await conn.resize((await conn.getFile(docUrl)).data, 180, 72),
            caption: list2,
            contextInfo: {
              externalAdReply: {
                containsAutoReply: true,
                mediaType: 1,
                mediaUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
                renderLargerThumbnail: true,
                showAdAttribution: true,
                sourceUrl: 'https://github.com/ManzzFR',
                thumbnailUrl: thumbnail,
                title: `${date}`,
                body: '',
              },
            },
          }, {quoted: m});
          } else if (_menu.button) {
          conn.sendListImageButton(m.chat, `Hai kak ${m.pushName ? m.pushName : 'Ganteng/cantik'}\nSaya adalah Nexora MD✨\nSebuah progam yang dirancang sedemikian rupa untuk membuat para pengguna mudah dalam menggunakan Bot ini. Berbagai fitur menari dan berguna bisa kalian dapatkan di Nexora MD.\nSaya di rancang oleh *${global.info.nameown}*.\n\n${list2}`, datas, wm, thumbnail)
          }
          } else if (cmd === 'all') {
    let name = m.pushName || conn.getName(m.sender)
    const more = String.fromCharCode(8206)
    const readMore = more.repeat(4001)
    const allTagsAndHelp = Object.keys(tagCount).map(tag => {
      const daftarHelp = tagHelpMapping[tag].map((helpItem, index) => {
        const premiumSign = help[index].premium ? '🅟' : '';
        const limitSign = help[index].limit ? 'Ⓛ' : '';
        return `.${helpItem} ${premiumSign}${limitSign}`;
      }).join('\n│❐' + ' ');
      return`┎──「 MENU ${tag.toUpperCase()} 」\n├──────────────\n│❐ ${daftarHelp}\n┖──────────•`;
    }).join('\n');
    let all =  `${headers}${readMore}\n${allTagsAndHelp}\n${wm}`
    const pp = await conn.profilePictureUrl(m.sender, 'image').catch((_) => "https://files.catbox.moe/2f0ydk.jpeg");
    if (_menu.image) {

conn.sendMessage(m.chat, {
      text: all,
      contextInfo: {
      externalAdReply: {
      title: 'Nexora MD',
      body: 'M E N U',
      thumbnailUrl: thumbnail,
      souceUrl: 'https://github.com/ManzzFR',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: m})
      
      } else if (_menu.gif) {

conn.sendMessage(m.chat, {
      video: {url: "https://files.catbox.moe/59biwo.mp4"},
      gifPlayback: true,
      caption: all,
      contextInfo: {
      externalAdReply: {
      title: 'Nexora MD',
      body: 'M E N U',
      thumbnailUrl: thumbnail,
      souceUrl: 'https://github.com/ManzzFR',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: m})

} else if (_menu.teks) {

conn.reply(m.chat, all, m)

} else if (_menu.doc) {

conn.sendMessage(m.chat, {
            document: fs.readFileSync("./package.json"),
            fileName: 'Nexora MD',
            fileLength: new Date(),
            pageCount: "2024",
            caption: all,
            jpegThumbnail: await conn.resize((await conn.getFile(docUrl)).data, 180, 72),
            contextInfo: {
              externalAdReply: {
                containsAutoReply: true,
                mediaType: 1,
                mediaUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
                renderLargerThumbnail: true,
                showAdAttribution: true,
                sourceUrl: 'https://github.com/ManzzFR',
                thumbnailUrl: 'https://files.catbox.moe/2f0ydk.jpeg',
                title: `${date}`,
                body: '',
              },
            },
          }, {quoted: m});
          } else if (_menu.button) {
          conn.sendListImageButton(m.chat, `Hai kak ${m.pushName ? m.pushName : 'Ganteng/cantik'}\nSaya adalah NexoraMD✨\nSebuah progam yang dirancang sedemikian rupa untuk membuat para pengguna mudah dalam menggunakan Bot ini. Berbagai fitur menari dan berguna bisa kalian dapatkan di NexoraMD.\nSaya di rancang oleh *${global.info.nameown}*.\n\n${all}`, datas, wm, thumbnail)
          }
  } else {
  await conn.reply(m.chat, `"'${cmd}' tidak dapat ditemukan. Gunakan perintah '${command} list' atau '${command} all' untuk melihat menu yang telah tersedia.`,m);
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu']
handler.register = true
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}