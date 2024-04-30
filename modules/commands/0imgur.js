const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const url = require('url');

module.exports.config = {
    name: "imgur",
    version: "1.0.0",
    permission: 0,
    credits: "Rahad",
    description: "Uploads replied attachment to Imgur",
    commandCategory: "Video and images Imgur upload", 
    usages: "imgur",
    cooldowns: 5,
    dependencies: {
        "axios": ""
    }
};

module.exports.run = async ({ api, event }) => {
    try {
        const attachmentUrl = event.messageReply.attachments[0]?.url || event.messageReply.attachments[0];
        if (!attachmentUrl) return api.sendMessage('Please reply to an image or video with /imgur', event.threadID, event.messageID);

        const moment = require("moment-timezone");
        var times = moment.tz("Asia/Dhaka").format("hh:mm:ss || D/MM/YYYY");
        var thu = moment.tz("Asia/Dhaka").format("dddd");
        moment.tz("Asia/Dhaka").format("dddd");
        if (thu == "Sunday") thu = "ðš‚ðšžðš—ðšðšŠðš¢";
        if (thu == "Monday") thu = "ð™¼ðš˜ðš—ðšðšŠðš¢";
        if (thu == "Tuesday") thu = "ðšƒðšžðšŽðšœðšðšŠðš¢";
        if (thu == "Wednesday") thu = "ðš†ðšŽðšðš—ðšŽðšœðšðšŠðš¢";
        if (thu == "Thursday") thu = "ðšƒðš‘ðšžðš›ðšœðšðšŠðš¢";
        if (thu == "Friday") thu = "ð™µðš›ðš’ðšðšŠðš¢";
        if (thu == "Saturday") thu = "ðš‚ðšŠðšðšžðš›ðšðšŠðš¢";
        var { threadID, messageID, body } = event,
            { PREFIX } = global.config;
        let threadSetting = global.data.threadData.get(threadID) || {};
        let prefix = threadSetting.PREFIX || PREFIX;
        const timeStart = Date.now();
      
        const attachment = (await axios.get(attachmentUrl, { responseType: 'arraybuffer' })).data;

        const imgurLink = await uploadToImgur(attachment);

        console.log('Imgur link:', imgurLink);

        const replyMessage = `====ã€Ž ð–¨ð–¬ð–¦ð–´ð–± ã€====\n
        â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±\n
        âœ¿ ð–¨ð—†ð—€ð—Žð—‹ ð—…ð—‚ð—‡ð—„: ${imgurLink}\n
        â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±â–±\n
        ã€Ž  ${thu} || ${times} ã€`;

        return api.sendMessage({ body: replyMessage }, event.threadID, event.messageID);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        return api.sendMessage('An error occurred while processing the attachment.', event.threadID, event.messageID);
    }
};

async function uploadToImgur(attachment) {
    try {
        const formData = new FormData();
        formData.append('image', attachment);

        console.log('Uploading to Imgur...');

        const uploadResponse = await axios.post('https://api.imgur.com/3/upload', formData, {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Client-ID c76eb7edd1459f3` 
            }
        });

        console.log('Upload response:', uploadResponse.data);

        return uploadResponse.data.data.link;
    } catch (error) {
        console.error('Imgur upload error:', error.response?.data || error.message);
        throw new Error('An error occurred while uploading to Imgur.');
    }
}
