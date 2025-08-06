import { toJalaali, toGregorian, jalaaliMonthLength } from 'https://cdn.jsdelivr.net/npm/jalaali-js@1.1.0/index.min.js';

document.addEventListener('DOMContentLoaded', () => {
  // سوئیچ تَب‌ها
  document.querySelectorAll('.navbar button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.navbar button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
      document.getElementById(tab).classList.add('active');
    });
  });

  // محاسبات تقویم
  renderCalendar();
  // نمایش ساعت‌ها
  renderClocks();
  setInterval(renderClocks, 1000);
});

function renderCalendar() {
  const now = new Date();
  // شمسی
  const { jy, jm, jd } = toJalaali(now);
  document.getElementById('shamsi').textContent = `${jy}/${jm}/${jd}`;
  // میلادی
  document.getElementById('miladi').textContent = now.toLocaleDateString('en-GB');
  // قمری
  document.getElementById('ghemeri').textContent = now.toLocaleDateString('ar-SA-u-ca-islamic');

  // شروع ماه شمسی به میلادی
  const { gy, gm, gd } = toGregorian(jy, jm, 1);
  const firstDay = new Date(gy, gm - 1, gd);
  const startWeekday = (firstDay.getDay() + 6) % 7; // شنبه=0
  const daysInMonth = jalaaliMonthLength(jy, jm);
  const grid = document.getElementById('month-grid');
  grid.innerHTML = '';

  // سلول‌های خالی
  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement('div');
    grid.appendChild(empty);
  }
  // روزها
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.classList.add('day');
    if (d === jd) cell.classList.add('today');
    cell.textContent = d;
    // استیکر نمونه: اول هر هفته
    if ((startWeekday + d) % 7 === 1) {
      const img = document.createElement('img');
      img.src = 'https://i.imgur.com/5QfYyzn.png';
      img.alt = '';
      cell.appendChild(img);
    }
    grid.appendChild(cell);
  }
}

function renderClocks() {
  const zones = [
    { el: 'time-IR', tz: 'Asia/Tehran' },
    { el: 'time-UK', tz: 'Europe/London' },
    { el: 'time-JP', tz: 'Asia/Tokyo' }
  ];
  zones.forEach(z => {
    document.getElementById(z.el).textContent = new Date().toLocaleTimeString('en-GB', {
      timeZone: z.tz, hour12: false
    });
  });
}
