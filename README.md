# BLEM'S PIZZARIA

> **Professional Web Application for a Pizzeria Targeting the U.S. Market**
> *Developed with 100% semantic HTML5 (zero classes), attribute-based CSS3, standalone JavaScript*

---

> ⚠️ **Prototype Disclaimer**
> This project is a **frontend-only prototype** built for demonstration and portfolio purposes. There is **no real backend, database, or payment processing** — all menu items, orders, reservations, and reviews are **fictitious data** persisted locally in the browser (`localStorage`). No real transactions, deliveries, or communications are made.

---

**📌 About the Project**

**BLEM'S PIZZARIA** is a modern, responsive web application with a high-end visual design (Dark Glassmorphism), designed specifically for the U.S. market (prices in USD `$`, classic American recipes such as *NY Style, Chicago Deep Dish, Detroit Style*, tip selector, and New York tax calculation).

The application features clean code architecture and a technical challenge successfully met: **Zero `class="..."` attributes and Zero `<div>` tags** in the HTML, using exclusively selectors based on HTML5 semantic elements, IDs, and `data-*` attributes.

---

**✨ Key Features**

- **🍽️ Filterable Interactive Menu**: Signature pizzas, sides, crispy wings, craft beverages, and desserts loaded dynamically.
- **✨ Custom Pizza Builder**: Allows customers to choose size (10", 12", 14", 18"), crust style (*NY Thin, Deep Dish, Detroit, Stuffed Crust, Gluten-Free*), sauces, and toppings with real-time price calculation and visual preview.
- **🛍️ Shopping Cart and Checkout**:
  - Delivery or Pickup options.
  - Driver tip calculator (*15%, 18%, 20%*—U.S. standard).
  - Discount coupon (`BLEMS10` for 10% OFF).
  - Automatic calculation of NY state sales tax (8.875%).
  - Simulated payment (*Credit Card, Apple Pay, Cash on Delivery*).
- **🎯 Real-Time Order Tracker**: A visual timeline that tracks the order status (*Received ➔ Preparing ➔ In Oven ➔ Out for Delivery ➔ Completed*) using a unique generated code (e.g., `BLEM-84920`).
- **📅 Table Reservation System**: Form for scheduling the date, time, number of guests, and seating preference.
- **💾 Administrative Dashboard**: Portal for management to view stored orders and reservations and update kitchen statuses in real time.

---

**Technologies Used**

- **100% Semantic HTML5**: Structured without using any `<div>` tags or `class="..."` attributes. Uses native semantic elements such as `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<picture>`, `<figcaption>`, `<fieldset>`, `<legend>`, `<output>`, `<dialog>`, `<aside>`, `<footer>`, `<hgroup>`, `<address>`, `<time>`, `<mark>`, `<menu>`.
- **Modern CSS3 Using Attributes**: Styling based on Design Tokens (CSS variables), Glassmorphism with `backdrop-filter`, responsive layout via Flexbox and CSS Grid, `@keyframes` animations, and element- and attribute-oriented selectors (`[data-active="true"]`, `[data-category]`, `[data-type]`).
- **Standalone JavaScript (ES6+)**: Modular programming divided into controllers (`app.js`, `builder.js`, `cart.js`, `tracker.js`, `reservations.js`, `admin.js`).

---

**🚀 Running Locally**

This is a static site with no build step and no dependencies to install. All asset paths (`./css`, `./js`, `./images`) are relative, so it runs straight from the file system.

**Option 1 — Just open the file**

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/blems-pizzaria.git
   ```
2. Double-click `public/index.html` (or open it directly in your browser).

**Option 2 — Local server with live reload**

Useful while editing, so changes refresh automatically:

1. Open the `public` folder in VS Code and use the **Live Server** extension (right-click `index.html` → "Open with Live Server"), **or** serve it from the terminal:
   ```bash
   cd blems-pizzaria/public
   python3 -m http.server 8080
   ```
2. Open the app in your browser at `http://localhost:8080`.

---

**📄 License**

This project is licensed under the [MIT License](LICENSE).

---

 **Attribution and Credits**

> **Developed by Ruan Alves with the assistance of AI agents (Google Antigravity + Claude Code) for code optimization and testing.**
