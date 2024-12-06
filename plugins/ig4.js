import axios from "axios"

let handler = async (m, {text, usedPrefix, command}) => {
if (!text) return m.reply('Masukan url')
try {
await m.react('⌛')
let { data } = await axios.post(`https://v3.saveig.app/api/ajaxSearch?recaptchaToken=null&q=${text}&t=media&lang=en`)
let $ = cheerio.load(data.data)
let result = $('div >  div > a').attr('href')
await conn.sendFile(m.chat, result, '', 'Instagram: '+text, m)
await m.react('✅')
} catch (e) {
throw eror
}
}
handler.help = ['instagram4']
handler.tags = ['downloader']
handler.limit = true
handler.command = /^(i(nsta)?g(ram)?4)$/i

export default handler