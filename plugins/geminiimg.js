import fetch from "node-fetch"
import uploadImage from "../lib/uploadImage.js"

let handler = async (m, opts) => {
    let { command, usedPrefix, conn, text, args } = opts
    let teks
    try {
        if (args.length >= 1) {
            teks = args.join(" ")
        } else if (m.quoted && m.quoted.text) {
            teks = m.quoted.text
        } else return m.reply("Input Teks")
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ""        
        if (!mime) return m.reply("Tidak ada gambar yang terdeteksi. Silakan balas dengan gambar yang ingin digunakan.")
        await m.reply(wait)
        let media = await q.download()
        if (!/image\/(png|jpe?g)/.test(mime)) return await m.reply("Format gambar tidak didukung.")
        let link = await uploadImage(media)
        let res = await fetch(`https://api.zenkey.my.id/api/openai/geminiimg?apikey=zenkey&url=${link}&text=${teks}`)
        let json = await res.json()
        await m.reply(json.result)
    } catch (e) {
        throw e
    }
}

handler.help = ["geminiimg (Balas foto)"]
handler.tags = ["ai"]
handler.command = /^(geminiimg)$/i
handler.limit = true

export default handler