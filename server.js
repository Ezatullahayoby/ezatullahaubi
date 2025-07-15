const express = require('express');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3001;

// فایل‌های اطلاعاتی
const USERS_FILE = 'users.json';
const LINKS_FILE = 'links.json';

// میدل‌ورها
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'aubisab_secret_key',
  resave: false,
  saveUninitialized: false
}));

// محافظت از صفحه داشبورد قبل از فایل‌های عمومی
app.get('/index.html', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/');
  }
});

// فایل‌های عمومی بدون دسترسی مستقیم به index.html
app.use(express.static(path.join(__dirname, 'public'), {
  index: false
}));

// نمایش صفحه ورود
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// بررسی ورود با رمز ساده
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!fs.existsSync(USERS_FILE)) {
    return res.send(`<script>alert("فایل کاربران پیدا نشد"); window.location.href = "/";</script>`);
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  const user = users.find(u => u.username === username);

  if (!user || password !== user.password) {
    return res.send(`<script>alert("نام کاربری یا رمز عبور اشتباه است"); window.location.href = "/";</script>`);
  }

  req.session.user = username;
  res.redirect('/index.html');
});

// خروج از حساب
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// API لینک‌ها (اختیاری)
app.get('/api/links', (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');

  const links = fs.existsSync(LINKS_FILE)
    ? JSON.parse(fs.readFileSync(LINKS_FILE, 'utf8'))
    : [];

  res.json(links);
});

app.post('/api/add', (req, res) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');

  const { email, token } = req.body;
  const link = `https://evisatraveller.mfa.ir/fa/request/confirm/${token}/`;
  const createdAt = new Date().toISOString();

  const links = fs.existsSync(LINKS_FILE)
    ? JSON.parse(fs.readFileSync(LINKS_FILE, 'utf8'))
    : [];

  links.push({ email, token, link, createdAt });
  fs.writeFileSync(LINKS_FILE, JSON.stringify(links, null, 2));

  res.json({ success: true });
});

// اجرای سرور
app.listen(PORT, () => {
  console.log(`✅ سرور روی http://localhost:${PORT} اجرا شد`);
});