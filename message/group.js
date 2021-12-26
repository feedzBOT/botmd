"use strict";
const {
	MessageType,
	Presence
} = require("@adiwajshing/baileys-md");
const fs = require("fs");

const { getBuffer, sleep } = require("../lib/myfunc");

let setting = JSON.parse(fs.readFileSync('./config.json'));
let { botName } = setting

module.exports = async(conn, anj, welcome, left) => {
    const isWelcome = welcome.includes(anj.jid)
    const isLeft = left.includes(anj.jid)
    const mdata = await conn.groupMetadata(anj.jid)
    const groupName = mdata.subject

    if (anj.action === 'add'){
        if (anj.participants[0] === conn.user.jid){
            await sleep(5000)
            conn.updatePresence(anj.jid, Presence.composing)
            conn.sendMessage(anj.jid, `Hai aku ${botName}, silahkan kirim #menu`, MessageType.text)
        } else if (isWelcome){
            try {
                var pic = await conn.getProfilePicture(anj.participants[0])
            } catch {
                var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
            conn.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `Hai @${anj.participants[0].split("@")[0]}, selamat datang di ${groupName}`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
        }
    } else if (anj.action === 'remove' && isLeft){
        try {
            var pic = await conn.getProfilePicture(anj.participants[0])
        } catch {
            var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
        }
        conn.sendMessage(anj.jid, await getBuffer(pic), MessageType.image, {caption: `Sayonara @${anj.participants[0].split("@")[0]}`, contextInfo: {"mentionedJid": [anj.participants[0]]}})
    }
}
