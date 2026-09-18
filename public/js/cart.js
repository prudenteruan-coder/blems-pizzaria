/**
 * =================================================================================
 * BLEM'S PIZZARIA - GESTOR DE CARRINHO E CHECKOUT ZERO-CLASSES (cart.js)
 * =================================================================================
 * Este arquivo JavaScript gerencia todo o estado do carrinho sem NENHUMA classe CSS:
 * - Armazenamento de itens com opções de personalização
 * - Alternância entre Entrega (Delivery) e Retirada na Loja (Pickup)
 * - Cálculo de Subtotal, Gorjeta do Motorista, Taxa de NY e Desconto
 * - Geração e gravação de pedidos no BlemsDB sem classes HTML
 * 
 * Todos os comentários estão em Português (BR).
 * =================================================================================
 */

let cartState = {
    items: [],
    deliveryType: 'delivery',
    tipPercentage: 0.18,
    promoDiscount: 0,
    appliedPromoCode: ''
};

function initCart() {
    const savedCart = localStorage.getItem('blems_cart_state');
    if (savedCart) {
        try {
            const parsed = JSON.parse(savedCart);
            cartState.items = parsed.items || [];
            cartState.deliveryType = parsed.deliveryType || 'delivery';
            cartState.tipPercentage = parsed.tipPercentage || 0.18;
        } catch (e) {
            console.error('Erro ao restaurar carrinho:', e);
        }
    }
    updateCartUI();
}

function saveCartToStorage() {
    localStorage.setItem('blems_cart_state', JSON.stringify({
        items: cartState.items,
        deliveryType: cartState.deliveryType,
        tipPercentage: cartState.tipPercentage
    }));
}

function addToCart(name, price) {
    const existingIndex = cartState.items.findIndex(item => item.name === name && !item.isCustom);

    if (existingIndex > -1) {
        cartState.items[existingIndex].quantity += 1;
        cartState.items[existingIndex].totalPrice = cartState.items[existingIndex].quantity * cartState.items[existingIndex].unitPrice;
    } else {
        cartState.items.push({
            id: 'item_' + Date.now(),
            name: name,
            unitPrice: parseFloat(price),
            totalPrice: parseFloat(price),
            quantity: 1,
            isCustom: false
        });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`Added "${name}" to your order cart! 🍕`);
}

function updateItemQuantity(itemId, change) {
    const index = cartState.items.findIndex(item => item.id === itemId);
    if (index === -1) return;

    cartState.items[index].quantity += change;

    if (cartState.items[index].quantity <= 0) {
        cartState.items.splice(index, 1);
    } else {
        cartState.items[index].totalPrice = cartState.items[index].quantity * cartState.items[index].unitPrice;
    }

    saveCartToStorage();
    updateCartUI();
}

function setDeliveryType(type) {
    cartState.deliveryType = type;
    
    const btnDelivery = document.getElementById('btnDelivery');
    const btnPickup = document.getElementById('btnPickup');

    if (type === 'delivery') {
        if (btnDelivery) btnDelivery.setAttribute('data-active', 'true');
        if (btnPickup) btnPickup.removeAttribute('data-active');
    } else {
        if (btnDelivery) btnDelivery.removeAttribute('data-active');
        if (btnPickup) btnPickup.setAttribute('data-active', 'true');
    }

    const addrGroup = document.getElementById('addressGroup');
    if (addrGroup) {
        addrGroup.style.display = type === 'delivery' ? 'flex' : 'none';
    }

    saveCartToStorage();
    updateCartUI();
}

function setTip(percentage) {
    cartState.tipPercentage = percentage;

    const tipBtns = document.querySelectorAll('#tipSelector menu button');
    tipBtns.forEach(btn => {
        const val = parseFloat(btn.getAttribute('data-tip'));
        if (val === percentage) btn.setAttribute('data-active', 'true');
        else btn.removeAttribute('data-active');
    });

    saveCartToStorage();
    updateCartUI();
}

function applyPromoCode() {
    const input = document.getElementById('promoInput');
    const code = input ? input.value.trim().toUpperCase() : '';

    if (code === 'BLEMS10') {
        cartState.promoDiscount = 0.10;
        cartState.appliedPromoCode = 'BLEMS10';
        showToast('Promo code "BLEMS10" applied! 10% OFF 🏷️');
    } else if (code === '') {
        cartState.promoDiscount = 0;
        cartState.appliedPromoCode = '';
    } else {
        showToast('Invalid promo code. Try "BLEMS10"');
    }

    updateCartUI();
}

/**
 * Atualiza a interface do carrinho com ZERO classes no HTML
 */
function updateCartUI() {
    const cartList = document.getElementById('cartItemsList');
    const cartBadge = document.getElementById('cartBadge');

    const totalCount = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.textContent = totalCount;

    if (cartList) {
        if (cartState.items.length === 0) {
            cartList.innerHTML = `
                <figure style="text-align:center; padding:40px 0; color:var(--text-muted);">
                    <span style="font-size:3rem; margin-bottom:12px; display:block; opacity:0.3;">🍕</span>
                    <figcaption><p>Your cart is empty. Add some delicious pizza!</p></figcaption>
                </figure>
            `;
        } else {
            cartList.innerHTML = cartState.items.map(item => `
                <article>
                    <header>
                        <h4>${item.name}</h4>
                        <p>
                            ${item.size ? `<span>${item.size}</span> • ` : ''}
                            ${item.crust ? `<span>${item.crust}</span>` : ''}
                            ${item.toppings ? `<br><small style="color:var(--accent);">${item.toppings.join(', ')}</small>` : ''}
                        </p>
                        <nav>
                            <button type="button" onclick="updateItemQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button type="button" onclick="updateItemQuantity('${item.id}', 1)">+</button>
                        </nav>
                    </header>
                    <output>$${item.totalPrice.toFixed(2)}</output>
                </article>
            `).join('');
        }
    }

    const subtotal = cartState.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = subtotal * cartState.promoDiscount;
    const deliveryFee = (cartState.deliveryType === 'delivery' && subtotal > 0) ? 3.99 : 0.00;
    const tipAmount = (subtotal - discountAmount) * cartState.tipPercentage;
    const taxAmount = (subtotal - discountAmount) * 0.08875;
    const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + tipAmount + taxAmount);

    if (document.getElementById('cartSubtotal')) document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    
    const discRow = document.getElementById('discountRow');
    if (discRow) {
        discRow.style.display = cartState.promoDiscount > 0 ? 'flex' : 'none';
        document.getElementById('cartDiscount').textContent = `-$${discountAmount.toFixed(2)}`;
    }

    if (document.getElementById('cartDeliveryFee')) document.getElementById('cartDeliveryFee').textContent = cartState.deliveryType === 'delivery' ? `$${deliveryFee.toFixed(2)}` : 'FREE (Pickup)';
    if (document.getElementById('cartTipAmount')) document.getElementById('cartTipAmount').textContent = `$${tipAmount.toFixed(2)}`;
    if (document.getElementById('cartTax')) document.getElementById('cartTax').textContent = `$${taxAmount.toFixed(2)}`;
    if (document.getElementById('cartTotal')) document.getElementById('cartTotal').textContent = `$${grandTotal.toFixed(2)}`;
    if (document.getElementById('modalTotalPay')) document.getElementById('modalTotalPay').textContent = `$${grandTotal.toFixed(2)}`;
}

function openCheckoutModal() {
    if (cartState.items.length === 0) {
        showToast('Your cart is empty! Add items before checkout.');
        return;
    }
    closeCartDrawer();
    openModal('checkoutModal');
}

function processOrderPayment(event) {
    event.preventDefault();

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const email = document.getElementById('custEmail').value.trim();
    const address = document.getElementById('custAddress').value.trim();
    const paymentMethod = document.querySelector('input[name="payMethod"]:checked').value;

    const subtotal = cartState.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = subtotal * cartState.promoDiscount;
    const deliveryFee = cartState.deliveryType === 'delivery' ? 3.99 : 0;
    const tip = (subtotal - discount) * cartState.tipPercentage;
    const tax = (subtotal - discount) * 0.08875;
    const total = subtotal - discount + deliveryFee + tip + tax;

    const orderPayload = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_type: cartState.deliveryType,
        address: cartState.deliveryType === 'delivery' ? address : 'Store Pickup',
        subtotal: subtotal,
        discount: discount,
        tip: tip,
        total: total,
        payment_method: paymentMethod,
        items: cartState.items
    };

    const result = BlemsDB.createOrder(orderPayload);

    if (result.success) {
        cartState.items = [];
        saveCartToStorage();
        updateCartUI();

        closeModal('checkoutModal');

        openModal('trackerModal');
        document.getElementById('trackerInput').value = result.tracking_code;
        searchOrderTracker();

        showToast(`🎉 Order Placed! Tracking Code: ${result.tracking_code}`);
    } else {
        alert('Could not process order.');
    }
}

document.addEventListener('DOMContentLoaded', initCart);
