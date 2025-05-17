document.addEventListener("DOMContentLoaded", () => {
    let registerForm = document.getElementById("register-form");
    let loginForm = document.getElementById("login-form");

    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            registerUser();
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            loginUser();
        });
    }
});

// Đăng ký người dùng mới
function registerUser() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    var user = userCredential.user;
    console.log("User registered successfully:", user.uid);
    // Lưu thông tin người dùng vào Firestore
    const db = firebase.firestore();
    db.collection("users").doc(user.uid).set({
      name: name,
      email: email,
      password: password,
      cart: []
    })
    .then(() => {
      console.log("User registered successfully!");
      alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("❌ Đăng ký không thành công! Vui lòng thử lại.");
    console.error("Error registering user: ", error);
  });
}

// Đăng nhập người dùng
function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    
    if (email === "adminpage@gmail.com" || password === "15243") {
        alert("Xin chao admin");
        window.location.href = "admin-page.html";
        return;
    }
    if (email === "" || password === "") { 
        alert("❌ Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    // Nếu không tìm thấy, thực hiện đăng nhập với Firebase
      firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log("User logged in successfully:", user.uid);
      // Lưu thông tin người dùng vào localStorage
      localStorage.setItem("currentUser", email);
      alert("✅ Đăng nhập thành công!");
      window.location.href = "index.html";
      // Lấy thông tin người dùng từ Firestore
      const db = firebase.firestore();
      db.collection("users").doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          localStorage.setItem(email, JSON.stringify(userData));
          console.log("User data retrieved successfully:", userData);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("❌ Đăng nhập không thành công! Vui lòng thử lại.");
      console.error("Error logging in user: ", error);
    });
  }
// Đăng xuất người dùng
function logoutUser() {
    firebase.auth().signOut().then(() => {
        console.log("User logged out successfully");
        localStorage.removeItem("currentUser");
        alert("✅ Đăng xuất thành công!");
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Error logging out user: ", error);
    });
}
// Kiểm tra trạng thái đăng nhập khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
});
// Kiểm tra xem người dùng đã đăng nhập hay chưa
function isLoggedIn() {
    return localStorage.getItem("currentUser") !== null;
}

// Lấy thông tin người dùng hiện tại
function getCurrentUser() {
    let email = localStorage.getItem("currentUser");
    return email ? JSON.parse(localStorage.getItem(email)) : null;
}

// Cập nhật thông tin người dùng
function updateUser(user) {
    localStorage.setItem(user.email, JSON.stringify(user));
}

// Kiểm tra trạng thái đăng nhập
function checkAuth() {
    let user = getCurrentUser();
    if (user) {
        document.getElementById("login-link").style.display = "none";
        document.getElementById("logout-link").style.display = "block";
    }
}