/**
 * =================================================================================
 * BLEM'S PIZZARIA - PAINEL ADMINISTRADOR ZERO-CLASSES (admin.js)
 * =================================================================================
 * Este script gerencia o modal de Administração e visualização do banco BlemsDB:
 * - Leitura e listagem da tabela de pedidos ('orders') salvos no LocalStorage
 * - Atualização imediata do status dos pedidos (Received, Preparing, In Oven, Out for Delivery, Completed)
 * - Leitura e listagem da tabela de reservas ('reservations')
 * 
 * Todos os comentários estão em Português (BR).
 * =================================================================================
 */

function switchAdminTab(tabId) {
    const contents = document.querySelectorAll('article[data-admin-content="true"]');
    const btns = document.querySelectorAll('nav#adminTabs button');

    contents.forEach(c => c.removeAttribute('data-active'));
    btns.forEach(b => b.removeAttribute('data-active'));

    const activeContent = document.getElementById(tabId);
    if (activeContent) activeContent.setAttribute('data-active', 'true');

    const activeBtn = document.querySelector(`button[data-admin-tab="${tabId}"]`);
    if (activeBtn) activeBtn.setAttribute('data-active', 'true');

    if (tabId === 'ordersTab') loadAdminOrdersDB();
    if (tabId === 'reservationsTab') loadAdminReservationsDB();
}

function loadAdminOrdersDB() {
    const tbody = document.getElementById('adminOrdersTableBody');
    if (!tbody) return;

    const orders = BlemsDB.getOrders();

    if (orders.length > 0) {
        tbody.innerHTML = orders.map(ord => `
            <tr>
                <td><strong>#${ord.id}</strong><br><small style="color:var(--accent);">${ord.tracking_code}</small></td>
                <td>${ord.customer_name}<br><small style="color:var(--text-muted);">${ord.customer_phone}</small></td>
                <td><mark style="background:rgba(255,255,255,0.1); color:#fff; padding:2px 8px; border-radius:4px;">${ord.delivery_type}</mark></td>
                <td><strong>$${ord.total.toFixed(2)}</strong></td>
                <td><strong style="color:var(--accent);">${ord.status}</strong></td>
                <td>
                    <select style="padding:4px 8px; font-size:0.8rem;" onchange="updateOrderStatusInDB(${ord.id}, this.value)">
                        <option value="Received" ${ord.status === 'Received' ? 'selected' : ''}>Received</option>
                        <option value="Preparing" ${ord.status === 'Preparing' ? 'selected' : ''}>Preparing</option>
                        <option value="In Oven" ${ord.status === 'In Oven' ? 'selected' : ''}>In Oven</option>
                        <option value="Out for Delivery" ${ord.status === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="Completed" ${ord.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No orders found in BlemsDB yet. Place an order first!</td></tr>`;
    }
}

function updateOrderStatusInDB(orderId, newStatus) {
    const success = BlemsDB.updateOrderStatus(orderId, newStatus);
    if (success) {
        showToast(`Order #${orderId} status updated to "${newStatus}" in BlemsDB! 💾`);
    } else {
        alert('Failed to update status.');
    }
}

function loadAdminReservationsDB() {
    const tbody = document.getElementById('adminReservationsTableBody');
    if (!tbody) return;

    const reservations = BlemsDB.getReservations();

    if (reservations.length > 0) {
        tbody.innerHTML = reservations.map(res => `
            <tr>
                <td><strong>#${res.id}</strong></td>
                <td>${res.name}<br><small style="color:var(--text-muted);">${res.email}</small></td>
                <td>${res.phone}</td>
                <td><strong>${res.reservation_date}</strong> at ${res.reservation_time}</td>
                <td>${res.guests} Guests</td>
                <td>${res.seating_preference}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No table reservations found in BlemsDB.</td></tr>`;
    }
}
