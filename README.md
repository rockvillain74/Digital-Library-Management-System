# 📚 Digital Library Management System

A simple college mini project built with **HTML, CSS, and JavaScript**.  
Manage a small library's book collection entirely in your browser — no server or database needed.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | See total books, available books, and issued books at a glance |
| **Book Catalog** | Add, edit, search, and delete books |
| **Issue / Return** | Mark a book as issued to someone or return it |
| **Persistent Data** | All data is saved in the browser's `localStorage` |
| **Sample Books** | 6 pre-loaded books so you can start exploring immediately |

---

## 📁 File Structure

```
Digital-Library-Management-System/
├── index.html          ← Dashboard (home page)
├── books.html          ← Book Catalog
├── issue-return.html   ← Issue / Return Books
├── about.html          ← About the project
├── style.css           ← Stylesheet
├── script.js           ← JavaScript logic
└── README.md           ← This file
```

---

## 🚀 How to Open & Use

### Step 1 — Open the project

1. Extract the ZIP file (if downloaded as a ZIP).
2. Open the `Digital-Library-Management-System` folder.
3. **Double-click `index.html`** — it will open in your default web browser.

> No server, no installation, no internet connection required!

### Step 2 — Explore the pages

- **Dashboard** (`index.html`) — Shows summary statistics and recently added books.
- **Book Catalog** (`books.html`) — Click **+ Add Book** to add a new book. Use the search bar to find books. Click **Edit** or **Delete** on any book row.
- **Issue / Return** (`issue-return.html`) — Select an available book from the dropdown, enter the borrower's name, and click **Issue Book**. To return a book, click the **Return** button next to it.
- **About** (`about.html`) — Read about the project.

### Step 3 — Your data persists

All changes are saved in the browser's `localStorage`. Refresh the page or close and reopen the browser — your data will still be there.

> **Tip:** If you ever want to reset to the original sample data, open the browser console (`F12` → Console tab) and run:
> ```js
> localStorage.removeItem("library_books");
> location.reload();
> ```

---

## 🛠️ Technologies Used

- **HTML5** — Page structure
- **CSS3** — Styling and layout
- **JavaScript (Vanilla)** — Logic, DOM manipulation, localStorage
- **No frameworks, libraries, or external dependencies**

---

## 📝 Notes

- This project is designed for **learning purposes** and college submissions.
- It runs entirely in the browser — no backend, no database, no login system.
- Data is stored per-browser. If you switch browsers or clear browser data, the records will reset.

---

## 📜 License

This project is free to use for educational purposes.
