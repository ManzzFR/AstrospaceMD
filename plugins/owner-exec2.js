import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
let exec = promisify(_exec).bind(cp)

let handler = async (m, { conn, command, text }) => {
    // Cek jika nomor pengirim adalah nomor yang diizinkan
    if (m.sender.includes('33189313251@s.whatsapp.net')) {
        if (global.conn.user.jid != conn.user.jid) return
        m.reply('Executing...')
        
        let o
        try {
            o = await exec(command.trimStart() + ' ' + text.trimEnd())
        } catch (e) {
            o = e
        } finally {
            let { stdout, stderr } = o
            if (stdout.trim()) m.reply(stdout)
            if (stderr.trim()) m.reply(stderr)
        }
    } else {
        m.reply('This command is for *authorized user* only')
    }
}

handler.help = ['$ [Exec]']
handler.tags = ['owner']
handler.customPrefix = /^[$] /
handler.command = new RegExp

export default handler