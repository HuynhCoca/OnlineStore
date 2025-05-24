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
        category: category
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
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${product.title}</td>
                    <td>${product.price.toLocaleString()}₫</td>
                    <td>${product.category}</td>
                    <td>
                        <img src="${product.image}" alt="${product.title}" style="max-width:80px;max-height:80px;object-fit:cover;border-radius:6px;">
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm mb-1" onclick="deleteProduct('${productId}')">Xóa</button>
                        <button class="btn btn-warning btn-sm" onclick="fillFormForUpdate('${productId}', '${product.title.replace(/'/g,"\\'")}', '${product.price}', '${product.description.replace(/'/g,"\\'")}', '${product.image}', '${product.category.replace(/'/g,"\\'")}')">Sửa</button>
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
    document.getElementById("product-id").value = id;
    document.getElementById("title").value = title;
    document.getElementById("price").value = price;
    document.getElementById("description").value = description;
    document.getElementById("image").value = image;
    document.getElementById("category").value = category;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Sửa lại hàm updateProduct để lấy id từ hidden input
function updateProductFromForm() {
    const productId = document.getElementById("product-id").value;
    if (!productId) {
        alert("Vui lòng chọn sản phẩm để sửa!");
        return;
    }
    updateProduct(productId);
}

// Gọi hàm hiển thị sản phẩm khi trang admin load
document.addEventListener("DOMContentLoaded", displayProducts);