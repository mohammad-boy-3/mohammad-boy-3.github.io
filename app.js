// app.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwLkJ2Cd7AuivD7i9eZKxnFwiiV9BrlPK4NptK46I2BpCFoYUv6P6HNHgk41dnEaYDMEA/exec";

function startRegistration() {
  const name  = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("لطفاً همهٔ فیلدها را پر کنید.");
    return;
  }

  const formData = new URLSearchParams({ name, email });

  fetch(SCRIPT_URL, {
    method: "POST",
    body: formData
    // هیچ هدر CORS یا mode اضافه نمی‌کنیم
  })
  .then(response => response.json())
  .then(json => {
    if (json.status === "ok") {
      // موفقیت
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      window.location.href = "profile.html";
    } else {
      alert("خطا: " + json.message);
    }
  })
  .catch(err => {
    console.error("Network error:", err);
    alert("ارتباط با سرور برقرار نشد.");
  });
}

// بارگذاری اولیه
window.onload = () => {
  // اگر کاربر از قبل لاگین است، مستقیم پروفایل نمایش داده شود
  const email = localStorage.getItem("userEmail");
  if (email) {
    window.location.href = "profile.html";
  }
};
