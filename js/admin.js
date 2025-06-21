const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const productId = document.getElementById("product-id").value;
    if (productId) {
        updateProduct(productId);
    } else {
        addProduct();
    }
});

function addProduct() {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;

    if (title && price && description && image && category) {
        addProductToFirestore(title, price, description, image, category);
    } else {
        alert("❌ Vui lòng điền đầy đủ thông tin sản phẩm!");
    }
}

function addProductToFirestore(title, price, description, image, category) {
    const db = firebase.firestore();
    const productRef = db.collection("products").doc();

    productRef.set({
        title: title,
        price: price,
        description: description,
        image: image,
        category: category,
        quantity: 5 // Mặc định số lượng là 5 (để có sản phẩm hiển thị trong bảng)
    })
    .then(() => {
        console.log("Product added successfully!");
        alert("🎉 Sản phẩm đã được thêm thành công!");
        window.location.href = "admin-page.html";
    })
    .catch((error) => {
        console.error("Error adding product: ", error);
        alert("❌ Đã xảy ra lỗi khi thêm sản phẩm. Vui lòng thử lại.");
    });
}

function deleteProduct(productId) {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    const db = firebase.firestore();
    const productRef = db.collection("products").doc(productId);

    productRef.delete()
        .then(() => {
            console.log("Product deleted successfully!");
            alert("🎉 Sản phẩm đã được xóa thành công!");
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error deleting product: ", error);
            alert("❌ Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại.");
        });
}

function updateProduct(productId) {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;

    if (title && price && description && image && category) {
        updateProductInFirestore(productId, title, price, description, image, category);
    } else {
        alert("❌ Vui lòng điền đầy đủ thông tin sản phẩm!");
    }
}

function updateProductInFirestore(productId, title, price, description, image, category) {
    const db = firebase.firestore();
    const productRef = db.collection("products").doc(productId);

    productRef.update({
        title: title,
        price: price,
        description: description,
        image: image,
        category: category
    })
    .then(() => {
        console.log("Product updated successfully!");
        alert("🎉 Sản phẩm đã được cập nhật thành công!");
        window.location.reload();
    })
    .catch((error) => {
        console.error("Error updating product: ", error);
        alert("❌ Đã xảy ra lỗi khi cập nhật sản phẩm. Vui lòng thử lại.");
    });
}

// Hiển thị danh sách sản phẩm
function displayProducts() {
    const db = firebase.firestore();
    const productRef = db.collection("products");
    const productElement = document.getElementById("product-list");
    productElement.innerHTML = ""; // Xóa sản phẩm cũ trước khi hiển thị mới

    productRef.get()
        .then((querySnapshot) => {
            let count = 0;
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productId = doc.id;
                // Tạo một dòng bảng cho mỗi sản phẩm
                let lowStockBadge = '';
                if (product.quantity <= 3) {
                    lowStockBadge = `<span class="badge bg-danger ms-2">Sắp hết hàng</span>`;
                }

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${product.title} ${lowStockBadge}</td>
                    <td>${product.price.toLocaleString()}$</td>
                    <td>${product.category}</td>
                    <td>
                        <img src="${product.image}" alt="${product.title}" style="max-width:80px;max-height:80px;object-fit:cover;border-radius:6px;">
                    </td>
                    <td>
                        <div class="d-flex flex-column">
                            <input type="number" min="0" value="${product.quantity ?? 10}" class="form-control form-control-sm quantity-input mb-2" data-id="${productId}">
                            <button class="btn btn-success btn-sm save-qty-btn w-100" data-id="${productId}">Lưu</button>
                        </div>
                    </td>
                    <td class="d-grid gap-2">
                        <button class="btn btn-danger btn-sm mb-1" onclick="deleteProduct('${productId}')">Xóa</button>
                        <button class="btn btn-warning btn-sm mb-1" onclick="fillFormForUpdate('${productId}', '${product.title.replace(/'/g,"\\'")}', '${product.price}', '${product.description.replace(/'/g,"\\'")}', '${product.image}', '${product.category.replace(/'/g,"\\'")}')">Sửa</button>
                    </td>
                `;
                productElement.appendChild(tr);
                count++;
            });
            if (count === 0) {
                productElement.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Không có sản phẩm nào.</td></tr>`;
            }
        })
        .catch((error) => {
            console.error("Error getting products: ", error);
            alert("❌ Đã xảy ra lỗi khi lấy danh sách sản phẩm.");
        });
}

// Hàm điền dữ liệu lên form để sửa sản phẩm
function fillFormForUpdate(id, title, price, description, image, category) {
    document.getElementById("edit-product-id").value = id;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-price").value = price;
    document.getElementById("edit-description").value = description;
    document.getElementById("edit-image").value = image;
    document.getElementById("edit-category").value = category;
    // Hiện modal Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

// Sửa lại hàm updateProduct để lấy id từ hidden input
// function updateProductFromForm() {
//     const productId = document.getElementById("product-id").value;
//     if (!productId) {
//         alert("Vui lòng chọn sản phẩm để sửa!");
//         return;
//     }
//     updateProduct(productId);
// }

// Gọi hàm hiển thị sản phẩm khi trang admin load
document.addEventListener("DOMContentLoaded", displayProducts);

document.getElementById("edit-product-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("edit-product-id").value;
    const title = document.getElementById("edit-title").value;
    const price = parseFloat(document.getElementById("edit-price").value);
    const description = document.getElementById("edit-description").value;
    const image = document.getElementById("edit-image").value;
    const category = document.getElementById("edit-category").value;

    firebase.firestore().collection("products").doc(id).update({
        title, price, description, image, category
    }).then(() => {
        alert("✅ Đã cập nhật sản phẩm!");
        // Ẩn modal
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        displayProducts();
    }).catch((error) => {
        alert("❌ Lỗi khi cập nhật sản phẩm!");
        console.error(error);
    });
});

// Sau khi render bảng, thêm sự kiện cho nút "Lưu" số lượng:
document.getElementById("product-list").addEventListener("click", function(e) {
    if (e.target.classList.contains("save-qty-btn")) {
        const productId = e.target.getAttribute("data-id");
        const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        const newQuantity = parseInt(quantityInput.value, 10);

        if (isNaN(newQuantity) || newQuantity < 0) {
            alert("❌ Số lượng không hợp lệ!");
            return;
        }

        firebase.firestore().collection("products").doc(productId).update({
            quantity: newQuantity
        }).then(() => {
            alert("✅ Đã cập nhật số lượng sản phẩm!");
        }).catch((error) => {
            alert("❌ Lỗi khi cập nhật số lượng sản phẩm!");
            console.error(error);
        });
    }
});