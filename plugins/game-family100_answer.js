import similarity from 'similarity'
const threshold = 0.72 // semakin tinggi nilai, semakin mirip
export async function before(m) {
    this.game = this.game ? this.game : {}
    let id = 'family100_' + m.chat

    // Jika tidak ada kuis aktif, abaikan
    if (!(id in this.game)) return !0

    let room = this.game[id]

    // Abaikan jika jawaban dikirim sebagai reply terhadap soal
    if (m.quoted && m.quoted.id === room.msg.id) return !0

    let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
    let isSurrender = /^((me)?nyerah|surr?ender)$/i.test(m.text)

    if (!isSurrender) {
        let index = room.jawaban.indexOf(text)

        // Jika jawaban tidak ditemukan
        if (index < 0) {
            let similarityScore = Math.max(
                ...room.jawaban
                    .filter((_, index) => !room.terjawab[index])
                    .map(jawaban => similarity(jawaban, text))
            )
            if (similarityScore >= threshold) {
                m.reply('Dikit lagi!')
            }
            return !0
        }

        // Jika jawaban sudah pernah dijawab
        if (room.terjawab[index]) return !0

        let users = global.db.data.users[m.sender]
        room.terjawab[index] = m.sender
        users.exp += room.winScore
    }

    let isWin = room.terjawab.length === room.terjawab.filter(v => v).length

    let caption = `
*Soal:* ${room.soal}
Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
` : ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB*` : isSurrender ? '*MENYERAH!*' : ''}
${Array.from(room.jawaban, (jawaban, index) => {
        return isSurrender || room.terjawab[index]
            ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim()
            : false
    }).filter(v => v).join('\n')}
${isSurrender ? '' : `+${room.winScore} XP tiap jawaban benar`}

*Catatan:*
Semua jawaban berdasarkan survei *Family100*, bukan hasil pencarian dari browser.
    `.trim()

    const msg = await this.reply(m.chat, caption, null, {
        mentions: this.parseMention(caption)
    })

    room.msg = msg

    if (isWin || isSurrender) delete this.game[id]
    return !0
}