const fs = require('fs');

// 📥 اطلاعات لینک جدید که می‌خوای وارد کنی
const newEntry = {
  email: "newuser@example.com",
  token: "NEWTOKEN1234567890",
  link: "https://evisatraveller.mfa.ir/fa/request/confirm/NEWTOKEN1234567890/",
  createdAt: new Date().toISOString() // خودکار تنظیم زمان جاری
};

// 📂 مسیر فایل داده‌ها
const filePath = 'links.json';

// 🧠 بررسی فایل و افزودن داده جدید
let links = [];

try {
  // خواندن داده‌های فعلی اگر فایل موجود بود
  if (fs.existsSync(filePath)) {
    links = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
} catch (err) {
  console.error("❌ خطا در خواندن فایل:", err.message);
}

links.push(newEntry); // افزودن لینک جدید به لیست

// ✍️ ذخیره لیست جدید در فایل
fs.writeFileSync(filePath, JSON.stringify(links, null, 2), 'utf8');

console.log("✅ لینک جدید با موفقیت اضافه شد!");