const menuItems = [
  // Drinks
  { id: 1, name: "Rose Latte", desc: "Espresso with steamed milk and rose syrup", price: 4.50, emoji: "☕", cat: "drinks", tag: "Popular" },
  { id: 2, name: "Lavender Mocha", desc: "Rich chocolate with a hint of lavender", price: 5.00, emoji: "☕", cat: "drinks" },
  { id: 3, name: "Matcha Cloud", desc: "Ceremonial matcha with oat milk foam", price: 5.25, emoji: "🍵", cat: "drinks", tag: "New" },
  { id: 4, name: "Strawberry Milk", desc: "Fresh strawberry puree with cold milk", price: 4.00, emoji: "🍓", cat: "drinks" },
  { id: 5, name: "Iced Peach Tea", desc: "Brewed black tea with peach and mint", price: 3.75, emoji: "🍑", cat: "drinks" },
  { id: 6, name: "Vanilla Cloud", desc: "Cold brew topped with vanilla sweet cream", price: 4.75, emoji: "🧊", cat: "drinks" },
  { id: 7, name: "Butterfly Pea Lemonade", desc: "Color-changing citrus refresher", price: 4.25, emoji: "🦋", cat: "drinks", tag: "Fun" },
  { id: 8, name: "Hot Chocolate", desc: "Belgian cocoa with whipped cream", price: 3.50, emoji: "🍫", cat: "drinks" },

    // Food
  { id: 9, name: "Avocado Toast", desc: "Sourdough, smashed avo, chili flakes", price: 7.50, emoji: "🥑", cat: "food" },
  { id: 10, name: "Berry Pancakes", desc: "Fluffy pancakes with mixed berries", price: 8.00, emoji: "🥞", cat: "food", tag: "Popular" },
  { id: 11, name: "Croissant", desc: "Buttery, flaky, baked fresh daily", price: 3.25, emoji: "🥐", cat: "food" },
  { id: 12, name: "Grilled Cheese", desc: "Three-cheese melt on sourdough", price: 6.50, emoji: "🧀", cat: "food" },
  { id: 13, name: "Caesar Salad", desc: "Romaine, parmesan, croutons", price: 7.00, emoji: "🥗", cat: "food" },
  { id: 14, name: "Egg & Cheese Bagel", desc: "Toasted bagel with egg and cheddar", price: 5.50, emoji: "🥯", cat: "food" },

  // Desserts
  { id: 15, name: "Strawberry Cake", desc: "Layered sponge with fresh cream", price: 5.50, emoji: "🍰", cat: "desserts", tag: "Sweet" },
  { id: 16, name: "Macaron Box (6)", desc: "Assorted pastel macarons", price: 9.00, emoji: "🍪", cat: "desserts" },
  { id: 17, name: "Cheesecake", desc: "New York style with berry compote", price: 6.00, emoji: "🍰", cat: "desserts" },
  { id: 18, name: "Brownie Sundae", desc: "Warm brownie, ice cream, fudge", price: 6.50, emoji: "🍨", cat: "desserts" },
  { id: 19, name: "Fruit Tart", desc: "Pastry cream with seasonal fruit", price: 5.00, emoji: "🥧", cat: "desserts" },
  { id: 20, name: "Cupcake", desc: "Vanilla with pastel buttercream", price: 3.75, emoji: "🧁", cat: "desserts", tag: "Cute" }
];

let cart = {};
let activeFilter = "all";

const grid = document.getElementById("menuGrid");
const cartCount = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const overlay = document.getElementById("overlay");
const drawer = document.getElementById("drawer");
const modal = document.getElementById("modal");
const toast = document.getElementById("toast");

function renderMenu() {
  const filtered = activeFilter === "all" ? menuItems : menuItems.filter(m => m.cat === activeFilter);
  grid.innerHTML = filtered.map(m => `
    <div class="menu-card">
      ${m.tag ? `<span class="tag">${m.tag}</span>` : ""}
      <div class="emoji">${m.emoji}</div>
      <h3>${m.name}</h3>
      <div class="desc">${m.desc}</div>
      <div class="price-row">
        <span class="price">$${m.price.toFixed(2)}</span>
        <button class="add-btn" onclick="addToCart(${m.id})">Add +</button>
      </div>
    </div>
  `).join("");
}

function setFilter(f, btn) {
  activeFilter = f;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderMenu();
}

function addToCart(id) {
  if (!cart[id]) cart[id] = 0;
  cart[id]++;
  updateCart();
  showToast("Added to cart ✨");
}

function updateQty(id, delta) {
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  updateCart();
}

function removeItem(id) {
  delete cart[id];
  updateCart();
}

function updateCart() {
  const ids = Object.keys(cart);
  const totalQty = ids.reduce((s, id) => s + cart[id], 0);
  cartCount.textContent = totalQty;
  if (ids.length === 0) {
    cartItemsEl.innerHTML = `<div class="empty-cart"><div class="emoji">🧺</div><p>Your cart is empty</p><p style="font-size:13px;margin-top:6px;">Add some treats to get started!</p></div>`;
  } else {
    cartItemsEl.innerHTML = ids.map(id => {
      const m = menuItems.find(x => x.id == id);
      return `
        <div class="cart-item">
          <div class="ci-emoji">${m.emoji}</div>
          <div class="ci-info">
            <div class="ci-name">${m.name}</div>
            <div class="ci-price">$${m.price.toFixed(2)} each</div>
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty(${id}, -1)">−</button>
            <span class="qty-num">${cart[id]}</span>
            <button class="qty-btn" onclick="updateQty(${id}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${id})">✕</button>
        </div>
      `;
    }).join("");
  }
  const subtotal = ids.reduce((s, id) => {
    const m = menuItems.find(x => x.id == id);
    return s + m.price * cart[id];
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  cartSubtotalEl.textContent = "$" + subtotal.toFixed(2);
  cartTotalEl.textContent = "$" + total.toFixed(2);
  document.getElementById("cartTax").textContent = "$" + tax.toFixed(2);
  const checkoutBtn = document.getElementById("checkoutBtn");
  checkoutBtn.disabled = ids.length === 0;
}

function openCart() {
  overlay.classList.add("open");
  drawer.classList.add("open");
}
function closeCart() {
  overlay.classList.remove("open");
  drawer.classList.remove("open");
}
function openModal() {
  closeCart();
  modal.classList.add("open");
}
function closeModal() {
  modal.classList.remove("open");
}
function placeOrder(e) {
  e.preventDefault();
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const type = document.getElementById("orderType").value;
  const note = document.getElementById("custNote").value.trim();
  const ids = Object.keys(cart);
  if (ids.length === 0) return;
  const subtotal = ids.reduce((s, id) => {
    const m = menuItems.find(x => x.id == id);
    return s + m.price * cart[id];
  }, 0);
  const total = subtotal * 1.08;
  const orderNo = Math.floor(1000 + Math.random() * 9000);
  document.getElementById("orderNo").textContent = "#" + orderNo;
  document.getElementById("orderTotal").textContent = "$" + total.toFixed(2);
  document.getElementById("orderName").textContent = name || "Guest";
  document.getElementById("orderTypeOut").textContent = type;
  cart = {};
  updateCart();
  closeModal();
  document.getElementById("successModal").classList.add("open");
  document.getElementById("orderForm").reset();
}
function closeSuccess() {
  document.getElementById("successModal").classList.remove("open");
}
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  updateCart();
  document.getElementById("orderForm").addEventListener("submit", placeOrder);
});

