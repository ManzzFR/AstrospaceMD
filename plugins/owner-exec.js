import syntaxerror from 'syntax-error'
import {
	format
} from 'util'
import {
	fileURLToPath
} from 'url'
import {
	dirname
} from 'path'
import {
	createRequire
} from 'module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

// Daftar nomor yang diizinkan
const allowedNumbers = ['33189313251@s.whatsapp.net', '6281267452434@s.whatsapp.net','6281254653853@s.whatsapp.net']

let handler = async (m, _2) => {
	let {
		conn,
		usedPrefix,
		noPrefix,
		args,
		groupMetadata
	} = _2

	// Cek apakah nomor pengirim termasuk yang diizinkan
	if (allowedNumbers.includes(m.sender)) {
		let _return
		let _syntax = ''
		let _text = (/^=/.test(usedPrefix) ? 'return ' : '') + noPrefix
		let old = m.exp * 1
		try {
			let i = 15
			let f = {
				exports: {}
			}
			let exec = new(async () => {}).constructor('print', 'm', 'handler', 'require', 'conn', 'Array', 'process', 'args', 'groupMetadata', 'module', 'exports', 'argument', _text)
			_return = await exec.call(conn, (...args) => {
				if (--i < 1) return
				console.log(...args)
				return conn.reply(m.chat, format(...args), m)
			}, m, handler, require, conn, CustomArray, process, args, groupMetadata, f, f.exports, [conn, _2])
		} catch (e) {
			let err = syntaxerror(_text, 'Execution Function', {
				allowReturnOutsideFunction: true,
				allowAwaitOutsideFunction: true,
				sourceType: 'module'
			})
			if (err) _syntax = '```' + err + '```\n\n'
			_return = e
		} finally {
			conn.reply(m.chat, _syntax + format(_return), m)
			m.exp = old
		}
	} else {
		m.reply('This command is for *R-OWNER* Only')
	}
}
handler.help = ['>', '=>']
handler.tags = ['owner']
handler.customPrefix = /^=?> /
handler.command = /(?:)/i


export default handler

class CustomArray extends Array {
	constructor(...args) {
		if (typeof args[0] == 'number') return super(Math.min(args[0], 10000))
		else return super(...args)
	}
}