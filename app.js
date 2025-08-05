// app.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLkJ2Cd7AuivD7i9eZKxnFwiiV9BrlPK4NptK46I2BpCFoYUv6P6HNHgk41dnEaYDMEA/exec";

// بررسی وضعیت ورود
function checkAuth() {
  const email = localStorage.getItem("userEmail");
  if (!email) {
    document.querySelectorAll("#nav-profile").forEach(el => el.classList.add("disabled"));
  }
}
checkAuth();

// ثبت‌نام
function startRegistration() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password")?.value || "";

  if (!name || !email) {
    showMessage("message", "لطفاً همهٔ فیلدها را پر کنید.", true);
    return;
  }

  const params = new URLSearchParams({ name, email });

  fetch(SCRIPT_URL, { method: "POST", body: params })
    .then(res => res.text())
    .then(txt => {
      if (txt === "OK") {
        localStorage.setItem("userName", name);
        localStorage.setItem("userEmail", email);
        window.location.href = "profile.html";
      } else {
        showMessage("message", "خطا در ثبت‌نام. دوباره تلاش کنید.", true);
      }
    })
    .catch(err => {
      console.error(err);
      showMessage("message", "ارتباط با سرور برقرار نشد.", true);
    });
}

// نمایش پیام خطا/موفقیت
function showMessage(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.style.color = isError ? "#e53935" : "#388e3c";
  el.classList.remove("hidden");
}

// پروفایل
if (window.location.pathname.endsWith("profile.html")) {
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  if (!email) {
    window.location.href = "index.html";
  } else {
    document.getElementById("display-name").textContent = name;
    document.getElementById("display-email").textContent = email;
  }
}

// خروج
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
