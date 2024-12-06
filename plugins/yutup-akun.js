const handler = async (m, { conn, command, args, usedPrefix }) => {
    try {
        const user = global.db.data.users[m.sender];
        const tag = '@' + m.sender.split('@')[0];

        // Initialize values if undefined
        user.subscribers = user.subscribers || 0;
        user.viewers = user.viewers || 0;
        user.like = user.like || 0;
        user.playButton = user.playButton || 0;

        const formatNumber = (number) => {
            if (number >= 1e6) return (number / 1e6).toFixed(1) + 'Jt';
            if (number >= 1e3) return (number / 1e3).toFixed(1) + 'K';
            return number.toString();
        };

        if (command === 'akunyt') {
            let targetNumber = m.sender;
            let targetTag = tag;

            if (args.length > 0) {
                targetNumber = args[0];
                targetTag = '@' + targetNumber.split('@')[0];
            }

            const targetUser = global.db.data.users[targetNumber];

            if (!targetUser?.youtube_account) {
                return conn.sendMessage(
                    m.chat,
                    {
                        text: `Hey ${targetTag}, buat akun terlebih dahulu\nKetik: ${usedPrefix}createakunyt`,
                        contextInfo: { mentionedJid: [m.sender] },
                    },
                    { quoted: m }
                );
            }

            // Format values to be displayed
            const formattedSubscribers = formatNumber(targetUser.subscribers);
            const formattedViewers = formatNumber(targetUser.viewers);
            const formattedLike = formatNumber(targetUser.like);

            // Define play button levels based on subscriber count
            const silverButton = targetUser.playButton >= 1 ? 'Sudah' : 'Belum';
            const goldButton = targetUser.playButton >= 2 ? 'Sudah' : 'Belum';
            const diamondButton = targetUser.playButton >= 3 ? 'Sudah' : 'Belum';

            // Construct the response message
            const response = `*Akun YouTube ${targetTag}*\n\n` +
                             `Streamer: ${targetUser.registered ? targetTag : conn.getName(targetNumber)}\n` +
                             `Channel: ${targetUser.youtube_account}\n` +
                             `Subscribers: ${formattedSubscribers}\n` +
                             `Viewers: ${formattedViewers}\n` +
                             `Like: ${formattedLike}\n\n` +
                             `*PlayButton Status:*\n` +
                             `- Silver: ${silverButton}\n` +
                             `- Gold: ${goldButton}\n` +
                             `- Diamond: ${diamondButton}`;

            // Send text message only
            await conn.sendMessage(m.chat, { text: response, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
        } else {
            return await conn.reply(
                m.chat,
                `Perintah tidak dikenali.\n*.akunyt*\n> Untuk mengecek akun YouTube Anda\n*.ytlive [judul live]*\n> Untuk memulai aktivitas live streaming.`,
                m
            );
        }
    } catch (err) {
        console.error(err);
        return m.reply('Terjadi kesalahan dalam memproses perintah.');
    }
};

handler.help = ['akunyt [nomor]'];
handler.tags = ['rpg'];
handler.command = /^(akunyt)$/i;
handler.register = true;
handler.group = true;

export default handler;