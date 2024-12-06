import axios from "axios";
import cheerio from "cheerio";

let handler = async (m, {
    text,
    conn
}) => {
    if (!text) throw "masukan link Instagram";
        try {
            let result = await igdl(text);
            for (let i of result) {
                await conn.sendFile(m.chat, i, '', "", m)
            }
        } catch (e) {
            throw eror
        }
}
handler.help = handler.command = ["instagram5", "ig5"]
handler.tags = ["downloader"]

export default handler

async function igdl(url) {
    try {
        // Data yang akan dikirim dalam permintaan POST
        const postData = 'recaptchaToken=&q=' + encodeURIComponent(url) + '&t=media&lang=id';


        const response = await axios.post('https://v3.igdownloader.app/api/ajaxSearch', postData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': '*/*'
            }
        });


        if (response.data.status === 'ok') {
            // Menggunakan Cheerio untuk memuat dan memproses HTML dari respons
            const $ = cheerio.load(response.data.data);

            // Mengumpulkan semua URL unduhan
            const urls = [];
            $('a.abutton.is-success').each((index, element) => {
                const url = $(element).attr('href');
                urls.push(url);
            });

            return urls;
        } else {
            throw new Error('Response status not OK');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}