const moment = require("moment-timezone");
const fs = require("fs");
let setting = JSON.parse(fs.readFileSync('./config.json'))
const { getLimit, getBalance, cekGLimit } = require("../lib/limit")

const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

function toCommas(x) {
	x = x.toString()
	var pattern = /(-?\d+)(\d{3})/;
     while (pattern.test(x))
	   x = x.replace(pattern, "$1,$2");
	return x;
}

exports.allmenu = (sender, prefix, pushname, isOwner, isPremium, balance, limit, limitCount, glimit, gcount, ucselamat, tungmun, hit, ckreg) => {
	return `*── 「 Simpel WhatsApp Bot 」 ──*

_*${ucselamat} ${pushname !== undefined ? pushname : 'Kak'}*_

*</ INFO BOT >*
Library : *Baileys MD*
Language : *Javascript*
Platform : *Node.js*
Database : *Mongodb*
Versi Bot : *v0.0.2*
Prefix : *「 ${prefix} 」*
Status : *Aktif* || *Public*
Total Hit : *${hit}*
Total User : *${ckreg}*
Tanggal : *${moment.tz('Asia/Jakarta').format('DD/MM/YY')}*
Waktu : *${moment.tz('Asia/Jakarta').format('HH:mm:ss')}*

*</ INFO USER >*
Status : *${isOwner ? 'Pemilik bot' : isPremium ? 'Premium' : 'Free'}*
Balance : *$${toCommas(getBalance(sender, balance))}*
Limit Harian : *${isOwner ? '-' : isPremium ? 'Unlimited' : getLimit(sender, limitCount, limit)}*
Limit Game : *${isOwner ? '-' : cekGLimit(sender, gcount, glimit)}*

*Hitung mundur Tahun baru*
_${tungmun}_
${readmore}
*</ MAIN MENU >*
  • ${prefix}menu
  • ${prefix}owner
  • ${prefix}donasi
  • ${prefix}speed
  • ${prefix}runtime
  • ${prefix}cekprem
  • ${prefix}listprem

*</ CONVERTER MENU >*
  • ${prefix}sticker
  • ${prefix}toimg
  • ${prefix}tovid

*</ DOWNLOADER MENU >*
  • ${prefix}play
  • ${prefix}tiktok
  • ${prefix}ytmp4
  • ${prefix}ytmp3
  • ${prefix}getvideo
  • ${prefix}getmusic
  • ${prefix}instagram
  • ${prefix}facebook

*</ RANDOM MENU >*
  • ${prefix}quote
  • ${prefix}cecan
  • ${prefix}cogan

*</ SEARCHING MENU >*
  • ${prefix}lirik
  • ${prefix}grupwa
  • ${prefix}ytsearch

*</ GAME MENU >*
  • ${prefix}tictactoe [ERROR]
  • ${prefix}delttc
  • ${prefix}tebakgambar

*</ LIMIT & BALANCE >*
  • ${prefix}buylimit
  • ${prefix}buyglimit
  • ${prefix}transfer
  • ${prefix}limit
  • ${prefix}balance

*</ GROUP MENU >*
  • ${prefix}linkgrup
  • ${prefix}setppgrup
  • ${prefix}setnamegc
  • ${prefix}setdesc
  • ${prefix}group
  • ${prefix}revoke
  • ${prefix}hidetag
  • ${prefix}antilink on/off
  • ${prefix}antiwame on/off

*</ OWNER MENU >*
  • ${prefix}setppbot
  • ${prefix}exif
  • ${prefix}leave
  • ${prefix}addprem
  • ${prefix}delprem
  •「 > 」eval
  •「 x 」eval async
  •「 $ 」terminal / Executor
`
}
