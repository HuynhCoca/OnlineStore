document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    checkAuth();

    document.getElementById("logout-link").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
        alert("Đã đăng xuất thành công!");
    });
});
// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    let user = getCurrentUser();
    let carts = user ? user.cart : [];
    let cartCount = 0;
    for (item of carts) {
        cartCount += item.quantity;
    }
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
    if (email) {
        return JSON.parse(localStorage.getItem(email));
    }
    return null;
}

// Cập nhật thông tin người dùng
function updateUser(user) {
    localStorage.setItem(user.email, JSON.stringify(user));
    updateCartCount();
    checkAuth();
}
