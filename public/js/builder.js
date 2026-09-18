/**
 * =================================================================================
 * BLEM'S PIZZARIA - CONSTRUTOR DE PIZZA ZERO-CLASSES (builder.js)
 * =================================================================================
 * Este script controla a personalização de pizzas sem utilizar NENHUMA classe CSS no HTML:
 * - Seleção de Tamanho, Massa, Molho e Coberturas via atributo 'data-active'
 * - Atualização dos elementos semânticos <output id="builderTotalPrice"> e <figcaption>
 * - Inclusão da pizza customizada no carrinho de compras do BlemsDB
 * 
 * Todos os comentários estão em Português (BR).
 * =================================================================================
 */

let customPizzaState = {
    size: 'Large 14"',
    basePrice: 21.49,
    crust: 'NY Thin Crust',
    crustExtraPrice: 0.00,
    sauce: 'San Marzano Marinara',
    sauceColor: '#b91c1c',
    toppings: [],
    toppingUnitPrice: 1.75
};

function initPizzaBuilder() {
    // 1. Tamanho
    const sizeBtns = document.querySelectorAll('#sizeOptions button');
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeBtns.forEach(b => b.removeAttribute('data-active'));
            btn.setAttribute('data-active', 'true');

            customPizzaState.size = btn.getAttribute('data-value');
            customPizzaState.basePrice = parseFloat(btn.getAttribute('data-price'));
            updateCustomPizzaUI();
        });
    });

    // 2. Massa
    const crustBtns = document.querySelectorAll('#crustOptions button');
    crustBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            crustBtns.forEach(b => b.removeAttribute('data-active'));
            btn.setAttribute('data-active', 'true');

            customPizzaState.crust = btn.getAttribute('data-value');
            customPizzaState.crustExtraPrice = parseFloat(btn.getAttribute('data-price'));
            updateCustomPizzaUI();
        });
    });

    // 3. Molho
    const sauceBtns = document.querySelectorAll('#sauceOptions button');
    sauceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sauceBtns.forEach(b => b.removeAttribute('data-active'));
            btn.setAttribute('data-active', 'true');

            customPizzaState.sauce = btn.getAttribute('data-value');
            customPizzaState.sauceColor = btn.getAttribute('data-color');
            updateCustomPizzaUI();
        });
    });

    // 4. Coberturas (Toppings)
    const toppingBtns = document.querySelectorAll('#toppingsGrid button');
    toppingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const toppingName = btn.getAttribute('data-topping');
            const icon = btn.getAttribute('data-icon');

            if (btn.hasAttribute('data-active')) {
                btn.removeAttribute('data-active');
                customPizzaState.toppings = customPizzaState.toppings.filter(t => t.name !== toppingName);
            } else {
                btn.setAttribute('data-active', 'true');
                customPizzaState.toppings.push({ name: toppingName, icon: icon });
            }

            updateCustomPizzaUI();
        });
    });

    updateCustomPizzaUI();
}

function updateCustomPizzaUI() {
    const toppingsTotal = customPizzaState.toppings.length * customPizzaState.toppingUnitPrice;
    const grandTotal = customPizzaState.basePrice + customPizzaState.crustExtraPrice + toppingsTotal;

    const sizeLabel = document.getElementById('builderSizeLabel');
    const priceDisplay = document.getElementById('builderTotalPrice');

    if (sizeLabel) sizeLabel.textContent = `${customPizzaState.size} (${customPizzaState.crust})`;
    if (priceDisplay) priceDisplay.textContent = `$${grandTotal.toFixed(2)}`;

    const sauceLayer = document.getElementById('sauceLayer');
    if (sauceLayer) {
        sauceLayer.style.backgroundColor = customPizzaState.sauceColor;
    }

    const toppingsContainer = document.getElementById('toppingsContainer');
    if (toppingsContainer) {
        toppingsContainer.innerHTML = customPizzaState.toppings.map(t => `
            <span title="${t.name}">${t.icon}</span>
        `).join('');
    }
}

function addCustomPizzaToCart() {
    const toppingsTotal = customPizzaState.toppings.length * customPizzaState.toppingUnitPrice;
    const itemPrice = customPizzaState.basePrice + customPizzaState.crustExtraPrice + toppingsTotal;

    const toppingNames = customPizzaState.toppings.map(t => t.name);

    const customItem = {
        id: 'custom_' + Date.now(),
        name: `Custom Pizza (${customPizzaState.size})`,
        size: customPizzaState.size,
        crust: customPizzaState.crust,
        toppings: toppingNames,
        unitPrice: itemPrice,
        totalPrice: itemPrice,
        quantity: 1,
        isCustom: true
    };

    cartState.items.push(customItem);

    saveCartToStorage();
    updateCartUI();

    openCartDrawer();
    showToast('Custom pizza added to cart! 🍕✨');
}

document.addEventListener('DOMContentLoaded', initPizzaBuilder);
