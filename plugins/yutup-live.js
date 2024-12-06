// Define the main handler function
const handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender];
    const tag = `@${m.sender.replace(/@.+/, '')}`;

    // Initialize user stats if undefined
    user.subscribers = typeof user.subscribers === 'number' ? user.subscribers : 0;
    user.like = typeof user.like === 'number' ? user.like : 0;
    user.viewers = typeof user.viewers === 'number' ? user.viewers : 0;
    user.money = typeof user.money === 'number' ? user.money : 0;
    user.playButton = typeof user.playButton === 'number' ? user.playButton : 0;
    user.eris = typeof user.eris === 'number' ? user.eris : 0;
    user.exp = typeof user.exp === 'number' ? user.exp : 0;

    try {
        if (command === 'ytlive') {
            if (!user.youtube_account) {
                return conn.reply(m.chat, `Hey Kamu Iya Kamu ${tag}\nBuat akun terlebih dahulu\nKetik: .createakunyt`, m);
            }
            let title = args.join(' ');
            if (!title || title.length > 50) {
                return conn.reply(m.chat, `${tag} Silakan berikan judul untuk live Anda (maksimal 50 karakter).`, m);
            }
            const cooldownTime = 80000; // 10 menit dalam milidetik (10 * 60 * 1000)
            const lastLiveTime = user.lastLiveTime || 0;
            const timeSinceLastLive = new Date() - lastLiveTime;

            if (timeSinceLastLive < cooldownTime) {
                const remainingCooldown = cooldownTime - timeSinceLastLive;
                const formattedCooldown = msToTime(remainingCooldown);
                throw `Kamu sudah lelah. Tunggu selama\n${formattedCooldown}`;
            }

            setTimeout(() => {
                conn.reply(m.chat, `👋 Hai Kak ${tag}, Subscribermu sudah menunggu,\nwaktunya untuk live streaming kembali!`, m);
            }, cooldownTime);

            const randomSubscribers = Math.floor(Math.random() * (3000 - 10 + 1)) + 1;
            const randomLike = Math.floor(Math.random() * (100000 - 200 + 1)) + 10;
            const randomViewers = Math.floor(Math.random() * (10000000 - 10000 + 1)) + 1;
            const randomDonation = Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;

            user.subscribers += randomSubscribers;
            user.like += randomLike;
            user.viewers += randomViewers;
            user.money += randomDonation;
            user.lastLiveTime = new Date();

            if (user.subscribers >= 1000000 && user.playButton < 3) {
                user.playButton += 1;
                user.eris += Math.floor(Math.random() * (1000000 - 500000 + 1)) + 500000; // Hadiah Eris
                user.exp += 50000; // Hadiah EXP
                conn.reply(m.chat, `📢 Congratulation! Anda telah mencapai milestone subscribers dan mendapatkan *🥇 Diamond PlayButton* serta hadiah Money dan exp! 🎉\n\n📢 Cek Progresmu Dengan cara *.akunyt*`, m);
            } else if (user.subscribers >= 100000 && user.playButton < 2) {
                user.playButton += 1;
                user.eris += Math.floor(Math.random() * (500000 - 300000 + 1)) + 300000; // Hadiah Eris
                user.exp += 25000; // Hadiah EXP
                conn.reply(m.chat, `📢 Congratulation! Anda telah mencapai milestone subscribers dan mendapatkan *🥈 Gold PlayButton* serta hadiah Money dan exp! 🎉\n\n📢 Cek Progresmu Dengan cara *.akunyt*`, m);
            } else if (user.subscribers >= 10000 && user.playButton < 1) {
                user.playButton += 1;
                user.money += Math.floor(Math.random() * (250000 - 10000 + 1)) + 10000; // Hadiah Eris
                user.exp += 5000; // Hadiah EXP
                conn.reply(m.chat, `📢 Congratulation! ${tag}, telah mencapai milestone subscribers dan mendapatkan *🥉 Silver PlayButton* serta hadiah Money dan exp! 🎉\n\n📢 Cek Progresmu Dengan cara *.akunyt*`, m);
            };

            const formattedSubscribers = formatNumber(user.subscribers);
            const formattedLike = formatNumber(user.like);
            const formattedViewers = formatNumber(user.viewers);
            const formattedDonation = formatCurrency(randomDonation);

            conn.reply(m.chat, `
[ 🎦 ] Hasil Live Streaming

🧑🏻‍💻 *Streamer:* ${tag}
📹 *Judul Live:* ${title}
📈 *New Subscribers:* +${formatNumber(randomSubscribers)}
👍🏻 *New Like:* +${formatNumber(randomLike)}
🪬 *New Viewers:* +${formatNumber(randomViewers)}
💵 *Donasi:* ${formattedDonation}

📊 *Total Like:* ${formattedLike}
📊 *Total Viewers:* ${formattedViewers}
📊 *Total Subscribers:* ${formattedSubscribers}

> Cek akun YouTube Anda
> Ketik:  .akunyt`, m);
        }
    } catch (err) {
        m.reply("📢: " + err);
    }
};

// Functions to format numbers, currency, and time
function formatNumber(num) {
    if (isNaN(num)) return '0';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'M';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'Jt';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}

function formatCurrency(num) {
    return 'Rp' + new Intl.NumberFormat('id-ID').format(num);
}

function msToTime(duration) {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    const formattedTime = [];
    if (hours > 0) formattedTime.push(`${hours} jam`);
    if (minutes > 0) formattedTime.push(`${minutes} menit`);
    if (seconds > 0 || (hours === 0 && minutes === 0)) formattedTime.push(`${seconds} detik`);

    return formattedTime.join(' ');
}

// Define help, tags, commands, and registration for the RPG command handler
handler.help = ['ytlive'];
handler.tags = ['rpg'];
handler.command = /^(ytlive|ytstreaming)/i;
handler.register = true;
handler.rpg = true;
handler.group = true;

// Export as default for compatibility
export default handler;