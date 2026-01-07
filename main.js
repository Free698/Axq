require('dotenv').config();

// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
  fs.readdir(customTemp, (err, files) => {
    if (err) return;
    for (const file of files) {
      const filePath = path.join(customTemp, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    }
  });
  console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./Hans_Tz/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./Hans_Tz/autoread');

// Command imports
const tagAllCommand = require('./Hans_Tz/tagall');
const helpCommand = require('./Hans_Tz/help');
const banCommand = require('./Hans_Tz/ban');
const { promoteCommand } = require('./Hans_Tz/promote');
const { demoteCommand } = require('./Hans_Tz/demote');
const muteCommand = require('./Hans_Tz/mute');
const unmuteCommand = require('./Hans_Tz/unmute');
const stickerCommand = require('./Hans_Tz/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./Hans_Tz/warn');
const warningsCommand = require('./Hans_Tz/warnings');
const ttsCommand = require('./Hans_Tz/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./Hans_Tz/tictactoe');
const { incrementMessageCount, topMembers } = require('./Hans_Tz/topmembers');
const ownerCommand = require('./Hans_Tz/owner');
const deleteCommand = require('./Hans_Tz/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./Hans_Tz/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./Hans_Tz/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./Hans_Tz/mention');
const memeCommand = require('./Hans_Tz/meme');
const tagCommand = require('./Hans_Tz/tag');
const tagNotAdminCommand = require('./Hans_Tz/tagnotadmin');
const hideTagCommand = require('./Hans_Tz/hidetag');
const jokeCommand = require('./Hans_Tz/joke');
const quoteCommand = require('./Hans_Tz/quote');
const factCommand = require('./Hans_Tz/fact');
const weatherCommand = require('./Hans_Tz/weather');
const newsCommand = require('./Hans_Tz/news');
const kickCommand = require('./Hans_Tz/kick');
const simageCommand = require('./Hans_Tz/simage');
const attpCommand = require('./Hans_Tz/attp');
const { startHangman, guessLetter } = require('./Hans_Tz/hangman');
const { startTrivia, answerTrivia } = require('./Hans_Tz/trivia');
const { complimentCommand } = require('./Hans_Tz/compliment');
const { insultCommand } = require('./Hans_Tz/insult');
const { eightBallCommand } = require('./Hans_Tz/eightball');
const { lyricsCommand } = require('./Hans_Tz/lyrics');
const { dareCommand } = require('./Hans_Tz/dare');
const { truthCommand } = require('./Hans_Tz/truth');
const { clearCommand } = require('./Hans_Tz/clear');
const pingCommand = require('./Hans_Tz/ping');
const aliveCommand = require('./Hans_Tz/alive');
const blurCommand = require('./Hans_Tz/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./Hans_Tz/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./Hans_Tz/goodbye');
const githubCommand = require('./Hans_Tz/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./Hans_Tz/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./Hans_Tz/chatbot');
const takeCommand = require('./Hans_Tz/take');
const { flirtCommand } = require('./Hans_Tz/flirt');
const characterCommand = require('./Hans_Tz/character');
const wastedCommand = require('./Hans_Tz/wasted');
const shipCommand = require('./Hans_Tz/ship');
const groupInfoCommand = require('./Hans_Tz/groupinfo');
const resetlinkCommand = require('./Hans_Tz/resetlink');
const staffCommand = require('./Hans_Tz/staff');
const unbanCommand = require('./Hans_Tz/unban');
const emojimixCommand = require('./Hans_Tz/emojimix');
const { handlePromotionEvent } = require('./Hans_Tz/promote');
const { handleDemotionEvent } = require('./Hans_Tz/demote');
const viewOnceCommand = require('./Hans_Tz/viewonce');
const clearSessionCommand = require('./Hans_Tz/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./Hans_Tz/autostatus');
const { simpCommand } = require('./Hans_Tz/simp');
const { stupidCommand } = require('./Hans_Tz/stupid');
const stickerTelegramCommand = require('./Hans_Tz/stickertelegram');
const textmakerCommand = require('./Hans_Tz/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./Hans_Tz/antidelete');
const clearTmpCommand = require('./Hans_Tz/cleartmp');
const setProfilePicture = require('./Hans_Tz/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./Hans_Tz/groupmanage');
const instagramCommand = require('./Hans_Tz/instagram');
const facebookCommand = require('./Hans_Tz/facebook');
const spotifyCommand = require('./Hans_Tz/spotify');
const playCommand = require('./Hans_Tz/play');
const tiktokCommand = require('./Hans_Tz/tiktok');
const songCommand = require('./Hans_Tz/song');
const aiCommand = require('./Hans_Tz/ai');
const urlCommand = require('./Hans_Tz/url');
const { handleTranslateCommand } = require('./Hans_Tz/translate');
const { handleSsCommand } = require('./Hans_Tz/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./Hans_Tz/goodnight');
const { shayariCommand } = require('./Hans_Tz/shayari');
const { rosedayCommand } = require('./Hans_Tz/roseday');
const imagineCommand = require('./Hans_Tz/imagine');
const videoCommand = require('./Hans_Tz/video');
const sudoCommand = require('./Hans_Tz/sudo');
const { miscCommand, handleHeart } = require('./Hans_Tz/misc');
const { animeCommand } = require('./Hans_Tz/anime');
const { piesCommand, piesAlias } = require('./Hans_Tz/pies');
const stickercropCommand = require('./Hans_Tz/stickercrop');
const updateCommand = require('./Hans_Tz/update');
const removebgCommand = require('./Hans_Tz/removebg');
const { reminiCommand } = require('./Hans_Tz/remini');
const { igsCommand } = require('./Hans_Tz/igs');
const { anticallCommand, readState: readAnticallState } = require('./Hans_Tz/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./Hans_Tz/pmblocker');
const settingsCommand = require('./Hans_Tz/settings');
const soraCommand = require('./Hans_Tz/sora');

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029Vb7JRfvCRs1gTmsCB812";
global.ytch = "Mr Unique Hacker";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363421513037430@newsletter',
            newsletterName: 'Vortex-Xmd',
            serverMessageId: -1
        }
    }
};

// Function to check if a message is a command (WITH PREFIX from settings)
function isCommand(message) {
    const prefix = settings.Botprefix || '.';
    
    // Check if message starts with prefix
    if (!message.toLowerCase().startsWith(prefix.toLowerCase())) {
        return false;
    }
    
    const commands = [
        'help', 'menu', 'list', 'bot',
        'kick', 'mute', 'unmute', 'ban', 'unban',
        'sticker', 's', 'warnings', 'warn', 'tts',
        'delete', 'del', 'attp', 'settings', 'mode',
        'anticall', 'pmblocker', 'owner',
        'tagall', 'tagnotadmin', 'hidetag', 'tag',
        'antilink', 'antitag', 'meme', 'joke', 'quote',
        'fact', 'weather', 'news', 'ttt', 'tictactoe',
        'move', 'topmembers', 'hangman', 'guess', 'trivia',
        'answer', 'compliment', 'insult', '8ball',
        'lyrics', 'simp', 'stupid', 'itssostupid', 'iss',
        'dare', 'truth', 'clear', 'promote', 'demote',
        'ping', 'alive', 'mention', 'setmention',
        'blur', 'welcome', 'goodbye', 'git', 'github',
        'sc', 'script', 'repo', 'antibadword',
        'chatbot', 'take', 'steal', 'flirt',
        'character', 'waste', 'ship', 'groupinfo',
        'infogp', 'infogrupo', 'resetlink', 'revoke',
        'anularlink', 'staff', 'admins', 'listadmin',
        'tourl', 'url', 'emojimix', 'emix',
        'tg', 'stickertelegram', 'tgsticker', 'telesticker',
        'vv', 'clearsession', 'clearsesi', 'autostatus',
        'metallic', 'ice', 'snow', 'impressive', 'matrix',
        'light', 'neon', 'devil', 'purple', 'thunder',
        'leaves', '1917', 'arena', 'hacker', 'sand',
        'blackpink', 'glitch', 'fire', 'antidelete',
        'surrender', 'cleartmp', 'setpp', 'setgdesc',
        'setgname', 'setgpp', 'instagram', 'insta', 'ig',
        'igsc', 'igs', 'fb', 'facebook', 'music',
        'spotify', 'play', 'mp3', 'ytmp3', 'song',
        'video', 'ytmp4', 'tiktok', 'tt', 'gpt',
        'gemini', 'translate', 'trt', 'ss', 'ssweb',
        'screenshot', 'areact', 'autoreact', 'autoreaction',
        'sudo', 'goodnight', 'lovenight', 'gn', 'shayari',
        'shayri', 'roseday', 'imagine', 'flux', 'dalle',
        'jid', 'autotyping', 'autoread', 'heart',
        'horny', 'circle', 'lgbt', 'lolice', 'simpcard',
        'tonikawa', 'its-so-stupid', 'namecard',
        'oogway2', 'oogway', 'tweet', 'ytcomment',
        'comrade', 'gay', 'glass', 'jail', 'passed',
        'triggered', 'animu', 'nom', 'poke', 'cry',
        'kiss', 'pat', 'hug', 'wink', 'facepalm',
        'face-palm', 'animuquote', 'loli', 'crop',
        'pies', 'china', 'indonesia', 'japan', 'korea',
        'hijab', 'update', 'removebg', 'rmbg', 'nobg',
        'remini', 'enhance', 'upscale', 'sora',
        'simage'
    ];
    
    // Remove prefix and get the first word (command)
    const messageWithoutPrefix = message.slice(prefix.length).trim().toLowerCase();
    const words = messageWithoutPrefix.split(/\s+/);
    const command = words[0];
    
    return commands.includes(command);
}

// Function to extract command and arguments (with prefix removal)
function extractCommand(message) {
    const prefix = settings.Botprefix || '.';
    
    if (!message.toLowerCase().startsWith(prefix.toLowerCase())) {
        return { command: null, args: '' };
    }
    
    // Remove prefix
    const messageWithoutPrefix = message.slice(prefix.length).trim();
    const words = messageWithoutPrefix.split(/\s+/);
    const command = words[0].toLowerCase();
    const args = words.slice(1).join(' ');
    
    return { command, args, rawCommand: command, rawArgs: args };
}

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;
            
            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, { 
                    text: '📢 *Join our Channel:*\nhttps://whatsapp.com/channel/0029Vb7JRfvCRs1gTmsCB812' 
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./Hans_Tz/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, { 
                    text: `🔗 *Support*\n\nhttps://chat.whatsapp.com/LYPIzD6WvZtL279cuKsJFw?mode=hqrc` 
                }, { quoted: message });
                return;
            }
        }

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        );

        // Preserve raw message for commands
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // Check if message is a command (WITH PREFIX from settings)
        const isCmd = isCommand(rawText);
        
        // Only log command usage
        if (isCmd) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${rawText}`);
        }
        
        // Read bot mode once
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
        }
        
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !rawText.toLowerCase().startsWith(settings.Botprefix + 'unban')) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words and antilink FIRST, before ANY other processing
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Then check for command (WITH PREFIX from settings)
        if (!isCmd) {
            // Show typing indicator if autotyping is enabled
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);
                
                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        // Get command and arguments (with prefix removal)
        const { command, args } = extractCommand(rawText);
        
        if (!command) {
            return; // Not a valid command
        }

        // List of admin commands
        const adminCommands = ['mute', 'unmute', 'ban', 'unban', 'promote', 'demote', 'kick', 'tagall', 'tagnotadmin', 'hidetag', 'antilink', 'antitag', 'setgdesc', 'setgname', 'setgpp'];
        const isAdminCommand = adminCommands.includes(command);

        // List of owner commands
        const ownerCommands = ['mode', 'autostatus', 'antidelete', 'cleartmp', 'setpp', 'clearsession', 'areact', 'autoreact', 'autotyping', 'autoread', 'pmblocker'];
        const isOwnerCommand = ownerCommands.includes(command);

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                command === 'mute' ||
                command === 'unmute' ||
                command === 'ban' ||
                command === 'unban' ||
                command === 'promote' ||
                command === 'demote'
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }

        // Command handlers
        let commandExecuted = false;

        switch (command) {
            case 'simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the simage command to convert it.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case 'kick':
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                commandExecuted = true;
                break;
            case 'mute':
                {
                    const words = args.split(/\s+/);
                    const muteArg = words[0];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                commandExecuted = true;
                break;
            case 'unmute':
                await unmuteCommand(sock, chatId, senderId);
                commandExecuted = true;
                break;
            case 'ban':
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use ban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'unban':
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use unban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'help':
            case 'menu':
            case 'bot':
            case 'list':
                await helpCommand(sock, chatId, message, global.channelLink);
                commandExecuted = true;
                break;
            case 'sticker':
            case 's':
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'warnings':
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                commandExecuted = true;
                break;
            case 'warn':
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                commandExecuted = true;
                break;
            case 'tts':
                const text = args;
                await ttsCommand(sock, chatId, text, message);
                commandExecuted = true;
                break;
            case 'delete':
            case 'del':
                await deleteCommand(sock, chatId, message, senderId);
                commandExecuted = true;
                break;
            case 'attp':
                await attpCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'settings':
                await settingsCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'mode':
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo }, { quoted: message });
                    return;
                }
                
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = args.toLowerCase();
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: ${settings.Botprefix}mode public/private\n\nExample:\n${settings.Botprefix}mode public - Allow everyone to use bot\n${settings.Botprefix}mode private - Restrict to owner only`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: `Usage: ${settings.Botprefix}mode public/private\n\nExample:\n${settings.Botprefix}mode public - Allow everyone to use bot\n${settings.Botprefix}mode private - Restrict to owner only`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    data.isPublic = action === 'public';
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));
                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                commandExecuted = true;
                break;
            case 'anticall':
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use anticall.' }, { quoted: message });
                    break;
                }
                await anticallCommand(sock, chatId, message, args);
                commandExecuted = true;
                break;
            case 'pmblocker':
                await pmblockerCommand(sock, chatId, message, args);
                commandExecuted = true;
                break;
            case 'owner':
                await ownerCommand(sock, chatId);
                commandExecuted = true;
                break;
            case 'tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                commandExecuted = true;
                break;
            case 'tagnotadmin':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                commandExecuted = true;
                break;
            case 'hidetag':
                {
                    const messageText = args;
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                commandExecuted = true;
                break;
            case 'tag':
                const messageText = args;
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                commandExecuted = true;
                break;
            case 'antilink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, rawText, senderId, isSenderAdmin, message);
                commandExecuted = true;
                break;
            case 'antitag':
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, rawText, senderId, isSenderAdmin, message);
                commandExecuted = true;
                break;
            case 'meme':
                await memeCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'joke':
                await jokeCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'quote':
                await quoteCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'fact':
                await factCommand(sock, chatId, message, message);
                commandExecuted = true;
                break;
            case 'weather':
                const city = args;
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: `Please specify a city, e.g., ${settings.Botprefix}weather London`, ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            case 'news':
                await newsCommand(sock, chatId);
                commandExecuted = true;
                break;
            case 'ttt':
            case 'tictactoe':
                await tictactoeCommand(sock, chatId, senderId, args);
                commandExecuted = true;
                break;
            case 'move':
                const position = parseInt(args.split(/\s+/)[0]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    // Note: You need to implement tictactoeMove function or use handleTicTacToeMove
                    await handleTicTacToeMove(sock, chatId, senderId, position.toString());
                }
                commandExecuted = true;
                break;
            case 'topmembers':
                topMembers(sock, chatId, isGroup);
                commandExecuted = true;
                break;
            case 'hangman':
                startHangman(sock, chatId);
                commandExecuted = true;
                break;
            case 'guess':
                const guessedLetter = args.split(/\s+/)[0];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: `Please guess a letter using ${settings.Botprefix}guess <letter>`, ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            case 'trivia':
                startTrivia(sock, chatId);
                commandExecuted = true;
                break;
            case 'answer':
                const answer = args;
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: `Please provide an answer using ${settings.Botprefix}answer <answer>`, ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            case 'compliment':
                await complimentCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'insult':
                await insultCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case '8ball':
                await eightBallCommand(sock, chatId, args);
                commandExecuted = true;
                break;
            case 'lyrics':
                await lyricsCommand(sock, chatId, args, message);
                commandExecuted = true;
                break;
            case 'simp':
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                commandExecuted = true;
                break;
            case 'stupid':
            case 'itssostupid':
            case 'iss':
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = args.split(/\s+/);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                commandExecuted = true;
                break;
            case 'dare':
                await dareCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'truth':
                await truthCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'clear':
                if (isGroup) await clearCommand(sock, chatId);
                commandExecuted = true;
                break;
            case 'promote':
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                commandExecuted = true;
                break;
            case 'demote':
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                commandExecuted = true;
                break;
            case 'ping':
                await pingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'alive':
                await aliveCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'mention':
                const isOwner = message.key.fromMe || senderIsSudo;
                await mentionToggleCommand(sock, chatId, message, args, isOwner);
                commandExecuted = true;
                break;
            case 'setmention':
                const isOwner2 = message.key.fromMe || senderIsSudo;
                await setMentionCommand(sock, chatId, message, isOwner2);
                commandExecuted = true;
                break;
            case 'blur':
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                commandExecuted = true;
                break;
            case 'welcome':
                if (isGroup) {
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            case 'goodbye':
                if (isGroup) {
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            case 'git':
            case 'github':
            case 'sc':
            case 'script':
            case 'repo':
                await githubCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'antibadword':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                commandExecuted = true;
                break;
            case 'chatbot':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                    return;
                }

                await handleChatbotCommand(sock, chatId, message, args);
                commandExecuted = true;
                break;
            case 'take':
            case 'steal':
                const takeArgs = args.split(/\s+/);
                await takeCommand(sock, chatId, message, takeArgs);
                commandExecuted = true;
                break;
            case 'flirt':
                await flirtCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'character':
                await characterCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'waste':
                await wastedCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'groupinfo':
            case 'infogp':
            case 'infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'resetlink':
            case 'revoke':
            case 'anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                commandExecuted = true;
                break;
            case 'staff':
            case 'admins':
            case 'listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'tourl':
            case 'url':
                await urlCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'emojimix':
            case 'emix':
                await emojimixCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'tg':
            case 'stickertelegram':
            case 'tgsticker':
            case 'telesticker':
                await stickerTelegramCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'vv':
                await viewOnceCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'clearsession':
            case 'clearsesi':
                await clearSessionCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'autostatus':
                const autostatusArgs = args.split(/\s+/);
                await autoStatusCommand(sock, chatId, message, autostatusArgs);
                commandExecuted = true;
                break;
            case 'metallic':
                await textmakerCommand(sock, chatId, message, rawText, 'metallic');
                commandExecuted = true;
                break;
            case 'ice':
                await textmakerCommand(sock, chatId, message, rawText, 'ice');
                commandExecuted = true;
                break;
            case 'snow':
                await textmakerCommand(sock, chatId, message, rawText, 'snow');
                commandExecuted = true;
                break;
            case 'impressive':
                await textmakerCommand(sock, chatId, message, rawText, 'impressive');
                commandExecuted = true;
                break;
            case 'matrix':
                await textmakerCommand(sock, chatId, message, rawText, 'matrix');
                commandExecuted = true;
                break;
            case 'light':
                await textmakerCommand(sock, chatId, message, rawText, 'light');
                commandExecuted = true;
                break;
            case 'neon':
                await textmakerCommand(sock, chatId, message, rawText, 'neon');
                commandExecuted = true;
                break;
            case 'devil':
                await textmakerCommand(sock, chatId, message, rawText, 'devil');
                commandExecuted = true;
                break;
            case 'purple':
                await textmakerCommand(sock, chatId, message, rawText, 'purple');
                commandExecuted = true;
                break;
            case 'thunder':
                await textmakerCommand(sock, chatId, message, rawText, 'thunder');
                commandExecuted = true;
                break;
            case 'leaves':
                await textmakerCommand(sock, chatId, message, rawText, 'leaves');
                commandExecuted = true;
                break;
            case '1917':
                await textmakerCommand(sock, chatId, message, rawText, '1917');
                commandExecuted = true;
                break;
            case 'arena':
                await textmakerCommand(sock, chatId, message, rawText, 'arena');
                commandExecuted = true;
                break;
            case 'hacker':
                await textmakerCommand(sock, chatId, message, rawText, 'hacker');
                commandExecuted = true;
                break;
            case 'sand':
                await textmakerCommand(sock, chatId, message, rawText, 'sand');
                commandExecuted = true;
                break;
            case 'blackpink':
                await textmakerCommand(sock, chatId, message, rawText, 'blackpink');
                commandExecuted = true;
                break;
            case 'glitch':
                await textmakerCommand(sock, chatId, message, rawText, 'glitch');
                commandExecuted = true;
                break;
            case 'fire':
                await textmakerCommand(sock, chatId, message, rawText, 'fire');
                commandExecuted = true;
                break;
            case 'antidelete':
                await handleAntideleteCommand(sock, chatId, message, args);
                commandExecuted = true;
                break;
            case 'surrender':
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                commandExecuted = true;
                break;
            case 'cleartmp':
                await clearTmpCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'setpp':
                await setProfilePicture(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'setgdesc':
                await setGroupDescription(sock, chatId, senderId, args, message);
                commandExecuted = true;
                break;
            case 'setgname':
                await setGroupName(sock, chatId, senderId, args, message);
                commandExecuted = true;
                break;
            case 'setgpp':
                await setGroupPhoto(sock, chatId, senderId, message);
                commandExecuted = true;
                break;
            case 'instagram':
            case 'insta':
            case 'ig':
                await instagramCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'igsc':
                await igsCommand(sock, chatId, message, true);
                commandExecuted = true;
                break;
            case 'igs':
                await igsCommand(sock, chatId, message, false);
                commandExecuted = true;
                break;
            case 'fb':
            case 'facebook':
                await facebookCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'music':
                await playCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'spotify':
                await spotifyCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'play':
            case 'mp3':
            case 'ytmp3':
            case 'song':
                await songCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'video':
            case 'ytmp4':
                await videoCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'tiktok':
            case 'tt':
                await tiktokCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'gpt':
            case 'gemini':
                await aiCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'translate':
            case 'trt':
                await handleTranslateCommand(sock, chatId, message, args);
                commandExecuted = true;
                break;
            case 'ss':
            case 'ssweb':
            case 'screenshot':
                await handleSsCommand(sock, chatId, message, args);
                commandExecuted = true;
                break;
            case 'areact':
            case 'autoreact':
            case 'autoreaction':
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck);
                commandExecuted = true;
                break;
            case 'sudo':
                await sudoCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'goodnight':
            case 'lovenight':
            case 'gn':
                await goodnightCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'shayari':
            case 'shayri':
                await shayariCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'roseday':
                await rosedayCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'imagine':
            case 'flux':
            case 'dalle':
                await imagineCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'jid':
                await groupJidCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'autotyping':
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'autoread':
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'heart':
                await handleHeart(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'horny':
                await miscCommand(sock, chatId, message, ['horny', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'circle':
                await miscCommand(sock, chatId, message, ['circle', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'lgbt':
                await miscCommand(sock, chatId, message, ['lgbt', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'lolice':
                await miscCommand(sock, chatId, message, ['lolice', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'simpcard':
                await miscCommand(sock, chatId, message, ['simpcard', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'tonikawa':
                await miscCommand(sock, chatId, message, ['tonikawa', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'its-so-stupid':
                await miscCommand(sock, chatId, message, ['its-so-stupid', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'namecard':
                await miscCommand(sock, chatId, message, ['namecard', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'oogway2':
            case 'oogway':
                const sub = command === 'oogway2' ? 'oogway2' : 'oogway';
                await miscCommand(sock, chatId, message, [sub, ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'tweet':
                await miscCommand(sock, chatId, message, ['tweet', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'ytcomment':
                await miscCommand(sock, chatId, message, ['youtube-comment', ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'comrade':
            case 'gay':
            case 'glass':
            case 'jail':
            case 'passed':
            case 'triggered':
                await miscCommand(sock, chatId, message, [command, ...args.split(/\s+/)]);
                commandExecuted = true;
                break;
            case 'animu':
                await animeCommand(sock, chatId, message, args.split(/\s+/));
                commandExecuted = true;
                break;
            case 'nom':
            case 'poke':
            case 'cry':
            case 'kiss':
            case 'pat':
            case 'hug':
            case 'wink':
            case 'facepalm':
            case 'face-palm':
            case 'animuquote':
            case 'loli':
                let sub2 = command;
                if (sub2 === 'facepalm') sub2 = 'face-palm';
                if (sub2 === 'animuquote') sub2 = 'quote';
                await animeCommand(sock, chatId, message, [sub2]);
                commandExecuted = true;
                break;
            case 'crop':
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case 'pies':
                await piesCommand(sock, chatId, message, args.split(/\s+/));
                commandExecuted = true;
                break;
            case 'china':
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case 'indonesia':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case 'japan':
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case 'korea':
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case 'hijab':
                await piesAlias(sock, chatId, message, 'hijab');
                commandExecuted = true;
                break;
            case 'update':
                const zipArg = args.split(/\s+/)[0];
                await updateCommand(sock, chatId, message, zipArg);
                commandExecuted = true;
                break;
            case 'removebg':
            case 'rmbg':
            case 'nobg':
                const rmbgArgs = args.split(/\s+/);
                await removebgCommand.exec(sock, message, rmbgArgs);
                commandExecuted = true;
                break;
            case 'remini':
            case 'enhance':
            case 'upscale':
                const reminiArgs = args.split(/\s+/);
                await reminiCommand(sock, chatId, message, reminiArgs);
                commandExecuted = true;
                break;
            case 'sora':
                await soraCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            default:
                if (isGroup) {
                    if (userMessage) {
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status after command execution
        if (commandExecuted !== false) {
            await showTypingAfterCommand(sock, chatId);
        }

        // Function to handle groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "❌ This command can only be used in a group."
                });
            }

            await sock.sendMessage(chatId, {
                text: `✅ Group JID: ${groupJid}`
            }, {
                quoted: message
            });
        }

        if (commandExecuted) {
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to process command!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {
        }

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};