/**
 * =================================================================================
 * BLEM'S PIZZARIA - RASTREADOR DE PEDIDOS ZERO-CLASSES (tracker.js)
 * =================================================================================
 * Este script consulta o motor BlemsDB para renderizar a timeline de progresso
 * do pedido sem utilizar NENHUMA classe CSS no HTML gerado dinamicamente.
 * 
 * Todos os comentários estão em Português (BR).
 * =================================================================================
 */

const ORDER_STEPS = [
    { key: 'Received', label: 'Order Received', icon: '📋', desc: 'Order placed and sent to kitchen team.' },
    { key: 'Preparing', label: 'Dough & Sauce Prepped', icon: '🥣', desc: 'Hand-tossing dough and adding fresh toppings.' },
    { key: 'In Oven', label: 'In Wood-Fired Oven', icon: '🔥', desc: 'Baking at 800°F for perfect crispness.' },
    { key: 'Out for Delivery', label: 'Quality Check & Out for Delivery', icon: '🚚', desc: 'Driver is on the way to your door!' },
    { key: 'Completed', label: 'Delivered / Enjoy!', icon: '🎁', desc: 'Order complete. Bon appétit!' }
];

function searchOrderTracker() {
    const input = document.getElementById('trackerInput');
    const display = document.getElementById('trackerDisplay');

    if (!input || !display) return;

    const code = input.value.trim().toUpperCase();
    if (!code) {
        showToast('Please enter a tracking code (e.g., BLEM-84920)');
        return;
    }

    const order = BlemsDB.getOrderByCode(code);

    if (order) {
        renderTrackerTimeline(order);
    } else {
        display.innerHTML = `
            <figure style="text-align:center; padding:30px; color:var(--primary);">
                <span style="font-size:2.5rem; margin-bottom:10px; display:block;">⚠️</span>
                <figcaption><p>Order code "${code}" not found. Try placing an order first!</p></figcaption>
            </figure>
        `;
    }
}

/**
 * Renderiza a timeline com elementos semânticos sem nenhuma classe CSS
 * @param {Object} order - Objeto do pedido
 */
function renderTrackerTimeline(order) {
    const display = document.getElementById('trackerDisplay');
    if (!display) return;

    let currentStepIndex = ORDER_STEPS.findIndex(s => s.key === order.status);
    if (currentStepIndex === -1) currentStepIndex = 0;

    display.innerHTML = `
        <header style="background:rgba(255,255,255,0.04); padding:16px; border-radius:var(--radius-sm); margin-bottom:24px;">
            <hgroup style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <strong style="font-size:1.1rem; color:var(--accent);">Code: ${order.tracking_code}</strong>
                <mark style="background:var(--primary); color:#fff; padding:2px 10px; border-radius:12px; font-size:0.8rem;">${order.status}</mark>
            </hgroup>
            <p style="font-size:0.85rem; color:var(--text-muted);">
                Customer: <strong>${order.customer_name}</strong> • 
                Type: <strong>${order.delivery_type.toUpperCase()}</strong> • 
                Total: <output><strong>$${order.total.toFixed(2)}</strong></output>
            </p>
        </header>

        <ol style="display:flex; flex-direction:column; gap:20px; position:relative; padding-left:20px; border-left:2px solid rgba(255,255,255,0.1);">
            ${ORDER_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return `
                    <li style="display:flex; gap:16px; align-items:flex-start; opacity: ${isCompleted ? 1 : 0.4};">
                        <span style="width:36px; height:36px; border-radius:50%; background:${isCompleted ? (isCurrent ? 'var(--accent)' : 'var(--primary)') : 'rgba(255,255,255,0.1)'}; 
                                    color:${isCurrent ? '#000' : '#fff'}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.1rem; box-shadow:${isCurrent ? '0 0 15px var(--accent)' : 'none'};">
                            ${step.icon}
                        </span>
                        <hgroup>
                            <h4 style="font-size:1rem; font-weight:700; color:${isCurrent ? 'var(--accent)' : '#fff'};">${step.label}</h4>
                            <p style="font-size:0.85rem; color:var(--text-muted);">${step.desc}</p>
                        </hgroup>
                    </li>
                `;
            }).join('')}
        </ol>

        <footer style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.1);">
            <h5 style="font-size:0.9rem; margin-bottom:10px; color:var(--text-muted);">Order Items Summary:</h5>
            <ul style="list-style:none; font-size:0.85rem;">
                ${order.items.map(it => `
                    <li style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span>${it.quantity}x ${it.name} ${it.size ? `(${it.size})` : ''}</span>
                        <output>$${it.totalPrice.toFixed(2)}</output>
                    </li>
                `).join('')}
            </ul>
        </footer>
    `;
}
