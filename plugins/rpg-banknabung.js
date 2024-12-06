const xpperlimit = 1
let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender]
  let count = args[0] ? /all/i.test(args[0]) ? Math.floor(global.db.data.users[m.sender].money / xpperlimit) : parseInt(args[0]) : 1
  count = Math.max(1, count)
  if (isNaN(count)) return conn.reply(m.chat, '[❗] Jumlah yang dimasukkan tidak valid', m)
  if (global.db.data.users[m.sender].bank + xpperlimit * count > Infinity) return m.reply('Uang di ATM sudah mencapai batas')
  let total = xpperlimit * count
  if (global.db.data.users[m.sender].money >= total) {
    global.db.data.users[m.sender].money -= total
    global.db.data.users[m.sender].bank += total
    conn.reply(m.chat, `Sukses menabung sebesar ${total} Money 💹`, m)
  } else conn.reply(m.chat, `[❗] Uang anda tidak mencukupi untuk menabung ${total} money 💹`, m)
}
handler.help = ['atm <jumlah>']
handler.tags = ['rpg']
handler.command = /^atm([0-9]+)|atm|atmall$/i
handler.rpg = true
handler.group = true
export default handler