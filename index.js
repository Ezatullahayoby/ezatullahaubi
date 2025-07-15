const axios = require('axios');
const fs = require('fs');

// خواندن اطلاعات لینک از فایل JSON
const linkData = JSON.parse(fs.readFileSync('link_data.json', 'utf8'));

// محاسبه ساعات گذشته از زمان ساخت لینک
const createdAt = new Date(linkData.createdAt);
const now = new Date();
const hoursPassed = (now - createdAt) / 3600000;

if (hoursPassed > 72) {
    console.log("⛔ بیش از ۷۲ ساعت گذشته؛ لینک منقضی شده!");
} else {
    // تلاش برای باز کردن لینک تأیید
    axios.get(linkData.confirmedLink, {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept-Language': 'fa'
        }
    }).then(response => {
        console.log("✅ لینک تأیید دریافت شد، وضعیت:", response.status);
        fs.writeFileSync("response.html", response.data); // ذخیره جواب در فایل
    }).catch(error => {
        console.error("❌ خطا هنگام دریافت لینک:", error.message);
    });
}