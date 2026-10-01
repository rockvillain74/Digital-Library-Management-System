/* ===== Digital Library - Simple JavaScript ===== */

// ─── Sample Books Data ───
const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    year: 1925,
    isbn: "978-0743273565",
    description: "A story of the mysteriously wealthy Jay Gatsby set in the Jazz Age.",
    available: true
  },
  {
    id: 2,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    year: 1988,
    isbn: "978-0553380163",
    description: "Explores time, the universe, and black holes in simple language.",
    available: true
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    category: "History",
    year: 2011,
    isbn: "978-0062316097",
    description: "A brief history of humankind from ancient times to the present.",
    available: false
  },
  {
    id: 4,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    year: 2008,
    isbn: "978-0132350884",
    description: "A handbook of agile software craftsmanship for writing better code.",
    available: true
  },
  {
    id: 5,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    year: 1960,
    isbn: "978-0061120084",
    description: "A classic novel about racial injustice in the American South.",
    available: true
  },
  {
    id: 6,
    title: "The Art of War",
    author: "Sun Tzu",
    category: "History",
    year: -500,
    isbn: "978-1599869773",
    description: "An ancient Chinese military treatise on strategy and warfare.",
    available: true
  },
  {
    id: 7,
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    year: 1949,
    isbn: "978-0451524935",
    description: "A dystopian novel about totalitarianism and mass surveillance.",
    available: false
  },
  {
    id: 8,
    title: "The Selfish Gene",
    author: "Richard Dawkins",
    category: "Science",
    year: 1976,
    isbn: "978-0198788607",
    description: "A groundbreaking book on evolution and genetics.",
    available: true
  }
];

// ─── LocalStorage Functions ───
function getBooks() {
  let books = localStorage.getItem("libraryBooks");
  if (!books) {
    localStorage.setItem("libraryBooks", JSON.stringify(sampleBooks));
    return sampleBooks;
  }
  return JSON.parse(books);
}

function saveBooks(books) {
  localStorage.setItem("libraryBooks", JSON.stringify(books));
}

function addBook(book) {
  let books = getBooks();
  book.id = Date.now(); // simple unique id
  books.push(book);
  saveBooks(books);
}

function deleteBook(id) {
  let books = getBooks();
  books = books.filter(b => b.id !== id);
  saveBooks(books);
}

function searchBooks(query) {
  let books = getBooks();
  query = query.toLowerCase();
  return books.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query) ||
    b.category.toLowerCase().includes(query)
  );
}

// ─── Get Category Color ───
function getCategoryColor(category) {
  const colors = {
    "Fiction": "#9b59b6",
    "Science": "#3498db",
    "History": "#e67e22",
    "Technology": "#2ecc71",
    "Philosophy": "#1abc9c",
    "Art": "#e74c3c"
  };
  return colors[category] || "#95a5a6";
}

// ─── Show Toast Notification ───
function showToast(message, type) {
  let toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── Render Book Cards ───
function renderBookCards(books, containerId) {
  let container = document.getElementById(containerId);
  if (!container) return;

  if (books.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#999; padding:40px;">No books found.</p>';
    return;
  }

  let html = "";
  books.forEach(book => {
    let color = getCategoryColor(book.category);
    html += `
      <div class="book-card">
        <div class="book-cover" style="background:${color}">
          📖
        </div>
        <div class="book-info">
          <h3>${book.title}</h3>
          <p class="author">by ${book.author}</p>
          <span class="category" style="background:${color}">${book.category}</span>
          <p class="year">Year: ${book.year > 0 ? book.year : Math.abs(book.year) + " BC"}</p>
        </div>
        <div class="book-actions">
          <button class="btn btn-primary" onclick="viewBook(${book.id})">View</button>
          <button class="btn btn-danger" onclick="removeBook(${book.id})">Delete</button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ─── View Book Details (Alert) ───
function viewBook(id) {
  let books = getBooks();
  let book = books.find(b => b.id === id);
  if (book) {
    alert(
      "📖 " + book.title + "\n\n" +
      "Author: " + book.author + "\n" +
      "Category: " + book.category + "\n" +
      "Year: " + book.year + "\n" +
      "ISBN: " + book.isbn + "\n" +
      "Status: " + (book.available ? "Available" : "Not Available") + "\n\n" +
      "Description:\n" + book.description
    );
  }
}

// ─── Delete Book ───
function removeBook(id) {
  if (confirm("Are you sure you want to delete this book?")) {
    deleteBook(id);
    showToast("Book deleted successfully!", "success");
    // Refresh the page content
    initCurrentPage();
  }
}

// ─── Render Stats ───
function renderStats() {
  let container = document.getElementById("stats-container");
  if (!container) return;

  let books = getBooks();
  let available = books.filter(b => b.available).length;
  let categories = [...new Set(books.map(b => b.category))].length;

  container.innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${books.length}</div>
      <div class="stat-label">Total Books</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${available}</div>
      <div class="stat-label">Available</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${books.length - available}</div>
      <div class="stat-label">Checked Out</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${categories}</div>
      <div class="stat-label">Categories</div>
    </div>
  `;
}

// ─── HOME PAGE ───
function initHomePage() {
  renderStats();

  // Show last 4 books
  let books = getBooks();
  let recentBooks = books.slice(-4);
  renderBookCards(recentBooks, "featured-books");

  // Hero search
  let form = document.getElementById("hero-search-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let query = document.getElementById("hero-search").value;
      window.location.href = "catalog.html?search=" + encodeURIComponent(query);
    });
  }
}

// ─── CATALOG PAGE ───
function initCatalogPage() {
  let books = getBooks();

  // Check for search query in URL
  let params = new URLSearchParams(window.location.search);
  let searchQuery = params.get("search") || "";

  let searchInput = document.getElementById("search-input");
  let categoryFilter = document.getElementById("category-filter");

  if (searchInput && searchQuery) {
    searchInput.value = searchQuery;
  }

  function applyFilters() {
    let query = searchInput ? searchInput.value : "";
    let category = categoryFilter ? categoryFilter.value : "";

    let filtered = getBooks();

    // Search filter
    if (query) {
      query = query.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter(b => b.category === category);
    }

    // Update count
    let countEl = document.getElementById("results-count");
    if (countEl) {
      countEl.textContent = "Showing " + filtered.length + " of " + getBooks().length + " books";
    }

    renderBookCards(filtered, "books-container");
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener("change", applyFilters);
  }

  // Initial render
  applyFilters();
}

// ─── ADD BOOK PAGE ───
function initAddBookPage() {
  let form = document.getElementById("add-book-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get values
    let title = document.getElementById("book-title").value.trim();
    let author = document.getElementById("book-author").value.trim();
    let category = document.getElementById("book-category").value;
    let year = document.getElementById("book-year").value;
    let isbn = document.getElementById("book-isbn").value.trim();
    let description = document.getElementById("book-description").value.trim();
    let available = document.getElementById("book-status").value === "true";

    // Simple validation
    let valid = true;

    if (!title) {
      document.getElementById("title-error").textContent = "Title is required";
      valid = false;
    } else {
      document.getElementById("title-error").textContent = "";
    }

    if (!author) {
      document.getElementById("author-error").textContent = "Author is required";
      valid = false;
    } else {
      document.getElementById("author-error").textContent = "";
    }

    if (!category) {
      document.getElementById("category-error").textContent = "Please select a category";
      valid = false;
    } else {
      document.getElementById("category-error").textContent = "";
    }

    if (!year || year < 0 || year > 2030) {
      document.getElementById("year-error").textContent = "Enter a valid year";
      valid = false;
    } else {
      document.getElementById("year-error").textContent = "";
    }

    if (!isbn) {
      document.getElementById("isbn-error").textContent = "ISBN is required";
      valid = false;
    } else {
      document.getElementById("isbn-error").textContent = "";
    }

    if (!valid) return;

    // Create book object
    let newBook = {
      title: title,
      author: author,
      category: category,
      year: parseInt(year),
      isbn: isbn,
      description: description || "No description provided.",
      available: available
    };

    addBook(newBook);
    showToast("Book added successfully!", "success");
    form.reset();
  });
}

// ─── Detect Current Page and Initialize ───
function initCurrentPage() {
  let path = window.location.pathname.toLowerCase();

  if (path.includes("catalog")) {
    initCatalogPage();
  } else if (path.includes("add-book")) {
    initAddBookPage();
  } else if (path.includes("about")) {
    // No special JS needed for about page
  } else {
    // Default to home page
    initHomePage();
  }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", initCurrentPage);
