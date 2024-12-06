import { spawn } from 'child_process';
import _0x14557a from 'path';
import 'console';
import 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const sleep = _0x39400f => {
  return new Promise(_0x1bb57a => setTimeout(_0x1bb57a, _0x39400f));
};
import _0x3d91e0 from 'cfonts';
import _0xdc2066 from 'chalk';
console.clear();
const __dirname = dirname(fileURLToPath(import.meta.url));
const start = async () => {
  const _0x293610 = [_0x14557a.join(__dirname, "main.js"), ...process.argv.slice(0x2)];
  const _0x19ae43 = spawn(process.argv[0x0], _0x293610, {
    'stdio': ["inherit", 'inherit', "inherit", 'ipc']
  });
  _0x19ae43.on("exit", _0x38d32d => {
    console.error("❎ Exited with code:", _0x38d32d);
    if (_0x38d32d === '.' || _0x38d32d === 0x1 || _0x38d32d === 0x0) {
      start();
    }
  });
};
await sleep(0x7d0);
_0x3d91e0.say("\n\nWhatsApp BOT RPG\n", {
  'font': 'tiny',
  'align': 'center',
  'gradient': ["red", "blue"]
});
_0x3d91e0.say("Simple Whatsapp Bot Use QR Code & Pairing Code\nWith Baileys Library", {
  'font': "console",
  'align': "center",
  'colors': ['blue']
});
console.log(_0xdc2066.bold.green("\nTerima kasih telah menggunakan sc ini."));
start();