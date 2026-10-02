// ===== Digital Library Management System — Main Script =====

// -------------------- Sample Books --------------------
// These are loaded into localStorage only the very first time the project is opened.
const SAMPLE_BOOKS = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    year: 1960,
    status: "available",
    issuedTo: "",
    issueDate: ""
  },
  {
    id: 2,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    genre: "Science",
    year: 1988,
    status: "available",
    issuedTo: "",
    issueDate: ""
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    year: 1925,
    status: "issued",
    issuedTo: "Rahul Sharma",
    issueDate: "2026-09-25"
  },
  {
    id: 4,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    genre: "Computer Science",
    year: 2009,
    status: "available",
    issuedTo: "",
    issueDate: ""
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Fiction",
    year: 1813,
    status: "issued",
    issuedTo: "Priya Patel",
    issueDate: "2026-09-28"
  },
  {
    id: 6,
    title: "The Art of Computer Programming",
    author: "Donald Knuth",
    genre: "Computer Science",
    year: 1968,
    status: "available",
    issuedTo: "",
    issueDate: ""
  }
];

// -------------------- localStorage Helpers --------------------

/** Load books array from localStorage */
function getBooks() {
  const data = localStorage.getItem("library_books");
  return data ? JSON.parse(data) : [];
}

/** Save books array to localStorage */
function saveBooks(books) {
  localStorage.setItem("library_books", JSON.stringify(books));
}

/** Seed sample data if localStorage is empty (first visit) */
function seedIfEmpty() {
  if (!localStorage.getItem("library_books")) {
    saveBooks(SAMPLE_BOOKS);
  }
}

/** Generate the next unique ID */
function nextId() {
  const books = getBooks();
  if (books.length === 0) return 1;
  return Math.max(...books.map(b => b.id)) + 1;
}

// -------------------- Dashboard (index.html) --------------------

function renderDashboard() {
  const books = getBooks();
  const total = books.length;
  const available = books.filter(b => b.status === "available").length;
  const issued = books.filter(b => b.status === "issued").length;

  // Update the three stat cards
  document.getElementById("totalBooks").textContent = total;
  document.getElementById("availableBooks").textContent = available;
  document.getElementById("issuedBooks").textContent = issued;

  // Recent books table (show last 5 added)
  const tbody = document.getElementById("recentBooksBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const recent = books.slice(-5).reverse(); // last 5, newest first
  recent.forEach(book => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>
        <span class="badge ${book.status === 'available' ? 'badge-available' : 'badge-issued'}">
          ${book.status === 'available' ? 'Available' : 'Issued'}
        </span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// -------------------- Book Catalog (books.html) --------------------

let editingBookId = null; // Track which book is being edited

/** Render the full book table, optionally filtered by a search query */
function renderBookTable(query = "") {
  const books = getBooks();
  const tbody = document.getElementById("bookTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  // Filter books by title, author, or genre (case-insensitive)
  const q = query.toLowerCase().trim();
  const filtered = q
    ? books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
      )
    : books;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No books found.</td></tr>`;
    return;
  }

  filtered.forEach(book => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.year}</td>
      <td>
        <span class="badge ${book.status === 'available' ? 'badge-available' : 'badge-issued'}">
          ${book.status === 'available' ? 'Available' : 'Issued'}
        </span>
      </td>
      <td>
        <button class="btn btn-warning btn-small" onclick="editBook(${book.id})">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

/** Show the add/edit form panel */
function showBookForm() {
  document.getElementById("bookFormPanel").classList.remove("hidden");
  document.getElementById("formTitle").textContent = "Add New Book";
  clearBookForm();
  editingBookId = null;
}

/** Hide the form panel */
function hideBookForm() {
  document.getElementById("bookFormPanel").classList.add("hidden");
  clearBookForm();
  editingBookId = null;
}

/** Clear all form inputs */
function clearBookForm() {
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookGenre").value = "";
  document.getElementById("bookYear").value = "";
}

/** Handle form submission — add or update a book */
function handleBookFormSubmit(event) {
  event.preventDefault();

  const title  = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const genre  = document.getElementById("bookGenre").value.trim();
  const year   = parseInt(document.getElementById("bookYear").value, 10);

  // Basic validation
  if (!title || !author || !genre || isNaN(year)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const books = getBooks();

  if (editingBookId !== null) {
    // Update existing book
    const index = books.findIndex(b => b.id === editingBookId);
    if (index !== -1) {
      books[index].title  = title;
      books[index].author = author;
      books[index].genre  = genre;
      books[index].year   = year;
    }
  } else {
    // Add new book
    books.push({
      id: nextId(),
      title,
      author,
      genre,
      year,
      status: "available",
      issuedTo: "",
      issueDate: ""
    });
  }

  saveBooks(books);
  hideBookForm();
  renderBookTable();
}

/** Pre-fill form for editing */
function editBook(id) {
  const books = getBooks();
  const book = books.find(b => b.id === id);
  if (!book) return;

  editingBookId = id;
  document.getElementById("bookFormPanel").classList.remove("hidden");
  document.getElementById("formTitle").textContent = "Edit Book";
  document.getElementById("bookTitle").value  = book.title;
  document.getElementById("bookAuthor").value = book.author;
  document.getElementById("bookGenre").value  = book.genre;
  document.getElementById("bookYear").value   = book.year;

  // Scroll to the form
  document.getElementById("bookFormPanel").scrollIntoView({ behavior: "smooth" });
}

/** Delete a book after confirmation */
function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;
  let books = getBooks();
  books = books.filter(b => b.id !== id);
  saveBooks(books);
  renderBookTable();
}

/** Handle search input */
function handleSearch() {
  const query = document.getElementById("searchInput").value;
  renderBookTable(query);
}

// -------------------- Issue / Return (issue-return.html) --------------------

/** Populate the book dropdown with available books */
function populateIssueDropdown() {
  const select = document.getElementById("issueBookSelect");
  if (!select) return;

  const books = getBooks().filter(b => b.status === "available");
  select.innerHTML = '<option value="">-- Select a Book --</option>';
  books.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.id;
    opt.textContent = `${b.title} — ${b.author}`;
    select.appendChild(opt);
  });
}

/** Handle issuing a book */
function handleIssueBook(event) {
  event.preventDefault();

  const bookId   = parseInt(document.getElementById("issueBookSelect").value, 10);
  const issuedTo = document.getElementById("issuedTo").value.trim();

  if (!bookId || !issuedTo) {
    alert("Please select a book and enter the borrower's name.");
    return;
  }

  const books = getBooks();
  const index = books.findIndex(b => b.id === bookId);
  if (index === -1) return;

  books[index].status    = "issued";
  books[index].issuedTo  = issuedTo;
  books[index].issueDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  saveBooks(books);
  alert(`"${books[index].title}" has been issued to ${issuedTo}.`);

  // Reset form and refresh
  document.getElementById("issueForm").reset();
  populateIssueDropdown();
  renderIssuedBooksTable();
}

/** Render the table of currently issued books */
function renderIssuedBooksTable() {
  const tbody = document.getElementById("issuedBooksBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const issued = getBooks().filter(b => b.status === "issued");

  if (issued.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No books are currently issued.</td></tr>`;
    return;
  }

  issued.forEach(book => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.issuedTo}</td>
      <td>${book.issueDate}</td>
      <td>
        <button class="btn btn-success btn-small" onclick="returnBook(${book.id})">Return</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

/** Mark a book as returned */
function returnBook(id) {
  const books = getBooks();
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return;

  const title = books[index].title;
  books[index].status    = "available";
  books[index].issuedTo  = "";
  books[index].issueDate = "";

  saveBooks(books);
  alert(`"${title}" has been returned successfully.`);

  populateIssueDropdown();
  renderIssuedBooksTable();
}

// -------------------- Initialization --------------------
// This runs when any page loads.

document.addEventListener("DOMContentLoaded", function () {
  // Seed sample books on first visit
  seedIfEmpty();

  // Detect which page we're on and render accordingly
  const page = document.body.getAttribute("data-page");

  switch (page) {
    case "dashboard":
      renderDashboard();
      break;

    case "books":
      renderBookTable();
      // Attach event listeners
      document.getElementById("bookForm").addEventListener("submit", handleBookFormSubmit);
      document.getElementById("searchInput").addEventListener("input", handleSearch);
      break;

    case "issue-return":
      populateIssueDropdown();
      renderIssuedBooksTable();
      document.getElementById("issueForm").addEventListener("submit", handleIssueBook);
      break;

    case "about":
      // No dynamic content needed
      break;
  }
});
