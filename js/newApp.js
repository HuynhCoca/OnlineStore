document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const searchInput = document.getElementById("search");
    const categoriesContainer = document.getElementById("categories");
    const products = firebase.firestore().collection("products");

    const API_URL = "https://fakestoreapi.com/products";
    // Lấy danh sách sản phẩm từ API
    fetch(API_URL)
        .then(response => response.json())
        .then(productsData => {
            // Lưu sản phẩm vào Firestore
            productsData.forEach(product => {
                products.doc(product.id.toString()).set({
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    image: product.image,
                    category: product.category
                });
            });
            // Hiển thị sản phẩm và danh mục
            displayProducts();
            displayCategories();
        })
        .catch(error => console.error("Lỗi tải sản phẩm:", error));
    // Tìm kiếm sản phẩm
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = [];
        products.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                if (product.title.toLowerCase().includes(searchTerm)) {
                    filteredProducts.push({ id: doc.id, ...product });
                }
            });
            productList.innerHTML = "";
            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("col-md-4", "mb-4");
                    productCard.innerHTML = `
                        <div class="card h-100">
                            <a href="product.html?id=${product.id}" style="text-decoration: none">
                                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                            </a>    
                                <div class="card-body d-grid gap-2">
                                    <h5 class="card-title">${product.title}</h5>
                                    <p class="card-text">${product.description}</p>
                                    <p class="card-text"><strong>Giá:</strong> ${product.price.toLocaleString()}$</p>
                                    <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">🛒 Thêm vào giỏ</button>
                                </div>
                        </div>
                    `;
                    productList.appendChild(productCard);
                    if (product.quantity <= 0) {
                        const outOfStockBadge = document.createElement("span");
                        outOfStockBadge.classList.add("badge", "bg-danger", "position-absolute", "top-0", "end-0");
                        outOfStockBadge.textContent = "Hết hàng";
                        productCard.querySelector(".card").appendChild(outOfStockBadge);
                        productCard.querySelector(".add-to-cart").disabled = true;
                    }
                }
                );
            } else {
                productList.innerHTML = `<img src="assets/noProduct.jpeg" alt="Không tìm thấy sản phẩm" style="max-width: 600px; margin: 0 auto;">`;
            }
        })
        .catch((error) => {
            console.error("Error searching products: ", error);
            productList.innerHTML = `<div class="text-center text-muted">Không có sản phẩm nào.</div>`;
        });
    });
    // Hiển thị danh sách sản phẩm
    function displayProducts() {
        productList.innerHTML = "";
        const docRef = firebase.firestore().collection("products");
        docRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                const productId = doc.id;

                const productCard = document.createElement("div");
                productCard.classList.add("col-md-4", "mb-4");
                productCard.innerHTML = `
                    <div class="card h-100">
                        <a href="product.html?id=${productId}" style="text-decoration: none">
                            <img src="${product.image}" class="card-img-top" alt="${product.title}">
                        </a>    
                            <div class="card-body d-grid gap-2">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text"><strong>Giá:</strong> ${product.price.toLocaleString()}$</p>
                                <button class="btn btn-primary mt-auto add-to-cart" data-id="${productId}" data-title="${product.title}" data-price="${product.price}">🛒 Thêm vào giỏ</button
                            </div>
                    </div>
                `;
                productList.appendChild(productCard);
                if (product.quantity <= 0) {
                    const outOfStockBadge = document.createElement("span");
                    outOfStockBadge.classList.add("badge", "bg-danger", "position-absolute", "top-0", "end-0");
                    outOfStockBadge.textContent = "Hết hàng";
                    productCard.querySelector(".card").appendChild(outOfStockBadge);
                    productCard.querySelector(".add-to-cart").disabled = true; // Vô hiệu hóa nút thêm vào giỏ hàng nếu hết hàng
                }
            });
            if (querySnapshot.empty) {
                productList.innerHTML = `<img src="assets/noProduct.jpeg" alt="Không tìm thấy sản phẩm" style="max-width: 300px;">`;
            }
        })
        .catch((error) => {
            console.error("Error getting products: ", error);
            productList.innerHTML = `                
                <div class="text-center">
                    <img src="assets/noProduct.jpeg" alt="Không tìm thấy sản phẩm" style="max-width: 300px;">
                </div>`;
        }
        );
    }
    function displayCategories() {
        firebase.firestore().collection("products").get()
        .then((querySnapshot) => {
            const categories = [...new Set(querySnapshot.docs.map(doc => doc.data().category))];
            categoriesContainer.innerHTML = `<button class="btn btn-primary category-btn active" data-category="all">Tất cả</button>`;
            categories.forEach(category => {
                categoriesContainer.innerHTML += `
                    <button class="btn btn-outline-primary category-btn" data-category="${category}">${category}</button>
                `;
            });
            document.querySelectorAll(".category-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    document.querySelectorAll(".category-btn").forEach(btn => btn.classList.remove("active"));
                    e.target.classList.add("active");
                    const selectedCategory = e.target.getAttribute("data-category");
                    filterProducts(selectedCategory);
                });
            });
        })
        .catch((error) => {
            console.error("Error getting categories: ", error);
            categoriesContainer.innerHTML = `<div class="text-center text-muted">Không có danh mục nào.</div>`;
        });
    }
    function filterProducts(category) {
        if (category === "all") {
            displayProducts();
        }
        else {
            const filteredProducts = [];
            firebase.firestore().collection("products").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const product = doc.data();
                    if (product.category === category) {
                        filteredProducts.push({ id: doc.id, ...product });
                    }
                });
                productList.innerHTML = "";
                if (filteredProducts.length > 0) {
                    filteredProducts.forEach(product => {
                        const productCard = document.createElement("div");
                        productCard.classList.add("col-md-4", "mb-4");
                        productCard.innerHTML = `
                            <div class="card h-100">
                                <a href="product.html?id=${product.id}" style="text-decoration: none">
                                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                                </a>    
                                    <div class="card-body d-grid gap-2">
                                        <h5 class="card-title">${product.title}</h5>
                                        <p class="card-text">${product.description}</p>
                                        <p class="card-text"><strong>Giá:</strong> ${product.price.toLocaleString()}$</p>
                                        <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">🛒 Thêm vào giỏ</button
                                    </div>
                            </div>
                        `;
                        productList.appendChild(productCard);
                        if (product.quantity <= 0) {
                            const outOfStockBadge = document.createElement("span");
                            outOfStockBadge.classList.add("badge", "bg-danger", "position-absolute", "top-0", "end-0");
                            outOfStockBadge.textContent = "Hết hàng";
                            productCard.querySelector(".card").appendChild(outOfStockBadge);
                            productCard.querySelector(".add-to-cart").disabled = true; // Vô hiệu hóa nút thêm vào giỏ hàng nếu hết hàng
                        }
                    }
                    );
                }
                else {
                    productList.innerHTML = `<div class="text-center text-muted">Không có sản phẩm nào trong danh mục này.</div>`;
                }
            })
            .catch((error) => {
                console.error("Error filtering products: ", error);
                productList.innerHTML = `<div class="text-center text-muted">Không có sản phẩm nào.</div>`;
            });
        };
    };

    // Thêm sản phẩm vào giỏ hàng của người dùng trên firestore
    productList.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productId = e.target.getAttribute("data-id");
            const productTitle = e.target.getAttribute("data-title");
            const productPrice = parseFloat(e.target.getAttribute("data-price"));
            const user = JSON.parse(localStorage.getItem("currentUser"));

            if (!user) {
                alert("❌ Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
                window.location.href = "login.html";
                return;
            }

            const cartRef = firebase.firestore().collection("users").doc(user.uid).collection("cart").doc(productId);
            cartRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
                        const currentQuantity = doc.data().quantity || 0;
                        cartRef.update({ quantity: currentQuantity + 1 })
                            .then(() => {
                                alert("✅ Sản phẩm đã được thêm vào giỏ hàng!");
                            })
                            .catch((error) => {
                                console.error("Error updating cart item: ", error);
                                alert("❌ Đã xảy ra lỗi khi cập nhật giỏ hàng. Vui lòng thử lại.");
                            });
                    } else {
                        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
                        cartRef.set({
                            title: productTitle,
                            price: productPrice,
                            quantity: 1
                        })
                            .then(() => {
                                alert("✅ Sản phẩm đã được thêm vào giỏ hàng!");
                            })
                            .catch((error) => {
                                console.error("Error adding to cart: ", error);
                                alert("❌ Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
                            });
                    }
                })
                .catch((error) => {
                    console.error("Error getting cart item: ", error);
                    alert("❌ Đã xảy ra lỗi khi kiểm tra giỏ hàng. Vui lòng thử lại.");
                });
        }
    });
});