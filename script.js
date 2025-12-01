// Global Variables
let cart = [];
let currentProduct = null;

// ==========================================
// 1. LIGHTBOX FUNCTIONS (Global Scope)
// ==========================================
// These must be outside to work with HTML onclick attributes
function openImageLightbox(imageSrc, caption = "") {
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCaption = document.querySelector(".lightbox-caption");

    if (lightbox && lightboxImage) {
        lightboxImage.src = imageSrc;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        
        lightbox.style.display = 'flex'; // Use Flex to center
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
}

function closeImageLightbox() {
    const lightbox = document.getElementById("imageLightbox");
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

// ==========================================
// 2. PRODUCT DISPLAY LOGIC
// ==========================================
function displayProducts(items) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `<p style="width:100%; text-align:center; padding:50px;">No jewelry found matching your search.</p>`;
        return;
    }

    items.forEach((item) => {
        const originalIndex = products.indexOf(item);
        container.innerHTML += `
            <div class="product" onclick="openModal(${originalIndex})">
                <img src="${item.image}" alt="${item.name}">
                <h2>${item.name}</h2>
                <h3>₱${item.price.toLocaleString()}</h3>
            </div>
        `;
    });
}

// ==========================================
// 3. PRODUCT MODAL LOGIC
// ==========================================
const modal = document.getElementById("productModal");
const modalMainImage = document.getElementById("modalMainImage");
const modalGallery = document.getElementById("modalGallery");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDetails = document.getElementById("modalDetails");
const closeProductBtn = document.querySelector(".productClose");
const addToCartBtn = document.getElementById("addToCartBtn");

function openModal(index) {
    currentProduct = products[index];
    modal.style.display = "block";

    modalMainImage.src = currentProduct.image;
    modalName.textContent = currentProduct.name;
    modalPrice.textContent = `₱${currentProduct.price.toLocaleString()}`;
    
    // Zoom on Main Image Click
    modalMainImage.onclick = function() {
        openImageLightbox(currentProduct.image, currentProduct.name);
    };

    // Gallery
        modalGallery.innerHTML = "";
    if(currentProduct.gallery) {
        currentProduct.gallery.forEach((img) => {
            const imgElem = document.createElement("img");
            imgElem.src = img;
            
            // NEW: When gallery image is clicked, switch main image AND update zoom
            imgElem.onclick = () => {
                modalMainImage.src = img;
                // Update onclick to zoom the NEW image
                modalMainImage.onclick = function() {
                    openImageLightbox(this.src, currentProduct.name);
                };
            };
            
            modalGallery.appendChild(imgElem);
        });
    }

    // Details
    if (modalDetails) {
        let detailsHTML = '';
        if (currentProduct.metal) detailsHTML += `<div class="detail-item"><span class="detail-label">Metal</span><span class="detail-value">${currentProduct.metal}</span></div>`;
        if (currentProduct.gemstone) detailsHTML += `<div class="detail-item"><span class="detail-label">Gemstone</span><span class="detail-value">${currentProduct.gemstone}</span></div>`;
        if (currentProduct.description) detailsHTML += `<div class="detail-item"><span class="detail-label">Description</span><span class="detail-value">${currentProduct.description}</span></div>`;
        modalDetails.innerHTML = detailsHTML;
    }
}

// Close Product Modal (and Lightbox if open)
closeProductBtn.onclick = () => {
    modal.style.display = "none";
    closeImageLightbox();
};

// ==========================================
// 4. INITIALIZATION (Runs when page loads)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. LIGHTBOX EVENT LISTENERS (The Fix) ---
    const lightbox = document.getElementById("imageLightbox");
    const lightboxClose = document.querySelector(".lightbox-close");

    // Close on X button click
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeImageLightbox);
    }
    
    // Close on Background click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeImageLightbox();
            }
        });
    }

    // --- B. DROPDOWN LOGIC ---
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const selectedText = dropdown.querySelector('.selected-text');
        const options = dropdown.querySelectorAll('.dropdown-menu li');

        btn.addEventListener('click', (e) => {
            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });
            dropdown.classList.toggle('active');
            e.stopPropagation();
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selectedText.innerText = option.innerText;
                dropdown.classList.remove('active');
            });
        });
    });

    document.addEventListener('click', (e) => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });

    // --- C. INITIAL DISPLAY ---
    if (typeof products !== 'undefined') {
        displayProducts(products);
    }
});

// ==========================================
// 5. SEARCH & CART
// ==========================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredProducts = products.filter(item => {
        return item.name.toLowerCase().includes(searchTerm) || 
               (item.category && item.category.toLowerCase().includes(searchTerm));
    });
    displayProducts(filteredProducts);
}

if(searchBtn) searchBtn.addEventListener('click', performSearch);
if(searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    searchInput.addEventListener('input', performSearch);
}

// Cart Logic
addToCartBtn.onclick = () => {
    cart.push(currentProduct);
    updateCartCount();
    modal.style.display = "none";
};

function updateCartCount() {
    document.getElementById("cartCount").textContent = cart.length;
}

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
                    <p>₱${item.price.toLocaleString()}</p>
                </div>
            </div>
            <button class="removeBtn" data-index="${idx}">Remove</button>
        </div>`;
    });
    cartItemsDiv.innerHTML = cartHTML;
    cartTotal.textContent = `Total: ₱${total.toLocaleString()}`;
    document.getElementById("cartNote").textContent = `You have ${cart.length} item(s) in your cart.`;
    
    document.querySelectorAll(".removeBtn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            cart.splice(index, 1);
            updateCartCount();
            displayCartItems();
        });
    });
}

// Global modal close
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
    if (e.target === cartModal) cartModal.style.display = "none";
});