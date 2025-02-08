document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const cartItemsTable = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const checkoutButton = document.getElementById("checkout");

  // API công khai để lấy danh sách sản phẩm mẫu
  const API_URL = "https://fakestoreapi.com/products";

  if (productList) {
      let productsData = [];
      const filterInput = document.createElement("input");
      filterInput.setAttribute("type", "text");
      filterInput.setAttribute("placeholder", "Tìm kiếm sản phẩm...");
      filterInput.classList.add("form-control", "mb-3");
      productList.parentElement.insertBefore(filterInput, productList);

      fetch(API_URL)
          .then(response => response.json())
          .then(products => {
              productsData = products;
              displayProducts(products);
          })
          .catch(error => console.error("Lỗi tải sản phẩm:", error));

      function displayProducts(products) {
          productList.innerHTML = "";
          products.forEach(product => {
              const productCard = document.createElement("div");
              productCard.classList.add("col-md-4", "mb-4");
              productCard.innerHTML = `
                  <div class="card h-100">
                      <img src="${product.image}" class="card-img-top" alt="${product.title}" style="height: 200px; object-fit: contain;">
                      <div class="card-body">
                          <h5 class="card-title">${product.title}</h5>
                          <p class="card-text">${product.description.substring(0, 100)}...</p>
                          <p class="card-text"><strong>Giá:</strong> $${product.price}</p>
                          <button class="btn btn-primary add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">Thêm vào giỏ</button>
                      </div>
                  </div>
              `;
              productList.appendChild(productCard);
          });
      }

      filterInput.addEventListener("input", (e) => {
          const searchTerm = e.target.value.toLowerCase();
          const filteredProducts = productsData.filter(product =>
              product.title.toLowerCase().includes(searchTerm)
          );
          displayProducts(filteredProducts);
      });

      document.addEventListener("click", (e) => {
          if (e.target.classList.contains("add-to-cart")) {
              const productId = e.target.getAttribute("data-id");
              const productTitle = e.target.getAttribute("data-title");
              const productPrice = e.target.getAttribute("data-price");
              addToCart({ id: productId, title: productTitle, price: productPrice });
          }
      });

      function addToCart(product) {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          cart.push(product);
          localStorage.setItem("cart", JSON.stringify(cart));
          alert("Đã thêm vào giỏ hàng: " + product.title);
      }
  }

  // Xử lý hiển thị giỏ hàng
  if (cartItemsTable) {
      function loadCart() {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          cartItemsTable.innerHTML = "";
          let totalPrice = 0;

          cart.forEach((item, index) => {
              totalPrice += parseFloat(item.price);
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${item.title}</td>
                  <td>$${item.price}</td>
                  <td><button class="btn btn-danger btn-sm remove-item" data-index="${index}">Xóa</button></td>
              `;
              cartItemsTable.appendChild(row);
          });

          totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
      }

      loadCart();

      document.addEventListener("click", (e) => {
          if (e.target.classList.contains("remove-item")) {
              const index = e.target.getAttribute("data-index");
              removeFromCart(index);
          }
      });

      function removeFromCart(index) {
          let cart = JSON.parse(localStorage.getItem("cart")) || [];
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          loadCart();
      }

      checkoutButton.addEventListener("click", () => {
          if (confirm("Bạn có chắc chắn muốn thanh toán?")) {
              localStorage.removeItem("cart");
              alert("Thanh toán thành công!");
              loadCart();
          }
      });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Đăng ký tài khoản
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = document.getElementById("name").value;
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          let users = JSON.parse(localStorage.getItem("users")) || [];
          if (users.some(user => user.email === email)) {
              alert("Email đã được sử dụng!");
              return;
          }

          users.push({ name, email, password, cart: [] });
          localStorage.setItem("users", JSON.stringify(users));
          alert("Đăng ký thành công! Mời bạn đăng nhập.");
          window.location.href = "login.html";
      });
  }

  // Đăng nhập tài khoản
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          let users = JSON.parse(localStorage.getItem("users")) || [];
          let user = users.find(user => user.email === email && user.password === password);

          if (user) {
              localStorage.setItem("currentUser", JSON.stringify(user));
              alert("Đăng nhập thành công!");
              window.location.href = "index.html";
          } else {
              alert("Email hoặc mật khẩu không đúng!");
          }
      });
  }

  // Kiểm tra người dùng đăng nhập
  function getCurrentUser() {
      return JSON.parse(localStorage.getItem("currentUser"));
  }

  // Xử lý giỏ hàng theo tài khoản
  function addToCart(product) {
      let user = getCurrentUser();
      if (!user) {
          alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
          return;
      }

      user.cart.push(product);
      updateUser(user);
      alert("Đã thêm vào giỏ hàng: " + product.title);
  }

  function updateUser(user) {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.map(u => (u.email === user.email ? user : u));
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(user));
  }

  // Hiển thị giỏ hàng trên `cart.html`
  const cartItemsTable = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");
  const checkoutButton = document.getElementById("checkout");

  if (cartItemsTable) {
      function loadCart() {
          let user = getCurrentUser();
          if (!user) {
              alert("Vui lòng đăng nhập để xem giỏ hàng!");
              window.location.href = "login.html";
              return;
          }

          cartItemsTable.innerHTML = "";
          let totalPrice = 0;

          user.cart.forEach((item, index) => {
              totalPrice += parseFloat(item.price);
              const row = document.createElement("tr");
              row.innerHTML = `
                  <td>${item.title}</td>
                  <td>$${item.price}</td>
                  <td><button class="btn btn-danger btn-sm remove-item" data-index="${index}">Xóa</button></td>
              `;
              cartItemsTable.appendChild(row);
          });

          totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
      }

      loadCart();

      document.addEventListener("click", (e) => {
          if (e.target.classList.contains("remove-item")) {
              let user = getCurrentUser();
              const index = e.target.getAttribute("data-index");
              user.cart.splice(index, 1);
              updateUser(user);
              loadCart();
          }
      });

      checkoutButton.addEventListener("click", () => {
          let user = getCurrentUser();
          if (confirm("Bạn có chắc chắn muốn thanh toán?")) {
              user.cart = [];
              updateUser(user);
              alert("Thanh toán thành công!");
              loadCart();
          }
      });
  }
});
