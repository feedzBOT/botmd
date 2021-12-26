"use strict";
const {
	default: makeWASocket,
	BufferJSON,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
	useSingleFileAuthState,
	delay
} = require("@adiwajshing/baileys-md")
const figlet = require("figlet");
const fs = require("fs");
const cluster = require('cluster');
const moment = require('moment')
const chalk = require('chalk')
const logg = require('pino')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const clui = require('clui')
const { Spinner } = clui
const db = require('./lib/database')
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const { serialize } = require("./lib/myfunc");
const { color, mylog, infolog } = require("./lib/color");
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')
let setting = JSON.parse(fs.readFileSync('./config.json'));
let session = `./${setting.sessionName}.json`
require("http").createServer((_, res) => res.end("Uptime!")).listen(8080)
const { state, saveState } = useSingleFileAuthState(session)

function title() {
      console.clear()
	  console.log(chalk.bold.green(figlet.textSync('WhatsApp Bot Multi Device', {
		font: 'Standard',
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	})))
	console.log(chalk.yellow(`\n                        ${chalk.yellow('[ Created By AdiOfficiall ]')}\n\n${chalk.red('Bot Adi')} : ${chalk.white('WhatsApp Bot Multi Device')}\n${chalk.red('Follow Insta Dev')} : ${chalk.white('@ff_patr1ck')}\n${chalk.red('Message Me On WhatsApp')} : ${chalk.white('+62 895-0458-5790')}\n${chalk.red('Donate')} : ${chalk.white('089504585790 ( Gopay/Pulsa )')}\n`))
}

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
	console.log(`Module ${module} sedang diperhatikan terhadap perubahan`) 
	fs.watchFile(require.resolve(module), async () => {
		await uncache(require.resolve(module))
		cb(module)
	})
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

const status = new Spinner(chalk.cyan(` Booting WhatsApp Bot`))
const starting = new Spinner(chalk.cyan(` Preparing After Connect`))
const reconnect = new Spinner(chalk.redBright(` Reconnecting WhatsApp Bot`))

const connectToWhatsApp = async () => {
	const conn = makeWASocket({ printQRInTerminal: true, logger: logg({ level: 'fatal' }), auth: state })
	title()
	
	/* Auto Update */
	require('./message/help')
	require('./lib/myfunc')
	require('./message/msg')
	nocache('./message/help', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./lib/myfunc', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	nocache('./message/msg', module => console.log(chalk.greenBright('[ WHATSAPP BOT ]  ') + time + chalk.cyanBright(` "${module}" Telah diupdate!`)))
	
	conn.multi = true
	conn.nopref = false
	conn.prefa = 'anjing'
	conn.ev.on('messages.upsert', async m => {
		if (!m.messages) return;
		var msg = m.messages[0]
		msg = serialize(conn, msg)
		msg.isBaileys = msg.key.id.startsWith('BAE5') || msg.key.id.startsWith('3EB0')
		require('./message/msg')(conn, msg, m, setting, db)
	})
///gatau
conn.on('group-participants.update', async (anu) => {
		if (!welkom.includes(anu.jid)) return
		try {
			const mdata = await conn.groupMetadata(anu.jid)
			console.log(anu)
			if (anu.action == 'add') {
				num = anu.participants[0]
				try {
					ppimg = await conn.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://e.top4top.io/p_1837nveac0.jpg'
				}
				teks = `Hai @${num.split('@')[0]} \Selamat datang di group *${mdata.subject}* 
╭━━━━━━━━━━━━━
│【♡ۣۜۜ፝͜͜͡͡✿➣ *NAME:*
│【♡ۣۜۜ፝͜͜͡͡✿➣ *UMUR:*
│【♡ۣۜۜ፝͜͜͡͡✿➣ *ASKOT:*
│【♡ۣۜۜ፝͜͜͡͡✿➣ *GENDER:*
│【♡ۣۜۜ፝͜͜͡͡✿➣ *INSTAGRAM:*
│【♡ۣۜۜ፝͜͜͡͡✿➣ *FAVORIT:*
│【♡ۣۜۜ፝͜͜͡͡✿➣ *HOBBY:*
╰━━━━━━━━━━━━━
  *[NOTE]*\n\nBaca Deskripsi Grup Kawand!`
				let buffer = await getBuffer(ppimg)
				conn.sendMessage(mdata.id, buffer, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			} else if (anu.action == 'remove') {
				num = anu.participants[0]
				try {
					ppimg = await conn.getProfilePicture(`${num.split('@')[0]}@c.us`)
				} catch {
					ppimg = 'https://e.top4top.io/p_1837nveac0.jpg'
				}
				teks = `*「 🚮 」Bacakan Ya-siin Buat Saudara Kita Yang Keluar Dari Group, Semoga Amal Dan Ibadahnya Di Terima Di Sisi Tuhan...*@${num.split('@')[0]}`
				let buffer = await getBuffer(ppimg)
				conn.sendMessage(mdata.id, buffer, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
			}
		} catch (e) {
			console.log('Error : %s', color(e, 'red'))
		}
	})
	conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log(mylog('connection closed, try to restart'))
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut 
            ? connectToWhatsApp()
            : console.log(mylog('Wa web terlogout.'))
        }
    })
	conn.ev.on('creds.update', () => saveState)

	return conn
}

connectToWhatsApp()
let server = app.listen(PORT, () => console.log(`Listening On Port ${PORT}`))
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    /*for (let i = 0; i < 1; i++) {
        cluster.fork();
    }*/
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
}
