// Sample product data for demonstration
const products = [
  {
    id: 1,
    name: "Smartphone Pro X",
    price: 699.99,
    description: "A cutting-edge smartphone with exceptional performance and a stunning display.",
    image: "https://source.unsplash.com/800x600/?smartphone"
  },
  {
    id: 2,
    name: "UltraBook 15\"",
    price: 1299.99,
    description: "A sleek and powerful ultrabook designed for professionals on the go.",
    image: "https://source.unsplash.com/800x600/?laptop"
  },
  {
    id: 3,
    name: "Noise-Cancelling Headphones",
    price: 199.99,
    description: "Experience pure sound with advanced noise-cancelling technology.",
    image: "https://source.unsplash.com/800x600/?headphones"
  }
  // Additional product objects can be added here.
];

// Global Variables
let cart = [];
let wishlist = [];
let currentProduct = null;

// Fuse.js Options for Fuzzy Search
const fuseOptions = {
  keys: ['name', 'description'],
  threshold: 0.4
};
const fuse = new Fuse(products, fuseOptions);

// Navigation & Rendering
function navigate(hash) {
  window.location.href = hash + ".html";
}

// For pages that use dynamic rendering (index, shop, product, cart, checkout, wishlist)
function renderFeaturedProducts() {
  const featuredGrid = document.getElementById('featured-products');
  if (!featuredGrid) return;
  featuredGrid.innerHTML = products.slice(0, 3).map(product => `
    <div class="product-card" onclick="location.href='product.html?id=${product.id}'">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="btn" onclick="event.stopPropagation(); addToCart(${product.id});">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function renderShopProducts(filteredProducts = null) {
  const shopGrid = document.getElementById('shop-products');
  if (!shopGrid) return;
  const list = filteredProducts || products;
  shopGrid.innerHTML = list.map(product => `
    <div class="product-card" onclick="location.href='product.html?id=${product.id}'">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="btn" onclick="event.stopPropagation(); addToCart(${product.id});">Add to Cart</button>
      </div>
    </div>
  `).join('');
}

function performSearch() {
  const query = document.getElementById('searchInput').value;
  if (query.trim() === '') {
    renderShopProducts();
    return;
  }
  const result = fuse.search(query);
  const matchedProducts = result.map(r => r.item);
  renderShopProducts(matchedProducts);
}

function showProductFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;
  const product = products.find(p => p.id === id);
  if (product) {
    currentProduct = product;
    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-image').alt = product.name;
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-price').textContent = "$" + product.price.toFixed(2);
    document.getElementById('detail-description').textContent = product.description;
    // Set wishlist icon state
    const icon = document.getElementById('wishlist-icon');
    if (wishlist.find(item => item.id === product.id)) {
      icon.classList.add("active");
      icon.classList.replace("far", "fas");
    } else {
      icon.classList.remove("active");
      icon.classList.replace("fas", "far");
    }
    renderRecommended(product.id);
  }
}

function renderRecommended(currentId) {
  const recGrid = document.getElementById('recommended-products');
  if (!recGrid) return;
  const recommended = products.filter(p => p.id !== currentId).slice(0, 3);
  recGrid.innerHTML = recommended.map(product => `
    <div class="product-card" onclick="location.href='product.html?id=${product.id}'">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    cart.push(product);
    alert(product.name + " has been added to your cart!");
    renderCart();
  }
}

function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
  } else {
    cartContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div style="display:flex; align-items:center;">
          <img src="${item.image}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <p>$${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div class="cart-item-actions">
          <button onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  }
  document.querySelector('.cart-badge').textContent = cart.length;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function updateOrderSummary() {
  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
  const shipping = subtotal > 0 ? 25.00 : 0.00;
  const total = subtotal + shipping;
  document.getElementById('summary-subtotal').textContent = "$" + subtotal.toFixed(2);
  document.getElementById('summary-shipping').textContent = "$" + shipping.toFixed(2);
  document.getElementById('summary-total').textContent = "$" + total.toFixed(2);
}

function processCheckout(event) {
  event.preventDefault();
  alert("Thank you for your purchase!");
  cart = [];
  document.getElementById('checkoutForm').reset();
  navigate('index');
}

function renderWishlist() {
  const wishlistGrid = document.getElementById('wishlist-grid');
  if (!wishlistGrid) return;
  if (wishlist.length === 0) {
    wishlistGrid.innerHTML = "<p style='text-align:center;'>Your wishlist is empty.</p>";
  } else {
    wishlistGrid.innerHTML = wishlist.map(item => `
      <div class="product-card" onclick="location.href='product.html?id=${item.id}'">
        <img src="${item.image}" alt="${item.name}">
        <div class="product-info">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
          <i class="fas fa-heart wishlist-icon active" onclick="toggleWishlistFromCard(event, ${item.id})"></i>
        </div>
      </div>
    `).join('');
  }
}

function toggleWishlist() {
  if (!currentProduct) return;
  const icon = document.getElementById('wishlist-icon');
  const index = wishlist.findIndex(item => item.id === currentProduct.id);
  if (index === -1) {
    wishlist.push(currentProduct);
    icon.classList.add("active");
    icon.classList.replace("far", "fas");
    alert(currentProduct.name + " added to wishlist!");
  } else {
    wishlist.splice(index, 1);
    icon.classList.remove("active");
    icon.classList.replace("fas", "far");
    alert(currentProduct.name + " removed from wishlist!");
  }
  renderWishlist();
}

function toggleWishlistFromCard(event, id) {
  event.stopPropagation();
  const product = products.find(p => p.id === id);
  const index = wishlist.findIndex(item => item.id === product.id);
  if (index === -1) {
    wishlist.push(product);
    alert(product.name + " added to wishlist!");
  } else {
    wishlist.splice(index, 1);
    alert(product.name + " removed from wishlist!");
  }
  renderWishlist();
}

function buyNow() {
  if (currentProduct) {
    cart.push(currentProduct);
    alert("You purchased " + currentProduct.name + "!");
    renderCart();
    navigate('checkout');
  }
}

function handleBuy() {
  if (currentProduct) {
    cart.push(currentProduct);
    alert(currentProduct.name + " has been added to your cart!");
    renderCart();
  }
}

// Execute when product.html loads (if applicable)
if (window.location.pathname.endsWith("product.html")) {
  showProductFromQuery();
}

function showProductFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;
  const product = products.find(p => p.id === id);
  if (product) {
    currentProduct = product;
    document.getElementById('detail-image').src = product.image;
    document.getElementById('detail-image').alt = product.name;
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-price').textContent = "$" + product.price.toFixed(2);
    document.getElementById('detail-description').textContent = product.description;
    const icon = document.getElementById('wishlist-icon');
    if (wishlist.find(item => item.id === product.id)) {
      icon.classList.add("active");
      icon.classList.replace("far", "fas");
    } else {
      icon.classList.remove("active");
      icon.classList.replace("fas", "far");
    }
    renderRecommended(product.id);
  }
}
