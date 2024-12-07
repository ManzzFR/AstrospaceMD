process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import './config.js';
import { createRequire } from 'module';
import _0x348971, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
global.__filename = function filename(_0x48b40c = import.meta.url, _0x2e46fc = platform !== "win32") {
  return _0x2e46fc ? /file:\/\/\//.test(_0x48b40c) ? fileURLToPath(_0x48b40c) : _0x48b40c : pathToFileURL(_0x48b40c).toString();
};
global.__dirname = function dirname(_0x452b7f) {
  return _0x348971.dirname(global.__filename(_0x452b7f, true));
};
global.__require = function require(_0x1b2a36 = import.meta.url) {
  return createRequire(_0x1b2a36);
};
import 'ws';
import { readdirSync, existsSync, readFileSync, watch } from 'fs';
import _0x120439 from 'yargs';
import { spawn } from 'child_process';
import _0x193c66 from 'lodash';
import 'console';
import _0x1cea2a from 'cfonts';
import _0x38dce6 from 'syntax-error';
import 'os';
import _0x5240eb from 'chalk';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import _0x5aff67 from 'pino';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
const {
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  PHONENUMBER_MCC
} = await import("@adiwajshing/baileys");
const {
  chain
} = _0x193c66;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
protoType();
serialize();
global.API = (_0x5aac03, _0x36ca01 = '/', _0x4c1670 = {}, _0x1b4fde) => (_0x5aac03 in global.APIs ? global.APIs[_0x5aac03] : _0x5aac03) + _0x36ca01 + (_0x4c1670 || _0x1b4fde ? '?' + new URLSearchParams(Object.entries({
  ..._0x4c1670,
  ...(_0x1b4fde ? {
    [_0x1b4fde]: global.APIKeys[_0x5aac03 in global.APIs ? global.APIs[_0x5aac03] : _0x5aac03]
  } : {})
})) : '');
global.timestamp = {
  'start': new Date()
};
const __dirname = global.__dirname(import.meta.url);
global.opts = new Object(_0x120439(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts.prefix || "â€ŽxzXZ/i!#$%+Â£Â¢â‚¬Â¥^Â°=Â¶âˆ†Ã—Ã·Ï€âˆšâœ“Â©Â�?:;?&.\\-").replace(/[|\\{}()[\]^$+*?.\-\^]/g, "\\$&") + ']');
global.db = new Low(/https?:\/\//.test(opts.db || '') ? new cloudDBAdapter(opts.db) : /mongodb(\+srv)?:\/\//i.test(opts.db) ? opts.mongodbv2 ? new mongoDBV2(opts.db) : new mongoDB(opts.db) : new JSONFile((opts._[0] ? opts._[0] + '_' : '') + "database.json"));
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise(_0x45fcfd => setInterval(async function () {
      if (!global.db.READ) {
        clearInterval(this);
        _0x45fcfd(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1000));
  }
  if (global.db.data !== null) {
    return;
  }
  global.db.READ = true;
  await global.db.read()["catch"](console.error);
  global.db.READ = null;
  global.db.data = {
    'users': {},
    'chats': {},
    'stats': {},
    'msgs': {},
    'banned': {},
    'sticker': {},
    'settings': {},
    ...(global.db.data || {})
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();
global.authFile = '' + (opts._[0] || "sessions");
console.log("Load AuthFile from " + authFile);
const {
  state,
  saveCreds
} = await useMultiFileAuthState(global.authFile);
const {
  version,
  isLatest
} = await fetchLatestBaileysVersion();
console.log("using WA v" + version.join('.') + ", isLatest: " + isLatest);
const pairingCode = process.argv.includes("--pairing");
const connectionOptions = {
  'version': version,
  'logger': _0x5aff67({
    'level': "silent"
  }),
  'printQRInTerminal': !pairingCode,
  'browser': browser,
  'downloadHistory': false,
  'generateHighQualityLinkPreview': true,
  'defaultQueryTimeoutMs': undefined,
  'auth': {
    'creds': state.creds,
    'keys': makeCacheableSignalKeyStore(state.keys, _0x5aff67().child({
      'stream': "store"
    }))
  }
};
global.conn = makeWASocket(connectionOptions);
conn.isInit = false;
if (!opts.test) {
  setInterval(async () => {
    if (global.db.data) {
      await global.db.write()["catch"](console.error);
    }
  }, 60000);
}
if (opts.server) {
  (await import("./server.js"))["default"](global.conn, PORT);
}
async function connectionUpdate(_0x4f58e8) {
  const {
    receivedPendingNotifications: _0x262680,
    connection: _0x4f1e84,
    lastDisconnect: _0x169586,
    isOnline: _0x37cd0f,
    isNewLogin: _0x1d22c1
  } = _0x4f58e8;
  if (_0x1d22c1) {
    conn.isInit = true;
  }
  if (_0x4f1e84 == "connecting") {
    console.log(_0x5240eb.redBright("Activating Bot, Please wait a moment..."));
  }
  if (_0x4f1e84 == "open") {
    console.log(_0x5240eb.green("Connected"));
  }
  if (_0x37cd0f == true) {
    console.log(_0x5240eb.green("Active Status"));
  }
  if (_0x37cd0f == false) {
    console.log(_0x5240eb.red("Disconnected Status"));
  }
  if (_0x262680) {
    console.log(_0x5240eb.yellow("Waiting for New Message"));
    const _0x1d1256 = "┌  • *X M Y U L A - C O N E C T I O N*\n│  ◦ *Name:* " + global.info.namebot + "\n│  ◦ *Nomor:* " + global.info.nomorbot + "\n╰  • *SourceBy:* https://github.com/XM4ZE/XMYULA-MD\n\n*Connected time*: " + new Date().toLocaleString();
    conn.sendMessage("33189313151@s.whatsapp.net", {
      'text': _0x1d1256
    });
  }
  if (_0x4f1e84 == "close") {
    console.log(_0x5240eb.red("Connection lost & trying to reconnect..."));
  }
  global.timestamp.connect = new Date();
  if (_0x169586 && _0x169586.error && _0x169586.error.output && _0x169586.error.output.statusCode !== DisconnectReason.loggedOut) {
    console.log(_0x5240eb.red("Connecting..."));
    await global.reloadHandler(true);
  }
  if (global.db.data == null) {
    await global.loadDatabase();
  }
}
process.on("uncaughtException", console.error);
let isInit = true;
let handler = await import("./handler.js");
global.reloadHandler = async function (_0x2a5825) {
  try {
    const _0x427c12 = await import("./handler.js?update=" + Date.now())["catch"](console.error);
    if (Object.keys(_0x427c12 || {}).length) {
      handler = _0x427c12;
    }
  } catch (_0x489345) {
    console.error(_0x489345);
  }
  if (_0x2a5825) {
    const _0xa6f645 = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch {}
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, {
      'chats': _0xa6f645
    });
    isInit = true;
  }
  if (!isInit) {
    conn.ev.off("messages.upsert", conn.handler);
    conn.ev.off("group-participants.update", conn.participantsUpdate);
    conn.ev.off("groups.update", conn.groupsUpdate);
    conn.ev.off("message.delete", conn.onDelete);
    conn.ev.off("connection.update", conn.connectionUpdate);
    conn.ev.off("creds.update", conn.credsUpdate);
  }
  conn.welcome = "*@user*\n*𝚑𝚊𝚜 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙*\n\n𝙱𝚎𝚏𝚘𝚛𝚎 𝚝𝚑𝚊𝚝, 𝚍𝚘𝚗𝚝 𝚏𝚘𝚛𝚐𝚎𝚝 𝚝𝚘 𝚛𝚎𝚊𝚍 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙 𝚛𝚞𝚕𝚎𝚜";
  conn.bye = "*@user* *𝚑𝚊𝚜 𝚕𝚎𝚏𝚝 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙*";
  conn.spromote = "@user sekarang admin!";
  conn.sdemote = "@user sekarang bukan admin!";
  conn.sDesc = "Deskripsi telah diubah ke \n@desc";
  conn.sSubject = "Judul grup telah diubah ke \n@subject";
  conn.sIcon = "Icon grup telah diubah!";
  conn.sRevoke = "Link group telah diubah ke \n@revoke";
  conn.handler = handler.handler.bind(global.conn);
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
  conn.onDelete = handler.deleteUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn);
  conn.ev.on("messages.upsert", conn.handler);
  conn.ev.on("group-participants.update", conn.participantsUpdate);
  conn.ev.on("groups.update", conn.groupsUpdate);
  conn.ev.on("message.delete", conn.onDelete);
  conn.ev.on("connection.update", conn.connectionUpdate);
  conn.ev.on("creds.update", conn.credsUpdate);
  isInit = false;
  return true;
};
const pluginFolder = global.__dirname(join(__dirname, "./plugins/index"));
const pluginFilter = _0x413f4a => /\.js$/.test(_0x413f4a);
global.plugins = {};
async function filesInit() {
  for (let _0x305921 of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      let _0x5323dc = global.__filename(join(pluginFolder, _0x305921));
      const _0x8b37e3 = await import(_0x5323dc);
      global.plugins[_0x305921] = _0x8b37e3["default"] || _0x8b37e3;
    } catch (_0x38bbb0) {
      conn.logger.error(_0x38bbb0);
      delete global.plugins[_0x305921];
    }
  }
}
filesInit().then(_0x155425 => console.log(Object.keys(global.plugins)))["catch"](console.error);
global.reload = async (_0x5f4268, _0x162abc) => {
  if (/\.js$/.test(_0x162abc)) {
    let _0x2a4ab4 = global.__filename(join(pluginFolder, _0x162abc), true);
    if (_0x162abc in global.plugins) {
      if (existsSync(_0x2a4ab4)) {
        conn.logger.info("re - require plugin '" + _0x162abc + "'");
      } else {
        conn.logger.warn("deleted plugin '" + _0x162abc + "'");
        return delete global.plugins[_0x162abc];
      }
    } else {
      conn.logger.info("requiring new plugin '" + _0x162abc + "'");
    }
    let _0x5b30b2 = _0x38dce6(readFileSync(_0x2a4ab4), _0x162abc, {
      'sourceType': "module",
      'allowAwaitOutsideFunction': true
    });
    if (_0x5b30b2) {
      conn.logger.error("syntax error while loading '" + _0x162abc + "'\n" + format(_0x5b30b2));
    } else {
      try {
        const _0x4ce8ec = await import(global.__filename(_0x2a4ab4) + "?update=" + Date.now());
        global.plugins[_0x162abc] = _0x4ce8ec["default"] || _0x4ce8ec;
      } catch (_0x3f71c8) {
        conn.logger.error("error require plugin '" + _0x162abc + "\n" + format(_0x3f71c8) + "'");
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([_0x3e34f3], [_0x1e1705]) => _0x3e34f3.localeCompare(_0x1e1705)));
      }
    }
  }
};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();
async function _quickTest() {
  let _0xae1133 = await Promise.all([spawn("ffmpeg"), spawn("ffprobe"), spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-filter_complex", "color", "-frames:v", '1', '-f', "webp", '-']), spawn("convert"), spawn("magick"), spawn('gm'), spawn("find", ["--version"])].map(_0x505d77 => {
    return Promise.race([new Promise(_0x1ae41f => {
      _0x505d77.on("close", _0x29ce68 => {
        _0x1ae41f(_0x29ce68 !== 127);
      });
    }), new Promise(_0x4e6f33 => {
      _0x505d77.on("error", _0x5e7dfc => _0x4e6f33(false));
    })]);
  }));
  let [_0x365d48, _0xff2e8f, _0x6dbecc, _0xed0e1e, _0x2e2d81, _0x3dfd38, _0x4a2f5e] = _0xae1133;
  console.log(_0xae1133);
  let _0xaa2d75 = global.support = {
    'ffmpeg': _0x365d48,
    'ffprobe': _0xff2e8f,
    'ffmpegWebp': _0x6dbecc,
    'convert': _0xed0e1e,
    'magick': _0x2e2d81,
    'gm': _0x3dfd38,
    'find': _0x4a2f5e
  };
  Object.freeze(global.support);
  if (!_0xaa2d75.ffmpeg) {
    conn.logger.warn("Please install ffmpeg for sending videos (pkg install ffmpeg)");
  }
  if (_0xaa2d75.ffmpeg && !_0xaa2d75.ffmpegWebp) {
    conn.logger.warn("Stickers may not animated without libwebp on ffmpeg (--enable-ibwebp while compiling ffmpeg)");
  }
  if (!_0xaa2d75.convert && !_0xaa2d75.magick && !_0xaa2d75.gm) {
    conn.logger.warn("Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)");
  }
}
_quickTest().then(() => conn.logger.info("☑️ Quick Test Done"))["catch"](console.error);
import _0x15f988 from 'readline';
const sleep = _0x5730ab => {
  return new Promise(_0x361ed3 => setTimeout(_0x361ed3, _0x5730ab));
};
const rl = _0x15f988.createInterface({
  'input': process.stdin,
  'output': process.stdout
});
const question = _0x3364bc => new Promise(_0x1d4d71 => rl.question(_0x3364bc, _0x1d4d71));
if (pairingCode && !conn.authState.creds.registered) {
  await sleep(7000);
  console.clear();
  _0x1cea2a.say("\nPAIRING CODE\n", {
    'font': "tiny",
    'align': "left",
    'gradient': ["red", "blue"]
  });
  console.log(_0x5240eb.bold.white("━━━━━━━━━━━ https://github.com/XM4ZE ━━━━━━━━━━━"));
  console.log(_0x5240eb.bold.green("\n\nEnter your number :"));
  let phoneNumber = await question(_0x5240eb.bgBlack(_0x5240eb.greenBright("> ")));
  phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (!Object.keys(PHONENUMBER_MCC).some(_0x4f6e4f => phoneNumber.startsWith(_0x4f6e4f))) {
    console.log(_0x5240eb.bold.red("ENTER YOUR NUMBER CORRECTLY START WITH COUNTRY CODE !!!"));
    console.log(_0x5240eb.bold.green("\nEnter your number :"));
    phoneNumber = await question(_0x5240eb.bgBlack(_0x5240eb.greenBright('>')));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
  }
  let code = await conn.requestPairingCode(phoneNumber);
  code = code?.["match"](/.{1,4}/g)?.["join"]('-') || code;
  console.log(_0x5240eb.bold.green("Your link code : "), _0x5240eb.bold.yellow(code));
  rl.close();
}
  
