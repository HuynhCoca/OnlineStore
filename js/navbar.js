document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    checkAuth();

    document.getElementById("logout-link").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    });
});

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    let user = getCurrentUser();
    let cartCount = user ? user.cart.length : 0;
    document.getElementById("cart-count").textContent = cartCount;
}

// Kiểm tra trạng thái đăng nhập
function checkAuth() {
    let user = getCurrentUser();
    if (user) {
        document.getElementById("login-link").style.display = "none";
        document.getElementById("logout-link").style.display = "block";
    }
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
