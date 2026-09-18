/**
 * =================================================================================
 * BLEM'S PIZZARIA - GESTOR DE RESERVAS DE MESA (reservations.js)
 * =================================================================================
 * Este script trata do envio do formulário de reserva de mesa para o backend Express:
 * - Validação de campos obrigatórios (Nome, Telefone, Data, Horário e Convidados)
 * - Envio via requisição HTTP POST (/api/reservations) para gravação no banco SQLite
 * - Exibição de mensagem de confirmação e notificação toast
 * 
 * Todos os comentários estão em Português (BR).
 * =================================================================================
 */

/**
 * Manipula a submissão do formulário de reserva de mesa
 * @param {Event} event - Evento de submit do formulário
 */
async function handleReservationSubmit(event) {
    event.preventDefault(); // Evita recarregamento da página

    const name = document.getElementById('resName').value.trim();
    const email = document.getElementById('resEmail').value.trim();
    const phone = document.getElementById('resPhone').value.trim();
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = parseInt(document.getElementById('resGuests').value, 10);
    const seating = document.getElementById('resSeating').value;

    if (!name || !phone || !date || !time) {
        showToast('Please fill in all required fields for your table reservation.');
        return;
    }

    const payload = {
        name: name,
        email: email,
        phone: phone,
        reservation_date: date,
        reservation_time: time,
        guests: guests,
        seating_preference: seating
    };

    try {
        // Envia os dados para a rota POST /api/reservations
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.success) {
            showToast(`🎉 Table Reserved! We look forward to seeing you on ${date} at ${time}.`);
            document.getElementById('reservationForm').reset();
        } else {
            alert('Error creating reservation: ' + data.error);
        }
    } catch (err) {
        console.error('Erro na requisição de reserva:', err);
        alert('Could not connect to database server.');
    }
}
