const fs = require('fs');
const axios = require('axios');

const links = JSON.parse(fs.readFileSync('links.json', 'utf8'));
const now = new Date();

const categorized = {
  valid: [],
  expiring: [],
  expired: []
};

links.forEach(link => {
  const createdAt = new Date(link.createdAt);
  const hoursPassed = (now - createdAt) / 3600000;
  const hoursLeft = 72 - hoursPassed;

  let status = "";
  if (hoursLeft > 24) {
    status = "valid";
  } else if (hoursLeft > 0) {
    status = "expiring";
  } else {
    status = "expired";
  }

  categorized[status].push({ ...link, hoursPassed: hoursPassed.toFixed(2), hoursLeft: hoursLeft.toFixed(2) });
});

fs.writeFileSync('categorizedLinks.json', JSON.stringify(categorized, null, 2), 'utf8');
console.log("✅ لینک‌ها دسته‌بندی شدند و در فایل categorizedLinks.json ذخیره شدند.");