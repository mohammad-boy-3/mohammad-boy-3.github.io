const GAS_URL = 'https://script.google.com/macros/s/AKfycbybgllaH4KcEJcXgOmFujP-MsUDFLGvA1VGG8V6uqZcqVpgLgtnIelPZ4Mw5HHdBd1T/exec';

let userCode = '';
let userData = {};

function setActiveButton(page) {
  document.querySelectorAll('.navbar button').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`#btn-${page}`).classList.add('active');
}

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  if (page === 'profile' && !getCookie('registered')) return showError('لطفا ثبت‌نام کنید');
  if (page === 'register' && getCookie('registered')) return showError('شما ثبت‌نام کرده‌اید');
  document.getElementById(page).classList.remove('hidden');
  setActiveButton(page);
}

function startRegistration() {
  const name     = document.getElementById('name').value.trim();
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!name || !email || !password) return showError('لطفا همهٔ فیلدها را پر کنید.');

  userData = { name, email, password };
  fetch(GAS_URL, {
    method: 'POST', mode: 'cors',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ action:'sendCode', email })
  })
  .then(r=>r.json())
  .then(d=>{
    userCode = d.code; showPage('verify');
  })
  .catch(e=>{
    console.error(e);
    showError('ارسال ایمیل با خطا مواجه شد.');
  });
}

function verifyCode() {
  const input = document.getElementById('codeInput').value.trim();
  if (input !== userCode) return showError('رمز اشتباه است.');
  // ذخیره
  fetch(GAS_URL, {
    method: 'POST', mode: 'cors',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ action:'saveUser', user:userData })
  })
  .then(()=>{
    setCookie('registered','yes',7);
    setCookie('name',userData.name,7);
    setCookie('email',userData.email,7);
    setCookie('password',userData.password,7);
    showPage('home');
  })
  .catch(e=>{
    console.error(e);
    showError('ذخیره‌سازی با خطا مواجه شد.');
  });
}

function showError(msg) {
  document.getElementById('errorMsg').innerText = msg;
  showPage('error');
}

function setCookie(n,v,d){const e=new Date(Date.now()+d*864e5).toUTCString(); document.cookie=`${n}=${v}; expires=${e}; path=/`; }
function getCookie(n){const m=document.cookie.split('; ').find(r=>r.startsWith(n+'=')); return m?m.split('=')[1]:''; }

window.onload = ()=>{
  showPage('home');
  if (getCookie('registered')) {
    document.getElementById('profileInfo').innerHTML = `
      <p><strong>نام:</strong> ${getCookie('name')}</p>
      <p><strong>ایمیل:</strong> ${getCookie('email')}</p>
      <p><strong>رمز:</strong> ${getCookie('password')}</p>
    `;
  }
};
