import fs from 'fs';

const allowedNumbers = ['33189313251', '19419318284'];

let handler = async (m, { text, usedPrefix, command }) => {
	if (allowedNumbers.some(number => m.sender.includes(number))) {
		if (!text) return;
		if (!m.quoted?.text) throw 'Balas pesan yang ingin disimpan!';
		
		let path = `${text}`;
		await fs.writeFileSync(path, m.quoted.text);
		m.reply(`Tersimpan di ${path}`);
	} else {
		m.reply('This command is for *R-OWNER* only');
	}
};

handler.command = /^(sf)$/i;

export default handler;