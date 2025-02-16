document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const searchInput = document.getElementById("search");

    let productsData = [];

    // API công khai để lấy danh sách sản phẩm mẫu
    const API_URL = "https://fakestoreapi.com/products";

    fetch(API_URL)
        .then(response => response.json())
        .then(products => {
            productsData = products;
            displayProducts(products);
        })
        .catch(error => console.error("Lỗi tải sản phẩm:", error));

    // Hiển thị danh sách sản phẩm
    function displayProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("col-md-4", "mb-4");
            productCard.innerHTML = `
                
                    <div class="card h-100">
                    <a href="product.html?id=${product.id}" style="text-decoration: none">
                        <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: contain;">
                    </a>    
                        <div class="card-body d-grid gap-2">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-text">${product.description.substring(0, 100)}...</p>
                            <p class="card-text"><strong>Giá:</strong> $${product.price}</p>
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">🛒 Thêm vào giỏ</button>
                        </div>
                    </div>
                
            `;
            productList.appendChild(productCard);
        });
    }

    // Lọc sản phẩm theo tìm kiếm
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = productsData.filter(product =>
            product.title.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    // Xử lý sự kiện thêm sản phẩm vào giỏ hàng
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const product = {
                id: e.target.getAttribute("data-id"),
                title: e.target.getAttribute("data-title"),
                price: e.target.getAttribute("data-price"),
            };
            addToCart(product);
        }
    });

    // Thêm sản phẩm vào giỏ hàng của người dùng
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
});
