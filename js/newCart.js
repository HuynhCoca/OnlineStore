// Hiện sản phẩm trong cart của người dùng từ Firestore
document.addEventListener("DOMContentLoaded", () => {
        displayCartItems();
        document.getElementById("checkout-btn").addEventListener("click", () => {
            var result = confirm("Bạn có chắc chắn muốn đặt hàng?");
            if (result) {
                handleCheckout();
            }
        });
});
function displayCartItems() {
    let user = getCurrentUser();
    if (!user) {
        alert("⚠️ Bạn cần đăng nhập để xem sản phẩm!");
        window.location.href = "login.html";
        return;
    }
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).collection("cart").get().then((querySnapshot) => {
        let cartTable = document.getElementById("cart-items");
        let totalPrice = 0;
        cartTable.innerHTML = "";
        if (querySnapshot.empty) {
            cartTable.innerHTML = `<tr><td colspan="5" class="text-center text-danger">🛒 Giỏ hàng trống!</td></tr>`;
            document.getElementById("total-price").textContent = "0.00";
            return;
        }
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.title}</td>
                <td>${item.price} $</td>
                <td>${item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)} $</td>
                <td>
                    <button class="btn btn-danger remove-item" data-id="${doc.id}">🗑 Xóa</button>
                    <button class="btn btn-warning edit-item" onclick="editCartItem('${doc.id}')">✏️ Sửa</button>
                </td>
                
            `;
            cartTable.appendChild(row);
            totalPrice += item.price * item.quantity;
        });
        document.getElementById("total-price").textContent = totalPrice.toFixed(2);
        // Thêm sự kiện xóa cho các nút xóa
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                let productId = e.target.dataset.id;
                var result = confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
                if (result) {
                    removeFromCart(productId);
                }
            });
        });
    });    
}
function removeFromCart(productId) {
    let user = getCurrentUser();
    if (!user) {
        alert("⚠️ Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng!");
        return;
    }
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).collection("cart").doc(productId).delete().then(() => {
        alert("✅ Sản phẩm đã được xóa khỏi giỏ hàng!");
        displayCartItems(); // Cập nhật lại giỏ hàng
    }).catch((error) => {
        console.error("Error removing product from cart: ", error);
        alert("❌ Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.");
    });
}
// Theem sự kiện cho nút thanh toán
function handleCheckout() {
    let user = getCurrentUser();
    if (!user) {
        alert("⚠️ Bạn cần đăng nhập để thanh toán!");
        return;
    }
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).collection("cart").get().then((querySnapshot) => {
        if (querySnapshot.empty) {
            alert("🛒 Giỏ hàng trống! Vui lòng thêm sản phẩm trước khi thanh toán.");
            return;
        }
        // Tạo đơn hàng mới
        const orderData = {
            userId: user.name,
            items: [],
            totalPrice: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            status: "Chờ xác nhận" // Trạng thái đơn hàng
        };
        querySnapshot.forEach((doc) => {
            const item = doc.data();
            orderData.items.push(item);
            orderData.totalPrice += item.price * item.quantity;
        });
        // Lưu đơn hàng vào Firestore
        db.collection("orders").add(orderData).then(() => {
            // Xóa giỏ hàng sau khi thanh toán thành công
            querySnapshot.forEach((doc) => {
                db.collection("users").doc(user.uid).collection("cart").doc(doc.id).delete();
            });
            alert("✅ Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
            displayCartItems(); // Cập nhật lại giỏ hàng
        }).catch((error) => {
            console.error("Error creating order: ", error);
            alert("❌ Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.");
        });
    });
}
// thêm sự kiện cho nút chỉnh sửa giỏ hàng
function editCartItem(productId) {
    let user = getCurrentUser();
    if (!user) {
        alert("⚠️ Bạn cần đăng nhập để chỉnh sửa giỏ hàng!");
        return;
    }
    const db = firebase.firestore();
    const newQuantity = prompt("Nhập số lượng mới cho sản phẩm:");
    // Kiểm tra xem người dùng có nhập số lượng hay không
    if (newQuantity === null || isNaN(newQuantity) || parseInt(newQuantity) <= 0) {
        alert("❌ Số lượng không hợp lệ! Vui lòng nhập một số nguyên dương.");
        return;
    }
    if (newQuantity === null || newQuantity === "") {
        return; // Người dùng hủy hoặc không nhập gì
    }
    db.collection("users").doc(user.uid).collection("cart").doc(productId).update({
        quantity: parseInt(newQuantity)
    }).then(() => {
        alert("✅ Số lượng sản phẩm đã được cập nhật!");
        displayCartItems(); // Cập nhật lại giỏ hàng
    }).catch((error) => {
        console.error("Error updating cart item: ", error);
        alert("❌ Đã xảy ra lỗi khi cập nhật số lượng sản phẩm. Vui lòng thử lại.");
    });
}