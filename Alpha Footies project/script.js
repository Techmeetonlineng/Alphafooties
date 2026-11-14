const whatsappNumber = "2349056947405";
const productGrid = document.getElementById("productGrid");
const searchBar = document.getElementById("searchBar");
const filterButtons = document.querySelectorAll(".filter-btn");
const noResults = document.getElementById("noResults");
const visibleCount = document.getElementById("visibleCount");
const postCount = document.getElementById("postCount");

if (!Array.isArray(window.products)) {
  throw new Error("Product list is missing. Check that products.js is loaded.");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function createOrderUrl(productName) {
  const message = `Hello Alpha Footies, I'm interested in the ${productName}. Please confirm the price, available sizes, and colours.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function getPriceLabel(product) {
  if (product.price) return product.price;

  const categoryPrices = {
    shoes: "From ₦45,000",
    heels: "From ₦45,000",
    slides: "From ₦20,000",
    sandals: "₦15,000–₦20,000",
    slippers: "₦15,000–₦20,000",
  };

  return categoryPrices[product.category] || "Ask for price";
}

function renderProducts() {
  productGrid.innerHTML = window.products
    .map((product) => {
      const name = escapeHtml(product.name);
      const category = escapeHtml(product.category);
      const categoryLabel = escapeHtml(
        product.category === "belts"
          ? "Belts & accessories"
          : product.category,
      );
      const caption = escapeHtml(product.caption);
      const image = escapeHtml(product.image);
      const price = escapeHtml(getPriceLabel(product));
      const searchText = escapeHtml(
        `${product.name} ${product.category} ${product.caption}`,
      ).toLowerCase();
      const orderUrl = createOrderUrl(product.name);

      return `
        <article class="post-card" data-category="${category}" data-search="${searchText}">
          <a
            class="post-image-link"
            href="${orderUrl}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ask about ${name} on WhatsApp"
          >
            <img src="images/${image}" alt="${name}" loading="lazy" />
            <span class="image-action">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
              Ask about this pair
            </span>
          </a>
          <div class="post-caption">
            <div class="post-title-row">
              <span class="post-category">${categoryLabel}</span>
              <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </div>
            <h3>${name}</h3>
            <p class="post-price">${price}</p>
            <p>${caption}</p>
            <a class="post-order-link" href="${orderUrl}" target="_blank" rel="noopener noreferrer">
              Ask for price &amp; sizes
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </article>`;
    })
    .join("");

  postCount.textContent = String(window.products.length);
  filterProducts();
}

function filterProducts() {
  const activeButton = document.querySelector(".filter-btn.active");
  const activeCategory = activeButton?.dataset.category || "all";
  const searchTerm = searchBar.value.trim().toLowerCase();
  const cards = productGrid.querySelectorAll(".post-card");
  let visible = 0;

  cards.forEach((card) => {
    const matchesCategory =
      activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesSearch = card.dataset.search.includes(searchTerm);
    const isVisible = matchesCategory && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) visible += 1;
  });

  visibleCount.textContent = String(visible);
  noResults.hidden = visible !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    filterProducts();
  });
});

searchBar.addEventListener("input", filterProducts);
renderProducts();
