document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();
    if (!user) {
        alert("⚠️ Bạn cần đăng nhập để xem lịch sử đơn hàng!");
        window.location.href = "login.html";
        return;
    }

    if (user.email === "admin@gmail.com") {
        // Đổi màu navbar thành đen
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.remove('bg-primary', 'navbar-dark');
            navbar.classList.add('bg-dark', 'navbar-dark');
        }
        document.getElementById("userName").style.display = "block";
        document.getElementById("cart").style.display = "none";
        document.getElementById("mainPage").style.display = "none";
        document.getElementsByClassName("navbar-brand")[0].innerHTML = `<a class="navbar-brand" href="admin-page.html">🌊EverBlue Admin</a>`;
        document.getElementById("order-his").textContent = "Quản lý đơn hàng";
        displayAllOrders();
    } else {
        displayOrderHistory(user);
    }
});

function displayOrderHistory(user) {
    const db = firebase.firestore();
    db.collection("orders")
      .where("userId", "==", user.name)
      .get()
      .then((querySnapshot) => {
        let orderTable = document.getElementById("order-history");
        orderTable.innerHTML = "";
        if (querySnapshot.empty) {
            orderTable.innerHTML = `<tr><td colspan="5" class="text-center text-danger">📜 Không có đơn hàng nào!</td></tr>`;
            return;
        }
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const orderId = doc.id;
            const createdAt = order.createdAt && order.createdAt.toDate
                ? order.createdAt.toDate().toLocaleString()
                : "";
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${orderId}</td>
                <td>${createdAt}</td>
                <td>${order.totalPrice} $</td>
                <td>${order.status}</td>
            `;
            orderTable.appendChild(row);
        });
      })
      .catch((error) => {
        console.error("Error fetching order history: ", error);
      });
}
function displayAllOrders() {
    const db = firebase.firestore();
    db.collection("orders")
      .get()
      .then((querySnapshot) => {
        let orderTable = document.getElementById("order-history");
        orderTable.innerHTML = "";
        if (querySnapshot.empty) {
            orderTable.innerHTML = `<tr><td colspan="6" class="text-center text-danger">📜 Không có đơn hàng nào!</td></tr>`;
            return;
        }
        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const orderId = doc.id;
            const createdAt = order.createdAt && order.createdAt.toDate
                ? order.createdAt.toDate().toLocaleString()
                : "";
            // Các trạng thái mẫu, bạn có thể thay đổi theo hệ thống của bạn
            const statusOptions = ["Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];
            let statusSelect = `<select class="form-select form-select-sm" data-id="${orderId}">`;
            statusOptions.forEach(opt => {
                statusSelect += `<option value="${opt}"${order.status === opt ? " selected" : ""}>${opt}</option>`;
            });
            statusSelect += `</select>`;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${orderId}</td>
                <td>${order.userEmail || order.userId}</td>
                <td>${createdAt}</td>
                <td>${order.totalPrice} ₫</td>
                <td class="d-grid gap-2">${statusSelect}
                    <button class="btn btn-primary btn-sm save-status" data-id="${orderId}">Lưu</button>
                </td>
            `;
            orderTable.appendChild(row);
        });

        // Sự kiện lưu trạng thái
        orderTable.addEventListener("click", function(e) {
            if (e.target.classList.contains("save-status")) {
                const orderId = e.target.getAttribute("data-id");
                const select = orderTable.querySelector(`select[data-id="${orderId}"]`);
                const newStatus = select.value;
                db.collection("orders").doc(orderId).update({ status: newStatus })
                  .then(() => {
                      alert("✅ Đã cập nhật trạng thái đơn hàng!");
                  })
                  .catch((error) => {
                      alert("❌ Lỗi khi cập nhật trạng thái!");
                      console.error(error);
                  });
            }
        });
      })
      .catch((error) => {
        console.error("Error fetching all orders: ", error);
      });
}