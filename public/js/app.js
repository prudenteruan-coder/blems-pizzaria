let allMenuItems = [];

document.addEventListener('DOMContentLoaded', () => {
    loadMenuFromDB();
    loadReviewsFromDB();
    initCategoryTabs();
});

function loadMenuFromDB() {
    allMenuItems = BlemsDB.getMenu();
    renderMenuGrid(allMenuItems);
}

function renderMenuGrid(items) {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    if (items.length === 0) {
        menuGrid.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:var(--text-muted);">No items found in this category.</p>`;
        return;
    }

    menuGrid.innerHTML = items.map(item => `
        <article>
            <figure>
                <img src="${item.image || './images/blems_hero_pizza.jpg'}" alt="${item.name}">
                ${item.badge ? `<mark>${item.badge}</mark>` : ''}
            </figure>
            <section>
                <h3>${item.name}</h3>
                <p>${item.description || ''}</p>
                <footer>
                    <output>$${item.price.toFixed(2)}</output>
                    <button type="button" onclick="addToCart('${item.name.replace(/'/g, "\\'")}', ${item.price})">
                        🛒 Add to Order
                    </button>
                </footer>
            </section>
        </article>
    `).join('');
}

function initCategoryTabs() {
    const tabs = document.querySelectorAll('#categoryTabs button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.removeAttribute('data-active'));
            tab.setAttribute('data-active', 'true');

            const cat = tab.getAttribute('data-category');
            if (cat === 'all') {
                renderMenuGrid(allMenuItems);
            } else {
                const filtered = allMenuItems.filter(i => i.category === cat);
                renderMenuGrid(filtered);
            }
        });
    });
}

function loadReviewsFromDB() {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;

    const reviews = BlemsDB.getReviews();
    grid.innerHTML = reviews.map(rev => `
        <article>
            <mark>${'★'.repeat(rev.rating)}</mark>
            <p>"${rev.comment}"</p>
            <hgroup>
                <h4>${rev.customer_name}</h4>
                <p>${rev.location}</p>
            </hgroup>
        </article>
    `).join('');
}

function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.setAttribute('data-active', 'true');
    if (overlay) overlay.setAttribute('data-active', 'true');
}

function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.removeAttribute('data-active');
    if (overlay) overlay.removeAttribute('data-active');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.setAttribute('data-active', 'true');
        if (modalId === 'adminModal') {
            loadAdminOrdersDB();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.removeAttribute('data-active');
}

function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) {
        if (menu.hasAttribute('data-active')) menu.removeAttribute('data-active');
        else menu.setAttribute('data-active', 'true');
    }
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('p');
    toast.innerHTML = `<span>✓</span> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
