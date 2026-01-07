const settings = {
packname: process.env.PACK_NAME || 'Hans_Tz',
  
author: process.env.AUTHOR || 'Hans',
  
SESSION_ID: process.env.SESSION_ID || '',
  
botName: process.env.BOT_NAME || "Hans_Tz",
  
botOwner: process.env.BOT_OWNER || 'Hans_Tz',

Botprefix: process.env.PREFIX || '.',
  
ownerNumber: process.env.OWNER_NUMBER || '255760774888',
  
giphyApiKey: process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  
commandMode: process.env.COMMAND_MODE || "private",
  
maxStoreMessages: parseInt(process.env.MAX_STORE_MESSAGES) || 20,
  
storeWriteInterval: parseInt(process.env.STORE_WRITE_INTERVAL) || 10000,
  
description: process.env.BOT_DESCRIPTION || "This is a bot for managing group commands and automating tasks.",
  
version: process.env.BOT_VERSION || "2.0.0",
  
updateZipUrl: process.env.UPDATE_ZIP_URL || "https://github.com/HansTz/VORTEX-XMD/archive/refs/heads/main.zip",
};

module.exports = settings;

///MADE BY HANS_TZ