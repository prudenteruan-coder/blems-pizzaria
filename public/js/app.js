/**
 * =================================================================================
 * BLEM'S PIZZARIA - CONTROLADOR PRINCIPAL ZERO-CLASSES (app.js)
 * =================================================================================
 * Este arquivo JavaScript gerencia a interface usando o motor de dados BlemsDB:
 * - Carregamento inicial de pratos e exibição na grid semântica (ZERO classes no HTML)
 * - Filtros por abas via atributos 'data-category' e 'data-active'
 * - Gerenciamento de modais com elemento nativo <dialog>
 * - Notificações flutuantes no elemento <aside id="toastContainer">
 * 
 * Todos os comentários estão em Português (BR).
 * =================================================================================
 */

let allMenuItems = [];

document.addEventListener('DOMContentLoaded', () => {
    loadMenuFromDB();
    loadReviewsFromDB();
    initCategoryTabs();
});

/**
 * Carrega o cardápio do motor BlemsDB
 */
function loadMenuFromDB() {
    allMenuItems = BlemsDB.getMenu();
    renderMenuGrid(allMenuItems);
}

/**
 * Renderiza os pratos no elemento <section id="menuGrid"> sem utilizar nenhuma classe CSS
 * @param {Array} items - Lista de pratos
 */
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
                <img src="${item.image || '/images/blems_hero_pizza.jpg'}" alt="${item.name}">
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

/**
 * Configura as abas de categoria usando o atributo data-active
 */
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

/**
 * Carrega as avaliações dos clientes (Zero Classes)
 */
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

/**
 * Abre a gaveta do carrinho
 */
function openCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.setAttribute('data-active', 'true');
    if (overlay) overlay.setAttribute('data-active', 'true');
}

/**
 * Fecha a gaveta do carrinho
 */
function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.removeAttribute('data-active');
    if (overlay) overlay.removeAttribute('data-active');
}

/**
 * Abre um modal <dialog> pelo ID
 * @param {string} modalId - ID do modal
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.setAttribute('data-active', 'true');
        if (modalId === 'adminModal') {
            loadAdminOrdersDB();
        }
    }
}

/**
 * Fecha um modal <dialog> pelo ID
 * @param {string} modalId - ID do modal
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.removeAttribute('data-active');
}

/**
 * Alterna o menu mobile
 */
function toggleMobileMenu() {
    const menu = document.getElementById('navMenu');
    if (menu) {
        if (menu.hasAttribute('data-active')) menu.removeAttribute('data-active');
        else menu.setAttribute('data-active', 'true');
    }
}

/**
 * Exibe notificação flutuante
 * @param {string} message - Texto da mensagem
 */
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
