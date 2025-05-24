// document.addEventListener("DOMContentLoaded", () => {
//     updateCartCount();
//     checkAuth();
// });
// // Cập nhật số lượng giỏ hàng
// function updateCartCount() {
//     let user = getCurrentUser();
//     let carts = user ? user.cart : [];
//     let cartCount = 0;
//     for (let item of carts) { // Thêm let ở đây
//         cartCount += item.quantity;
//     }
//     document.getElementById("cart-count").textContent = cartCount;
// }

// // Kiểm tra trạng thái đăng nhập
// function checkAuth() {
//     console.log(123)
//     let user = getCurrentUser();
//     const loginLink = document.getElementById("login-link");
//     const logoutLink = document.getElementById("logout-link");
//     const userInfo = document.getElementById("user-info");
//     if (user) {
//         if (loginLink) loginLink.style.display = "none";
//         if (logoutLink) logoutLink.style.display = "block";
//         if (userInfo) userInfo.textContent = user.name || user.email;
//     } else {
//         if (userInfo) userInfo.textContent = "";
//     }
// }

// // Lấy thông tin người dùng hiện tại
// function getCurrentUser() {
//     let email = localStorage.getItem("currentUser");
//     if (email) {
//         try {
//             return JSON.parse(localStorage.getItem(email));
//         } catch (e) {
//             return null;
//         }
//     }
//     return null;
// }

// // Cập nhật thông tin người dùng
// function updateUser(user) {
//     localStorage.setItem(user.email, JSON.stringify(user));
//     updateCartCount();
//     checkAuth();
// }
