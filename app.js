// app.js

// لینک Web App شما
const GAS_URL = 'https://script.google.com/macros/s/AKfycbybgllaH4KcEJcXgOmFujP-MsUDFLGvA1VGG8V6uqZcqVpgLgtnIelPZ4Mw5HHdBd1T/exec';

let userCode = '';
let userData = {};

// تابع نمایش صفحات
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  // چک کوکی برای دسترسی به پروفایل
  if (page === 'profile' && !getCookie('registered')) {
    showError('لطفا ثبت نام کنید');
    return;
  }
  // چک کوکی برای جلوگیری از ثبت‌نام مجدد
  if (page === 'register' && getCookie('registered')) {
    showError('شما ثبت نام کرده‌اید');
    return;
  }

  document.getElementById(page).classList.remove('hidden');
}

// شروع فرآیند ثبت‌نام: ارسال کد به ایمیل
function startRegistration() {
  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !email || !password) {
    alert("لطفا همهٔ فیلدها را پر کنید.");
    return;
  }

  userData = { name, email, password };

  fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'sendCode', email })
  })
  .then(res => res.json())
  .then(data => {
    userCode = data.code;        // کد دریافتی از سرور
    showPage('verify');          // نمایش صفحهٔ وارد کردن کد
  })
  .catch(err => {
    console.error(err);
    alert("ارسال کد به ایمیل با خطا مواجه شد.");
  });
}

// تایید کد دریافتی و ذخیره‌سازی نهایی
function verifyCode() {
  const inputCode = document.getElementById('codeInput').value.trim();

  if (inputCode === userCode) {
    // ذخیره در Google Sheet
    fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'saveUser', user: userData })
    })
    .then(() => {
      // تنظیم کوکی برای شناسایی کاربر
      setCookie('registered', 'yes', 7);
      setCookie('name',       userData.name,     7);
      setCookie('email',      userData.email,    7);
      setCookie('password',   userData.password, 7);

      showPage('home');  // بازگشت به صفحهٔ اصلی
    })
    .catch(err => {
      console.error(err);
      alert("ذخیره‌سازی در شیت با خطا مواجه شد.");
    });

  } else {
    alert("رمز اشتباه است، دوباره تلاش کنید.");
  }
}

// نمایش پیغام خطا
function showError(msg) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.getElementById('error').classList.remove('hidden');
  document.getElementById('errorMsg').innerText = msg;
}

// تنظیم کوکی
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

// خواندن کوکی
function getCookie(name) {
  const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return match ? match.split('=')[1] : '';
}

// هنگام بارگذاری صفحه
window.onload = () => {
  showPage('home');

  // اگر ثبت‌نام شده، پروفایل را پر کن
  if (getCookie('registered')) {
    document.getElementById('profileInfo').innerHTML = `
      <p><strong>نام:</strong> ${getCookie('name')}</p>
      <p><strong>ایمیل:</strong> ${getCookie('email')}</p>
      <p><strong>رمز عبور:</strong> ${getCookie('password')}</p>
    `;
  }
};
