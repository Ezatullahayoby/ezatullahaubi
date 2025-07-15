const fs = require('fs');
const data = JSON.parse(fs.readFileSync('categorizedLinks.json', 'utf8'));

function createSection(title, links, color) {
  let section = `<h2 style="color:${color}">${title} (${links.length})</h2><ul>`;
  links.forEach(link => {
    section += `<li><strong>${link.email}</strong> | ${link.token} | ⏳ ${link.hoursLeft} ساعت باقی‌مانده</li>`;
  });
  section += `</ul><hr>`;
  return section;
}

let html = `
<html>
<head><title>گزارش لینک‌های ویزا</title></head>
<body style="font-family:Tahoma;">
<h1>📊 گزارش اعتبار لینک‌ها</h1>
${createSection("✅ معتبر", data.valid, "green")}
${createSection("⏳ در حال انقضا", data.expiring, "orange")}
${createSection("❌ منقضی‌شده", data.expired, "red")}
</body>
</html>
`;

fs.writeFileSync('report.html', html, 'utf8');
console.log("✅ فایل report.html ساخته شد.");