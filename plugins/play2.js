import ffmpeg from "fluent-ffmpeg"
import yts from "yt-search"
import _ from "lodash"
import fetch from "node-fetch"

let handler = async (m, { conn, args }) => {
  const text = args.length ? args.join(" ") : _.get(m, "quoted.text") || _.get(m, "quoted.caption") || _.get(m, "quoted.description") || ""
  if (!text.trim()) return m.reply("Masukkan kata kunci pencarian")
  await m.reply("Tunggu sebentar...")
  const vid = await ytsearch(text)
  if (!vid?.url) return m.reply("Audio tidak ditemukan. Silakan coba kata kunci lain.")
  const { title = "Tidak Diketahui", thumbnail, timestamp = "Tidak Diketahui", views = "Tidak Diketahui", ago = "Tidak Diketahui", url } = vid
  const formattedViews = parseInt(views).toLocaleString("id-ID") + " tayangan"
  const captvid = `*Judul:* ${title}\n*Durasi:* ${timestamp}\n*Views:* ${formattedViews}\n*Upload:* ${ago}\n*Link:* ${url}` 
  const ytthumb = (await conn.getFile(thumbnail))?.data

  const infoReply = {
    contextInfo: {
      externalAdReply: {
        body: "Sedang mengunduh hasil, harap tunggu...",
        mediaType: 1,
        mediaUrl: url,
        previewType: 0,
        renderLargerThumbnail: true,
        sourceUrl: url,
        thumbnail: ytthumb,
        title: "Y O U T U B E - P L A Y"
      }
    }
  }
  await conn.reply(m.chat, captvid, m, infoReply)
  const res = await fetch(`https://api.zenkey.my.id/api/download/loader?apikey=zenkey&url=${url}`)
  const json = await res.json() 
  if (json.status) {
    const video = json.result.find(item => item.format.includes("MP4 (480p)"))
    if (video?.download_url) {
      await conn.sendMessage(m.chat, {
        video: { url: video.download_url },
        caption: "MP4 (480p)"
      }, { quoted: m })

      const audioFile = await toMp3(video.download_url)
      await conn.sendMessage(m.chat, {
        audio: { url: audioFile },
        caption: captvid,
        mimetype: "audio/mpeg",
        contextInfo: infoReply.contextInfo
      }, { quoted: m })
    } else {
      await m.reply("Klo gagal gini, harap mengulanginya lagi🗿")
    }
  } else {
    await m.reply("Gagal mengunduh video.")
  }
}

handler.help = ["play2 <pencarian>"]
handler.tags = ["downloader"]
handler.command = /^(play2|ytplay)$/i
handler.limit = true
export default handler

async function toMp3(videoUrl) {
  const outputFileName = `/tmp/audio_${Date.now()}.mp3`
  return new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .toFormat("mp3")
      .on("end", () => resolve(outputFileName))
      .on("error", reject)
      .save(outputFileName)
  })
}

async function ytsearch(query, maxResults = 5, similarityThreshold = 0.5) {
  const res = await yts(query)
  const videos = res.videos.slice(0, maxResults).filter(video => {
    const titleWords = _.words(_.toLower(video.title))
    const queryWords = _.words(_.toLower(query))
    const matchedWords = _.intersection(titleWords, queryWords)
    const similarity = matchedWords.length / titleWords.length
    return similarity >= similarityThreshold || matchedWords.length >= queryWords.length - 1
  })
  return videos.length ? videos[0] : {}
}