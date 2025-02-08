document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    document.getElementById("cart-items").addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            let productId = e.target.dataset.id;
            removeFromCart(productId);
        }
    });

    document.getElementById("checkout-btn").addEventListener("click", () => {
        alert("🛍️ Đặt hàng thành công!");
        clearCart();
    });
});

// Tải giỏ hàng từ LocalStorage
function loadCart() {
    let user = getCurrentUser();
    if (!user) {
        alert("Bạn cần đăng nhập để xem giỏ hàng!");
        window.location.href = "login.html";
        return;
    }

    let cart = user.cart;
    let cartTable = document.getElementById("cart-items");
    let totalPrice = 0;
    cartTable.innerHTML = "";

    cart.forEach((item, index) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.price} $</td>
            <td>1</td>
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
