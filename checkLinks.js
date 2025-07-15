// 📁 file: checkLinks.js
const axios = require('axios');
const fs = require('fs');

const links = JSON.parse(fs.readFileSync('links.json', 'utf8'));
const now = new Date();

links.forEach(async (entry) => {
  const { email, token, link, createdAt } = entry;
  const created = new Date(createdAt);
  const hoursPassed = ((now - created) / 3600000).toFixed(2);
  const hoursLeft = Math.max(0, 72 - hoursPassed).toFixed(2);

  console.log(`🔍 بررسی لینک برای: ${email}`);
  console.log(`⏳ ساعت گذشته: ${hoursPassed} ساعت`);
  console.log(`🕒 زمان باقی‌مانده تا انقضا: ${hoursLeft} ساعت`);

  try {
    const res = await axios.get(link, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept-Language': 'fa'
      }
    });

    if (res.status === 200) {
      console.log(`✅ لینک معتبر است | وضعیت HTTP: ${res.status}`);
    } else {
      console.log(`⚠️ لینک غیرعادی | وضعیت: ${res.status}`);
    }
  } catch (err) {
    console.log(`❌ لینک پاسخ نداد یا منقضی شده | پیام: ${err.message}`);
  }

  console.log('----------------------------');
});