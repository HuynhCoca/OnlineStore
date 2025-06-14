document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();
    const productId = new URLSearchParams(window.location.search).get("id");
    console.log("Product ID:", productId);
    const productRef = firebase.firestore().collection("products").doc(productId);
    const cartRef = firebase.firestore().collection("users").doc(user.uid).collection("cart");
    // Hiển thị thông tin sản phẩm
    productRef.get().then((doc) => {
        const product = doc.data();
        if (doc.exists) {
            document.getElementById("product-title").textContent = product.title;
            document.getElementById("product-price").textContent = product.price
            document.getElementById("product-description").textContent = product.description;
            document.getElementById("product-image").src = product.image || "https://via.placeholder.com/150";
        } else {
            console.error("Sản phẩm không tồn tại.");
        }
        if (product.quantity <= 0) {
            document.getElementById("add-to-cart").disabled = true;
            document.getElementById("add-to-cart").textContent = "Sản phẩm đã hết hàng";
        }
    }).catch((error) => {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    });
    // Thêm sản phẩm vào giỏ hàng
    document.getElementById("add-to-cart").addEventListener("click", () => {
        addToCart(productId);
    });
    // Hiển thị sản phẩm liên quan theo caterory
    fetchRelatedProducts(productId);
});
function addToCart(productId) {
    const user = getCurrentUser();
    const productTitle = document.getElementById("product-title").textContent;
    const productPrice = document.getElementById("product-price").textContent;
    const cartRef = firebase.firestore().collection("users").doc(user.uid).collection("cart").doc(productId);
    if (!user) {
        alert("❌ Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
        window.location.href = "login.html"; // Chuyển hướng đến trang đăng nhập
        return;
    }
    
    cartRef.get().then((doc) => {
        if (doc.exists) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
            const currentQuantity = doc.data().quantity || 1;
            cartRef.update({ quantity: currentQuantity + 1 })
            .then(() => {
                alert(`✅ Đã tăng số lượng ${productTitle} trong giỏ hàng!`);
            });
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            cartRef.set({
                title: productTitle,
                price: productPrice,
                quantity: 1
            }).then(() => {
                alert(`✅ Đã thêm ${productTitle} vào giỏ hàng!`);
            });
        }
    }).catch((error) => {
        console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        alert("❌ Lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại sau.");
    });
};
function fetchRelatedProducts(productId) {
    // Lấy thông tin sản phẩm để xác định category
    const productRef = firebase.firestore().collection("products").doc(productId);
    productRef.get().then((doc) => {
        if (doc.exists) {
            const product = doc.data();
            const category = product.category;
            // Tìm các sản phẩm cùng category
            firebase.firestore().collection("products")
                .where("category", "==", category)
                .where(firebase.firestore.FieldPath.documentId(), "!=", productId)
                .limit(4) // Giới hạn số lượng sản phẩm liên quan
                .get()
                .then((querySnapshot) => {
                    const relatedProductsContainer = document.getElementById("related-products");
                    relatedProductsContainer.innerHTML = ""; // Xóa nội dung cũ
                    querySnapshot.forEach((relatedDoc) => {
                        const relatedProduct = relatedDoc.data();
                        relatedProduct.id = relatedDoc.id; // Lưu ID sản phẩm để sử dụng trong liên kết
                        // Tạo phần tử sản phẩm liên quan
                        const productElement = document.createElement("div");
                        productElement.className = "related-product";
                        productElement.classList.add("col-md-3", "mb-4");
                        productElement.innerHTML = `
                        <a href="product.html?id=${relatedProduct.id}" style="text-decoration: none">
                            <div class="card h-100">
                                <img src="${relatedProduct.image}" class="card-img-top" alt="${relatedProduct.title}" style="height: 150px; object-fit: contain;">
                                <div class="card-body">
                                    <h6 class="card-title">${relatedProduct.title}</h6>
                                    <p class="card-text text-danger">$${relatedProduct.price}</p>
                                </div>
                            </div>
                        </a>  
                        `;
                        relatedProductsContainer.appendChild(productElement);
                    });
                }).catch((error) => {
                    console.error("Lỗi khi lấy sản phẩm liên quan:", error);
                });
        } else {
            console.error("Sản phẩm không tồn tại.");
        }
    }).catch((error) => {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    });
};