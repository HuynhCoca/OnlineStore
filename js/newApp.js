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
                                    <p class="card-text"><strong>Giá:</strong> ${product.price.toLocaleString()}₫</p>
                                    <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">🛒 Thêm vào giỏ</button>
                                </div>
                        </div>
                    `;
                    productList.appendChild(productCard);
                }
                );
            } else {
                productList.innerHTML = `<div class="text-center text-muted">Không tìm thấy sản phẩm nào.</div>`;
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
                                <p class="card-text"><strong>Giá:</strong> ${product.price.toLocaleString()}₫</p>
                                <button class="btn btn-primary mt-auto add-to-cart" data-id="${productId}" data-title="${product.title}" data-price="${product.price}">🛒 Thêm vào giỏ</button
                            </div>
                    </div>
                `;
                productList.appendChild(productCard);
            });
            if (querySnapshot.empty) {
                productList.innerHTML = `<div class="text-center text-muted">Không có sản phẩm nào.</div>`;
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
                                        <p class="card-text"><strong>Giá:</strong> ${product.price.toLocaleString()}₫</p>
                                        <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">🛒 Thêm vào giỏ</button
                                    </div>
                            </div>
                        `;
                        productList.appendChild(productCard);
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
    // thêm sản phẩm vào giỏ hàng của người dùng
    document.getElementById("product-list").addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productId = e.target.getAttribute("data-id");
            const productTitle = e.target.getAttribute("data-title");
            const productPrice = e.target.getAttribute("data-price");
            addToCart(productId, productTitle, productPrice);
        }
    });
    function addToCart(productId, productTitle, productPrice) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProduct = cart.find(item => item.id === productId);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, title: productTitle, price: parseFloat(productPrice), quantity: 1 });
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("✅ Sản phẩm đã được thêm vào giỏ hàng!");
    }

});
