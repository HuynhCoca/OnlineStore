document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();
    const cartCount = document.getElementById("cart-count");
    const db = firebase.firestore();
    if (user) {
        db.collection("users").doc(user.uid).collection("cart").get().then((querySnapshot) => {
            cartCount.textContent = querySnapshot.size || "0";
        }).catch((error) => {
            console.error("Error fetching cart count: ", error);
        });
    } else {
        cartCount.textContent = "0";
    }
});