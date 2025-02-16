document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    document.getElementById("cart-items").addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            let productId = e.target.dataset.id;

            var result = confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
            if (result) {
                removeFromCart(productId);
            } 
        }
    });

    document.getElementById("checkout-btn").addEventListener("click", () => {
        var result = confirm("Bạn có chắc chắn muốn đặt hàng?");
        if (result) {
            handleCheckout();
        }
    });
});

// Tải giỏ hàng từ LocalStorage
function loadCart() {
    let user = getCurrentUser();
    if (!user) {
        alert("⚠️ Bạn cần đăng nhập để xem giỏ hàng!");
        window.location.href = "login.html";
        return;
    }

    let cart = user.cart;
    let cartTable = document.getElementById("cart-items");
    let totalPrice = 0;
    cartTable.innerHTML = "";

    if (cart.length === 0) {
        cartTable.innerHTML = `<tr><td colspan="5" class="text-center text-danger">🛒 Giỏ hàng trống!</td></tr>`;
        document.getElementById("total-price").textContent = "0.00";
        return;
    }

    cart.forEach((item, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.price} $</td>
            <td>${item.quantity}</td>
            <td>${item.price} $</td>
            <td><button class="btn btn-danger remove-item" data-id="${index}">🗑 Xóa</button></td>
        `;
        cartTable.appendChild(row);
        totalPrice += parseFloat(item.price);
    });

    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    let user = getCurrentUser();
    user.cart.splice(index, 1);
    updateUser(user);
    loadCart();
    updateCartCount();
}

// Xóa toàn bộ giỏ hàng sau khi thanh toán
function clearCart() {
    let user = getCurrentUser();
    user.cart = [];
    updateUser(user);
    loadCart();
    updateCartCount();
}

// Kiểm tra giỏ hàng trước khi thanh toán
function handleCheckout() {
    let user = getCurrentUser();
    
    if (!user || user.cart.length === 0) {
        alert("⚠️ Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
        return;
    }

    alert("✅ Đặt hàng thành công!");
    clearCart();
}

// Lấy thông tin người dùng hiện tại
function getCurrentUser() {
    let email = localStorage.getItem("currentUser");
    return email ? JSON.parse(localStorage.getItem(email)) : null;
}

// Cập nhật thông tin người dùng vào LocalStorage
function updateUser(user) {
    localStorage.setItem(user.email, JSON.stringify(user));
}

// Lấy số lượng sản phẩm trong giỏ hàng
function getCartCount() {
    let user = getCurrentUser();
    return user ? user.cart.length : 0;
}
