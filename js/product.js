document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const API_URL = `https://fakestoreapi.com/products/${productId}`;

    fetch(API_URL)
        .then(response => response.json())
        .then(product => {
            document.getElementById("product-title").textContent = product.title;
            document.getElementById("product-description").textContent = product.description;
            document.getElementById("product-price").textContent = product.price;
            document.getElementById("product-image").src = product.image;
            document.getElementById("product-image").alt = product.title;

            document.getElementById("add-to-cart").addEventListener("click", () => {
                addToCart(product);
            });

            // Gọi hàm lấy sản phẩm liên quan
            fetchRelatedProducts(product.category, product.id);
        })
        .catch(error => console.error("Lỗi tải sản phẩm:", error));
});

function addToCart(product) {
    let user = getCurrentUser();
    if (!user) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        return;
    }

    let cart = user.cart;
    let existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 });
    }

    updateUser(user);
    updateCartCount();
    alert("🛒 Đã thêm vào giỏ hàng: " + product.title);
}

function fetchRelatedProducts(category, currentProductId) {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(response => response.json())
        .then(products => {
            const relatedContainer = document.getElementById("related-products");
            relatedContainer.innerHTML = ""; // Xóa nội dung cũ

            // Lọc ra các sản phẩm khác cùng danh mục nhưng không trùng với sản phẩm hiện tại
            const relatedProducts = products.filter(p => p.id !== parseInt(currentProductId)).slice(0, 4);

            relatedProducts.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("col-md-3", "mb-4");
                productCard.innerHTML = `
                <a href="product.html?id=${product.id}" style="text-decoration: none">
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 150px; object-fit: contain;">
                        <div class="card-body">
                            <h6 class="card-title">${product.title}</h6>
                            <p class="card-text text-danger">$${product.price}</p>
                        </div>
                    </div>
                </a>    
                `;
                relatedContainer.appendChild(productCard);
            });
        })
        .catch(error => console.error("Lỗi tải sản phẩm liên quan:", error));
}
