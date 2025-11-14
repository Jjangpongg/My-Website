let cart = [];
let currentProduct = null;

// Display products
function displayProducts(items) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    items.forEach((item, index) => {
        container.innerHTML += `
            <div class="product" onclick="openModal(${index})">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>₱${item.price}</p>
                <p>Color: ${item.color}</p>
            </div>
        `;
    });
}

// ----- Product Modal -----
const modal = document.getElementById("productModal");
const modalMainImage = document.getElementById("modalMainImage");
const modalGallery = document.getElementById("modalGallery");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalColor = document.getElementById("modalColor");
const closeBtn = document.querySelector(".close");
const addToCartBtn = document.getElementById("addToCartBtn");

function openModal(index) {
    currentProduct = products[index];
    modal.style.display = "block";
    modalMainImage.src = currentProduct.image;
    modalName.textContent = currentProduct.name;
    modalPrice.textContent = `₱${currentProduct.price}`;
    modalColor.textContent = `Color: ${currentProduct.color}`;

    // Gallery
    modalGallery.innerHTML = "";
    if(currentProduct.gallery && currentProduct.gallery.length > 0){
        currentProduct.gallery.forEach(img => {
            const imgElem = document.createElement("img");
            imgElem.src = img;
            imgElem.onclick = () => modalMainImage.src = img;
            modalGallery.appendChild(imgElem);
        });
    }
}

// Close modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target == modal) modal.style.display = "none"; }

// ----- Filtering & Sorting -----
function filterAndSort() {
    let filtered = [...products];

    const selectedColor = document.getElementById("colorFilter").value;
    if (selectedColor !== "all") filtered = filtered.filter(item => item.color === selectedColor);

    const sortType = document.getElementById("sort").value;
    if (sortType === "low-high") filtered.sort((a,b) => a.price - b.price);
    else if (sortType === "high-low") filtered.sort((a,b) => b.price - a.price);

    displayProducts(filtered);
}

document.getElementById("colorFilter").addEventListener("change", filterAndSort);
document.getElementById("sort").addEventListener("change", filterAndSort);

// ----- Add to Cart -----
addToCartBtn.onclick = () => {
    cart.push(currentProduct);
    updateCartCount();
    modal.style.display = "none";
};

function updateCartCount() {
    document.getElementById("cartCount").textContent = cart.length;
}

// ----- Cart Modal -----
const cartModal = document.getElementById("cartModal");
const closeCartBtn = document.querySelector(".closeCart");
const cartIcon = document.getElementById("cartIcon");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

cartIcon.onclick = () => {
    cartModal.style.display = "block";
    displayCartItems();
};

closeCartBtn.onclick = () => cartModal.style.display = "none";
window.onclick = (e) => { if(e.target == cartModal) cartModal.style.display = "none"; }

function displayCartItems() {
    let cartHTML = "";
    let total = 0;

    cart.forEach((item, idx) => {
        total += item.price;

        cartHTML += `
        <div class="cart-item">
            <div class="cart-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>₱${item.price}</p>
                    <p>Color: ${item.color}</p>
                </div>
            </div>
            <button class="removeBtn" data-index="${idx}">Remove</button>
        </div>
        `;
    });

    cartItemsDiv.innerHTML = cartHTML;
    cartTotal.textContent = `Total: ₱${total}`;
    document.getElementById("cartNote").textContent = `You have ${cart.length} item(s) in your cart.`;

    // Attach remove functionality to all remove buttons
    document.querySelectorAll(".removeBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            cart.splice(index, 1);       // Remove item from cart
            updateCartCount();           // Update cart count
            displayCartItems();          // Refresh cart display
        });
    });
}

// ----- Initial Display -----
displayProducts(products);