document.addEventListener("DOMContentLoaded", () => {
    let registerForm = document.getElementById("register-form");
    let loginForm = document.getElementById("login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            registerUser();
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            loginUser();
        });
    }
});

// Đăng ký người dùng mới
function registerUser() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (localStorage.getItem(email)) {
        alert("Email này đã được đăng ký!");
        return;
    }

    let user = { name, email, password, cart: [] };
    localStorage.setItem(email, JSON.stringify(user));
    alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
    window.location.href = "login.html";
}

// Đăng nhập người dùng
function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = localStorage.getItem(email);
    if (!user) {
        alert("❌ Email chưa được đăng ký!");
        return;
    }

    user = JSON.parse(user);
    if (user.password !== password) {
        alert("❌ Mật khẩu không đúng!");
        return;
    }

    localStorage.setItem("currentUser", email);
    alert("✅ Đăng nhập thành công!");
    window.location.href = "index.html";
}

// Lấy thông tin người dùng hiện tại
function getCurrentUser() {
    let email = localStorage.getItem("currentUser");
    return email ? JSON.parse(localStorage.getItem(email)) : null;
}

// Cập nhật thông tin người dùng
function updateUser(user) {
    localStorage.setItem(user.email, JSON.stringify(user));
}
