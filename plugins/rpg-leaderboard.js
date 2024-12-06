import { areJidsSameUser } from '@adiwajshing/baileys';
import { createCanvas, loadImage } from 'canvas';
import fetch from 'node-fetch';

const leaderboards = [
    'level', 'exp', 'limit', 'money', 'iron', 'gold', 'diamond', 'emerald',
    'trash', 'joinlimit', 'potion', 'petFood', 'wood', 'rock', 'string',
    'common', 'uncommon', 'mythic', 'legendary', 'pet', 'bank', 'chip', 'skata'
];

let handler = async (m, { conn, args, participants, usedPrefix, command }) => {
    let users = Object.entries(global.db.data.users).map(([key, value]) => ({ ...value, jid: key }));
    let type = (args[0] || '').toLowerCase();
    const validLeaderboard = leaderboards.includes(type);

    if (!validLeaderboard) {
        return await conn.reply(m.chat, '*Invalid leaderboard type!*\nUse one of the following types:\n' + leaderboards.join(', '), m);
    }

    let sortedUsers = users.filter(user => user[type] !== undefined).sort((a, b) => b[type] - a[type]);
    let topUsers = sortedUsers.slice(0, 3);

    // Create a canvas to generate the leaderboard image
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Background color and styling
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Centering the 'Leaderboard - Top 3' text
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#ffffff';
    const title = 'Leaderboard - Top 3';
    const titleWidth = ctx.measureText(title).width;
    ctx.fillText(title, (canvas.width - titleWidth) / 2, 50); // Centered text

    // Ranks 1, 2, and 3 positions
    for (let i = 0; i < topUsers.length; i++) {
        const user = topUsers[i];
        const avatarUrl = await conn.profilePictureUrl(user.jid, 'image').catch(_ => 'https://i.ibb.co/2WzLyGk/profile.jpg');
        const avatar = await loadImage(avatarUrl);
        
        // Draw avatar and details for each user
        const x = 50 + i * 250;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + 75, 150, 70, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, x, 80, 150, 150);
        ctx.restore();

        ctx.fillStyle = '#ffcc00';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`Rank ${i + 1}`, x + 40, 250);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`${user.registered ? user.name : conn.getName(user.jid)}`, x + 10, 280);
        ctx.fillText(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${user[type]}`, x + 10, 310);
    }

    const imageBuffer = canvas.toBuffer();

    // Format the text output for the top 5 users
    let text = `
Leaderboard: ${type.charAt(0).toUpperCase() + type.slice(1)}

${sortedUsers.slice(0, 5).map((user, i) => `
Top ${i + 1} *${user.registered ? user.name : conn.getName(user.jid)}*
Total: ${user[type]}
Number: wa.me/${user.jid.split`@`[0]}
`).join('\n')}`.trim();

    // Send image and formatted text
    await conn.sendMessage(m.chat, { image: imageBuffer, caption: text }, { quoted: m });
};

handler.help = ['leaderboard <item>'];
handler.tags = ['xp'];
handler.command = /^(leaderboard|lb)$/i;

handler.register = true;
handler.group = true;
handler.rpg = true;

export default handler;