function updateClocks() {
    const tehranTime = moment().tz("Asia/Tehran").format('HH:mm:ss');
    const londonTime = moment().tz("Europe/London").format('HH:mm:ss');
    const tokyoTime = moment().tz("Asia/Tokyo").format('HH:mm:ss');
    document.getElementById('tehran-time').textContent = tehranTime;
    document.getElementById('london-time').textContent = londonTime;
    document.getElementById('tokyo-time').textContent = tokyoTime;
}

setInterval(updateClocks, 1000);

// برای تقویم، کتابخانه مورد نظر را اینجا بارگذاری کنید
// به عنوان مثال، اگر از کتابخانه rapidcode.ir استفاده می‌کنید، کد مربوطه را اضافه کنید
