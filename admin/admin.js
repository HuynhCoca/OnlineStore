const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
});
function addProduct() {
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const image = document.getElementById("image").value;
    const category = document.getElementById("category").value;

    if (title && price && description && image && category) {
        // Call the function to add the product
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
    const db = firebase.firestore();
    const productRef = db.collection("products").doc(productId);

    productRef.delete()
        .then(() => {
            console.log("Product deleted successfully!");
            alert("🎉 Sản phẩm đã được xóa thành công!");
            window.location.href = "admin-page.html";
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
        // Call the function to update the product
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
        window.location.href = "admin-page.html";
    })
    .catch((error) => {
        console.error("Error updating product: ", error);
        alert("❌ Đã xảy ra lỗi khi cập nhật sản phẩm. Vui lòng thử lại.");
    });
}
// hien thi danh sach san pham
function displayProducts() {
    const db = firebase.firestore();
    const productRef = db.collection("products");

    productRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productId = doc.id;
                console.log("Product ID:", productId);
                console.log("Product Data:", product);
                // Tạo phần tử HTML để hiển thị sản phẩm
                const productElement = document.getElementById("product-list");
                const productItem = document.createElement("div");
                productItem.innerHTML = `
                    <h3>${product.title}</h3>
                    <p>Price: ${product.price}</p>
                    <p>Description: ${product.description}</p>
                    <img src="${product.image}" alt="${product.title}">
                    <button onclick="deleteProduct('${productId}')">Delete</button>
                    <button onclick="updateProduct('${productId}')">Update</button>
                `; 
                productElement.appendChild(productItem);
                console.log("Product displayed successfully!");
                alert("🎉 Sản phẩm đã được hiển thị thành công!");
            });
        })
        .catch((error) => {
            console.error("Error getting products: ", error);
        });
}