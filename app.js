// شناسایی المنت‌ها
const tabCalendar = document.getElementById('tab-calendar');
const tabClock    = document.getElementById('tab-clock');
const sectionCal  = document.getElementById('calendar');
const sectionClk  = document.getElementById('clock');

// سوئیچ تب‌ها
tabCalendar.onclick = () => {
  tabCalendar.classList.add('active');
  tabClock.classList.remove('active');
  sectionCal.classList.add('active');
  sectionClk.classList.remove('active');
};
tabClock.onclick = () => {
  tabClock.classList.add('active');
  tabCalendar.classList.remove('active');
  sectionClk.classList.add('active');
  sectionCal.classList.remove('active');
};

// تابع برای پر کردن تقویم شمسی
function renderCalendar() {
  const now = new Date();
  // تبدیل به شمسی
  const j = jalaali.toJalaali(now);
  document.getElementById('shamsi').textContent  = `${j.jy}/${j.jm}/${j.jd}`;
  document.getElementById('miladi').textContent  = now.toLocaleDateString('en-GB');
  document.getElementById('ghemeri').textContent = now.toLocaleDateString('ar-SA-u-ca-islamic');

  // شروع ماه
  const firstDay = new Date(j.jy, j.jm - 1, 1);
  const dayOfWeek = (firstDay.getDay() + 6) % 7; // شمسی: شنبه=0
  const daysInMonth = jalaali.jalaaliMonthLength(j.jy, j.jm);
  const grid = document.getElementById('month-grid');
  grid.innerHTML = '';

  // سلول‌های خالی قبل
  for (let i = 0; i < dayOfWeek; i++) {
    grid.appendChild(document.createElement('div'));
  }
  // روزهای ماه
  for (let d = 1; d <= daysInMonth; d++) {
    const div = document.createElement('div');
    div.className = 'day' + (d === j.jd ? ' today' : '');
    div.textContent = d;
    // نمونه استیکر: رنگین‌کمان روی اول هر هفته
    if ((d + dayOfWeek) % 7 === 0) {
      const img = document.createElement('img');
      img.src = 'https://i.imgur.com/5QfYyzn.png'; // رنگین‌کمان
      img.className = 'sticker';
      div.appendChild(img);
    }
    grid.appendChild(div);
  }
}

// تابع برای نمایش ساعت‌ها
function renderClocks() {
  const zones = [
    { id: 'time-IR', tz: 'Asia/Tehran' },
    { id: 'time-UK', tz: 'Europe/London' },
    { id: 'time-JP', tz: 'Asia/Tokyo' }
  ];
  zones.forEach(z => {
    const d = new Date().toLocaleTimeString('en-GB', {
      timeZone: z.tz,
      hour12: false
    });
    document.getElementById(z.id).textContent = d;
  });
}

// حلقهٔ اصلی
renderCalendar();
renderClocks();
setInterval(renderClocks, 1000);
