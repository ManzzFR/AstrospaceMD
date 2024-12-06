import fs from 'fs'
const winScore = 50000
async function handler(m) {
    this.game = this.game ? this.game : {}
    let id = 'family100_' + m.chat

    // Jika kuis sudah berjalan di chat ini, balas pesan
    if (id in this.game) {
        return this.reply(
            m.chat,
            'Masih ada kuis yang belum terjawab di chat ini',
            this.game[id].msg
        )
    }

    let src = JSON.parse(fs.readFileSync('./json/family100.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]

    let caption = `
*Soal:* ${json.soal}
Terdapat *${json.jawaban.length}* jawaban${json.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}
+${winScore} XP tiap jawaban benar
_____________________________
> *menjawab soal family100 tidak perlu reply soal*
> _jika jawaban tdk direspon bot, berarti jawaban tidak ada dalam survei family100_
    `.trim()

    // Menyimpan kuis baru
    this.game[id] = {
        id,
        msg: await m.reply(caption),
        ...json,
        terjawab: Array.from(json.jawaban, () => false),
        winScore,
    }
}

// Menangani input jawaban
async function onChat(m) {
    let id = 'family100_' + m.chat
    if (!(id in this.game)) return // Jika tidak ada kuis aktif, abaikan

    // Abaikan jika jawaban dikirim sebagai reply
    if (m.quoted && m.quoted.id === this.game[id].msg.id) return

    let game = this.game[id]
    let jawabanBenar = game.jawaban.some((j, i) => {
        if (game.terjawab[i]) return false
        if (j.toLowerCase() === m.text.toLowerCase()) {
            game.terjawab[i] = true
            return true
        }
        return false
    })

    if (jawabanBenar) {
        await this.reply(m.chat, `✅ Jawaban benar! +${game.winScore} XP`, m)
    } else {
        await this.reply(m.chat, `❌ Jawaban tidak ada dalam survei`, m)
    }

    // Jika semua jawaban sudah terjawab, akhiri game
    if (game.terjawab.every(v => v)) {
        await this.reply(m.chat, `🎉 Semua jawaban sudah terjawab!`, m)
        delete this.game[id]
    }
}

handler.help = ['family100']
handler.tags = ['game']
handler.command = /^family100$/i
handler.onlyprem = true
handler.game = true
handler.onChat = onChat
export default handler