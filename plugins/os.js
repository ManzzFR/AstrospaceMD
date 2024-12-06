import os from 'os'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
  const sistemInfo = await getSystemInfo()
  getVersions((versi) => {
    getBatteryInfo((statusBaterai) => {
      getStorageInfo((infoPenyimpanan) => {
        getLinuxInfo((infoLinux) => {
          let txt = `> *📊 Informasi Sistem*\n\n`
          txt += `- 🌐 *Platform*: _${sistemInfo.platform}_\n`
          txt += `- 💻 *Arsitektur CPU*: ${sistemInfo.cpuArch}\n`
          txt += `- 🧠 *Jumlah CPU*: ${sistemInfo.cpus}\n`
          txt += `- 🗄️ *Memori Total*: ${sistemInfo.totalMemory}\n`
          txt += `- 🗃️ *Memori Bebas*: ${sistemInfo.freeMemory}\n`
          txt += `- ⏱️ *Waktu Aktif*: ${sistemInfo.uptime}\n`
          txt += `- 📀 *Versi OS*: ${sistemInfo.osVersion}\n`
          txt += `- 📊 *Rata-rata Beban (1, 5, 15 menit)*: ${sistemInfo.loadAverage}\n`
          txt += `- 🔋 *Energi*: ${statusBaterai}\n\n`

          txt += `> *💾 Penyimpanan*\n`
          txt += `${infoPenyimpanan}\n\n`

          txt += `> *🛠️ Versi Alat*\n\n`
          txt += `- ☕ *Node.js*: ${versi.nodeVersion.trim()}\n`
          txt += `- 📦 *NPM*: ${versi.npmVersion.trim()}\n`
          txt += `- 🎥 *FFmpeg*: ${versi.ffmpegVersion.split('\n')[0]}\n`
          txt += `- 🐍 *Python*: ${versi.pythonVersion.trim()}\n`
          txt += `- 📦 *PIP*: ${versi.pipVersion.trim()}\n`
          txt += `- 🍫 *Chocolatey*: ${versi.chocoVersion.trim()}\n\n`

          if (os.platform() === 'linux') {
            txt += `> *🐧 Distribusi Linux*\n${infoLinux}\n`
          }

          m.reply(txt)
        })
      })
    })
  })
}

handler.help = ["os"]
handler.tags = ["info"]
handler.command = /^(os)$/i

export default handler

function formatUptime(uptime) {
  const detik = Math.floor(uptime % 60)
  const menit = Math.floor((uptime / 60) % 60)
  const jam = Math.floor((uptime / 3600) % 24)
  return `${jam} jam, ${menit} menit, ${detik} detik`
}

function getVersions(callback) {
  exec('node -v', (err, nodeVersion) => {
    if (err) nodeVersion = '✖️'
    exec('npm -v', (err, npmVersion) => {
      if (err) npmVersion = '✖️'
      exec('ffmpeg -version', (err, ffmpegVersion) => {
        if (err) ffmpegVersion = '✖️'
        exec('python --version || python3 --version || py --version', (err, pythonVersion) => {
          if (err) pythonVersion = '✖️'
          exec('pip --version || pip3 --version', (err, pipVersion) => {
            if (err) pipVersion = '✖️'
            exec('choco -v', (err, chocoVersion) => {
              if (err) chocoVersion = '✖️'
              callback({ nodeVersion, npmVersion, ffmpegVersion, pythonVersion, pipVersion, chocoVersion })
            })
          })
        })
      })
    })
  })
}

function getStorageInfo(callback) {
  if (os.platform() === 'win32') {
    exec('wmic logicaldisk get size,freespace,caption', (err, stdout) => {
      if (err) return callback('✖️')
      const lines = stdout.trim().split('\n').slice(1)
      const infoPenyimpanan = lines.map(line => {
        const [drive, free, total] = line.trim().split(/\s+/)
        return `🖥️ ${drive}: ${(total / (1024 ** 3)).toFixed(2)} GB total, ${(free / (1024 ** 3)).toFixed(2)} GB bebas`
      }).join('\n')
      callback(infoPenyimpanan)
    })
  } else {
    exec('df -h --output=source,size,avail,target', (err, stdout) => {
      if (err) return callback('✖️')
      const lines = stdout.trim().split('\n').slice(1)
      const infoPenyimpanan = lines.map(line => {
        const [device, total, free, mount] = line.trim().split(/\s+/)
        return `🖥️ ${mount}: ${total} total, ${free} bebas di ${device}`
      }).join('\n')
      callback(infoPenyimpanan)
    })
  }
}

function getLinuxInfo(callback) {
  exec('cat /etc/os-release', (err, osInfo) => {
    if (err) osInfo = '✖️'
    callback(osInfo.trim())
  })
}

function getBatteryInfo(callback) {
  if (os.platform() === 'linux' || os.platform() === 'darwin') {
    exec('upower -i $(upower -e | grep BAT)', (err, batteryInfo) => {
      if (err) return callback('✖️')
      callback(batteryInfo)
    })
  } else if (os.platform() === 'win32') {
    exec('WMIC Path Win32_Battery Get EstimatedChargeRemaining', (err, batteryInfo) => {
      if (err) return callback('✖️')
      callback(`🔋 ${batteryInfo.trim()}%`)
    })
  } else {
    callback('✖️')
  }
}

function getSystemInfo() {
  return {
    platform: os.platform(),
    cpuArch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: (os.totalmem() / (1024 ** 3)).toFixed(2) + ' GB',
    freeMemory: (os.freemem() / (1024 ** 3)).toFixed(2) + ' GB',
    uptime: formatUptime(os.uptime()),
    osVersion: os.release(),
    loadAverage: os.loadavg().map(load => load.toFixed(2)).join(', ')
  }
}