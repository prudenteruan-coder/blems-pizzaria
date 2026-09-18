/**
 * =================================================================================
 * BLEM'S PIZZARIA - SERVIDOR BACKEND (Express + SQLite)
 * =================================================================================
 * Este arquivo configura o servidor HTTP Express, conecta ao banco de dados SQLite,
 * cria as tabelas necessárias (cardápio, pedidos, itens do pedido, reservas e avaliações),
 * insere dados iniciais (seed data) e expõe as rotas de API REST para a aplicação.
 * 
 * Todos os comentários deste arquivo estão em Português (BR) para facilitar o entendimento.
 * =================================================================================
 */

// Importação dos módulos do Node.js
const express = require('express'); // Framework web Express para rotas e middleware HTTP
const sqlite3 = require('sqlite3').verbose(); // Driver do banco de dados SQLite3 com logs detalhados
const cors = require('cors'); // Middleware CORS para permitir requisições cross-origin do frontend
const path = require('path'); // Módulo do Node.js para manipulação e resolução de caminhos de arquivos

// Inicialização do aplicativo Express
const app = express();

// Configuração da porta do servidor (porta 3000 por padrão)
const PORT = process.env.PORT || 3000;

// Configuração dos Middlewares do Express
app.use(cors()); // Habilita o suporte a CORS para todas as requisições
app.use(express.json()); // Converte automaticamente o corpo das requisições JSON em objetos JavaScript
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta 'public' (HTML, CSS, JS, imagens)

// Conexão com o banco de dados SQLite
// O arquivo 'database.sqlite' será criado automaticamente no diretório raiz do projeto
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados SQLite:', err.message);
    } else {
        console.log('Conexão estabelecida com sucesso com o banco de dados SQLite.');
    }
});

/**
 * =================================================================================
 * INICIALIZAÇÃO DO BANCO DE DADOS (CRIAÇÃO DE TABELAS E POVOAMENTO INICIAL)
 * =================================================================================
 */
db.serialize(() => {
    // 1. Tabela de Categorias e Itens do Cardápio (menu)
    db.run(`
        CREATE TABLE IF NOT EXISTS menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            badge TEXT,
            image TEXT,
            spicy_level INTEGER DEFAULT 0,
            is_vegetarian INTEGER DEFAULT 0,
            is_gluten_free INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) console.error("Erro ao criar tabela 'menu':", err.message);
        else console.log("Tabela 'menu' pronta.");
    });

    // 2. Tabela de Pedidos (orders)
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_code TEXT NOT NULL UNIQUE,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            delivery_type TEXT NOT NULL, -- 'delivery' ou 'pickup'
            address TEXT,
            subtotal REAL NOT NULL,
            discount REAL DEFAULT 0,
            tip REAL DEFAULT 0,
            total REAL NOT NULL,
            payment_method TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Received', -- 'Received', 'Preparing', 'In Oven', 'Out for Delivery', 'Completed'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("Erro ao criar tabela 'orders':", err.message);
        else console.log("Tabela 'orders' pronta.");
    });

    // 3. Tabela de Itens Individuais de cada Pedido (order_items)
    db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            item_name TEXT NOT NULL,
            size TEXT,
            crust TEXT,
            toppings TEXT,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            total_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) console.error("Erro ao criar tabela 'order_items':", err.message);
        else console.log("Tabela 'order_items' pronta.");
    });

    // 4. Tabela de Reservas de Mesa (reservations)
    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            reservation_date TEXT NOT NULL,
            reservation_time TEXT NOT NULL,
            guests INTEGER NOT NULL,
            seating_preference TEXT,
            special_requests TEXT,
            status TEXT DEFAULT 'Confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("Erro ao criar tabela 'reservations':", err.message);
        else console.log("Tabela 'reservations' pronta.");
    });

    // 5. Tabela de Avaliações de Clientes (reviews)
    db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            location TEXT NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("Erro ao criar tabela 'reviews':", err.message);
        else console.log("Tabela 'reviews' pronta.");
    });

    // Inserção de Dados Iniciais (Seed Data) se a tabela de menu estiver vazia
    db.get(`SELECT COUNT(*) AS count FROM menu`, (err, row) => {
        if (err) {
            console.error("Erro ao checar contagem do menu:", err.message);
            return;
        }

        if (row.count === 0) {
            console.log("Povoando o banco de dados com cardápio inicial...");
            const insertMenuStmt = db.prepare(`
                INSERT INTO menu (name, category, description, price, badge, image, spicy_level, is_vegetarian, is_gluten_free)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const initialMenuItems = [
                // Pizzas de Assinatura (Popular American Pizzas)
                ["BLEM'S Brooklyn Supreme", "pizzas", "Loaded with pepperoni, Italian sausage, smoked bacon, bell peppers, red onions, mushrooms, and rich mozzarella.", 24.99, "Bestseller", "/images/blems_hero_pizza.jpg", 0, 0, 0],
                ["Classic NY Pepperoni", "pizzas", "Crispy cupped pepperoni, house marinara sauce, and double layer of aged Wisconsin mozzarella.", 21.99, "Classic", "/images/blems_hero_pizza.jpg", 0, 0, 0],
                ["Chicago Deep Dish Monster", "pizzas", "Thick butter-crisped crust packed with Italian sausage, chunky vine-ripened tomato sauce, and molten cheese.", 26.99, "Chef's Special", "/images/blems_hero_pizza.jpg", 0, 0, 0],
                ["Detroit Style Smoky BBQ Chicken", "pizzas", "Rectangular airy dough, caramelized cheese crust, grilled chicken, smoky BBQ drizzle, bacon, and red onions.", 23.99, "Popular", "/images/blems_hero_pizza.jpg", 1, 0, 0],
                ["Truffle Mushroom & Wild Garlic", "pizzas", "Creamy garlic Alfredo base, roasted wild mushrooms, white truffle oil drizzle, fresh thyme, and fontina cheese.", 25.49, "Gourmet", "/images/blems_hero_pizza.jpg", 0, 1, 0],
                ["Fiery Spicy Hawaiian Craze", "pizzas", "Smoked ham, caramelized pineapple chunks, pickled jalapeños, crispy bacon, and spicy hot honey drizzle.", 22.99, "Hot & Sweet", "/images/blems_hero_pizza.jpg", 2, 0, 0],
                ["Margherita Di Bufala", "pizzas", "San Marzano tomatoes, fresh buffalo mozzarella, extra virgin olive oil, and organic fresh basil leaves.", 19.99, "Vegetarian", "/images/blems_hero_pizza.jpg", 0, 1, 0],
                ["Gluten-Free Garden Delight", "pizzas", "Cauliflower crust, spinach, cherry tomatoes, black olives, artichoke hearts, vegan cheese, and basil pesto.", 23.49, "Gluten-Free", "/images/blems_hero_pizza.jpg", 0, 1, 1],

                // Entradas e Acompanhamentos (Sides & Wings)
                ["Buffalo Wings (10 pcs)", "sides", "Jumbo crispy chicken wings tossed in signature spicy Buffalo sauce with blue cheese dip and celery.", 14.99, "Popular", "/images/blems_hero_pizza.jpg", 2, 0, 0],
                ["Garlic Parmesan Knots (6 pcs)", "sides", "Fresh baked dough knots brushed with garlic butter, fresh parsley, and grated parmesan cheese.", 7.99, "Must Try", "/images/blems_hero_pizza.jpg", 0, 1, 0],
                ["Cheesy Mozzarella Sticks", "sides", "Golden fried string mozzarella sticks served with hot house marinara sauce.", 9.49, "Classic", "/images/blems_hero_pizza.jpg", 0, 1, 0],

                // Bebidas (Beverages)
                ["Craft IPA Beer (16 oz)", "drinks", "Local New York craft IPA beer with refreshing citrus and pine notes.", 6.99, "21+ Only", "/images/blems_hero_pizza.jpg", 0, 0, 0],
                ["Mexican Glass Bottle Coca-Cola", "drinks", "Made with real cane sugar in an authentic glass bottle (12 fl oz).", 3.99, "Cold", "/images/blems_hero_pizza.jpg", 0, 0, 0],
                ["San Pellegrino Sparkling Water", "drinks", "Imported Italian mineral sparkling water (500ml).", 4.49, "Refreshing", "/images/blems_hero_pizza.jpg", 0, 0, 0],

                // Sobremesas (Desserts)
                ["Cinnabon Apple Cinnamon Pie", "drinks", "Wood-fired dessert pizza with spiced apples, cinnamon crumble, and sweet vanilla glaze.", 10.99, "Sweet Tooth", "/images/blems_hero_pizza.jpg", 0, 1, 0],
                ["NY Style Cheesecake Slice", "drinks", "Dense, creamy, authentic New York cheesecake served with fresh berry compote.", 8.99, "Classic NY", "/images/blems_hero_pizza.jpg", 0, 1, 0]
            ];

            initialMenuItems.forEach(item => {
                insertMenuStmt.run(item);
            });
            insertMenuStmt.finalize();
            console.log("Cardápio inicial inserido com sucesso!");
        }
    });

    // Inserção de Avaliações Iniciais (Seed Reviews)
    db.get(`SELECT COUNT(*) AS count FROM reviews`, (err, row) => {
        if (err) return;
        if (row.count === 0) {
            const insertReviewStmt = db.prepare(`
                INSERT INTO reviews (customer_name, location, rating, comment)
                VALUES (?, ?, ?, ?)
            `);

            const initialReviews = [
                ["Michael R.", "Manhattan, NY", 5, "Best NY style crust in town! The pepperoni cups hold the grease perfectly and the crust has the ultimate crunch."],
                ["Sarah Jenkins", "Brooklyn, NY", 5, "The Detroit style BBQ chicken pizza was mind-blowing! Caramelized cheese edges are crisp perfection."],
                ["David Miller", "Queens, NY", 5, "Fast delivery, hot pizza, and the live order tracker kept me updated step-by-step. BLEM'S is our new Friday night go-to!"]
            ];

            initialReviews.forEach(rev => insertReviewStmt.run(rev));
            insertReviewStmt.finalize();
        }
    });
});

/**
 * =================================================================================
 * ROTAS DA API REST (ENDPOINTS DO BACKEND)
 * =================================================================================
 */

// 1. GET /api/menu - Retorna todos os itens do cardápio agrupados ou filtrados
app.get('/api/menu', (req, res) => {
    // Executa consulta SQL no banco SQLite para selecionar todos os pratos
    const sql = `SELECT * FROM menu ORDER BY category ASC, id ASC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar cardápio:", err.message);
            return res.status(500).json({ success: false, error: "Erro interno no servidor ao carregar o cardápio." });
        }
        res.json({ success: true, data: rows });
    });
});

// 2. POST /api/orders - Recebe um novo pedido do cliente e salva no banco de dados SQLite
app.post('/api/orders', (req, res) => {
    const {
        customer_name,
        customer_email,
        customer_phone,
        delivery_type,
        address,
        subtotal,
        discount,
        tip,
        total,
        payment_method,
        items
    } = req.body;

    // Validação básica dos dados recebidos no corpo da requisição
    if (!customer_name || !customer_phone || !items || !items.length) {
        return res.status(400).json({ success: false, error: "Por favor, preencha todos os campos obrigatórios e adicione itens ao carrinho." });
    }

    // Gera um código de rastreamento único (Exemplo: BLEM-84920)
    const tracking_code = 'BLEM-' + Math.floor(100000 + Math.random() * 900000);

    // SQL INSERT para salvar a ordem na tabela 'orders'
    const insertOrderSql = `
        INSERT INTO orders (
            tracking_code, customer_name, customer_email, customer_phone,
            delivery_type, address, subtotal, discount, tip, total, payment_method, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Received')
    `;

    db.run(insertOrderSql, [
        tracking_code,
        customer_name,
        customer_email || '',
        customer_phone,
        delivery_type,
        address || 'Pickup at Store',
        subtotal,
        discount || 0,
        tip || 0,
        total,
        payment_method
    ], function (err) {
        if (err) {
            console.error("Erro ao criar pedido no banco:", err.message);
            return res.status(500).json({ success: false, error: "Erro ao salvar pedido no banco de dados." });
        }

        const orderId = this.lastID; // ID auto-incrementado gerado pelo SQLite

        // Inserção relacional de cada item do pedido na tabela 'order_items'
        const insertItemSql = `
            INSERT INTO order_items (order_id, item_name, size, crust, toppings, quantity, unit_price, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const stmt = db.prepare(insertItemSql);
        items.forEach(item => {
            stmt.run([
                orderId,
                item.name,
                item.size || 'Standard',
                item.crust || 'Standard',
                item.toppings ? item.toppings.join(', ') : '',
                item.quantity,
                item.unitPrice,
                item.totalPrice
            ]);
        });
        stmt.finalize();

        // Retorna a resposta de sucesso com o código de rastreamento gerado
        res.json({
            success: true,
            message: "Order placed successfully!",
            tracking_code: tracking_code,
            order_id: orderId
        });
    });
});

// 3. GET /api/orders/:code - Busca o status atual de um pedido pelo código de rastreamento
app.get('/api/orders/:code', (req, res) => {
    const trackingCode = req.params.code;

    // Busca as informações gerais do pedido no SQLite
    const sqlOrder = `SELECT * FROM orders WHERE tracking_code = ?`;
    db.get(sqlOrder, [trackingCode], (err, order) => {
        if (err || !order) {
            return res.status(404).json({ success: false, error: "Order not found. Please check your tracking code." });
        }

        // Busca os itens vinculados a este pedido
        const sqlItems = `SELECT * FROM order_items WHERE order_id = ?`;
        db.all(sqlItems, [order.id], (err, items) => {
            if (err) {
                return res.status(500).json({ success: false, error: "Erro ao carregar detalhes do pedido." });
            }
            res.json({
                success: true,
                order: order,
                items: items
            });
        });
    });
});

// 4. POST /api/reservations - Registra uma nova reserva de mesa no banco de dados
app.post('/api/reservations', (req, res) => {
    const { name, email, phone, reservation_date, reservation_time, guests, seating_preference, special_requests } = req.body;

    if (!name || !phone || !reservation_date || !reservation_time || !guests) {
        return res.status(400).json({ success: false, error: "Please fill in all required fields for table reservation." });
    }

    const sql = `
        INSERT INTO reservations (name, email, phone, reservation_date, reservation_time, guests, seating_preference, special_requests)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [name, email || '', phone, reservation_date, reservation_time, guests, seating_preference || 'Standard', special_requests || ''], function(err) {
        if (err) {
            console.error("Erro ao salvar reserva:", err.message);
            return res.status(500).json({ success: false, error: "Failed to process reservation." });
        }
        res.json({
            success: true,
            message: "Table reservation confirmed!",
            reservation_id: this.lastID
        });
    });
});

// 5. GET /api/reviews - Retorna as avaliações dos clientes
app.get('/api/reviews', (req, res) => {
    db.all(`SELECT * FROM reviews ORDER BY id DESC LIMIT 10`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: "Erro ao buscar avaliações." });
        res.json({ success: true, data: rows });
    });
});

// 6. ROTAS ADMINISTRATIVAS (ADMIN DASHBOARD API)
// GET /api/admin/orders - Retorna todos os pedidos para o painel admin
app.get('/api/admin/orders', (req, res) => {
    const sql = `SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`;
    db.all(sql, [], (err, orders) => {
        if (err) return res.status(500).json({ success: false, error: "Erro no servidor." });
        res.json({ success: true, orders: orders });
    });
});

// PATCH /api/admin/orders/:id/status - Atualiza o status de um pedido no banco de dados SQLite
app.patch('/api/admin/orders/:id/status', (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body; // 'Received', 'Preparing', 'In Oven', 'Out for Delivery', 'Completed'

    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    db.run(sql, [status, orderId], function(err) {
        if (err) return res.status(500).json({ success: false, error: "Erro ao atualizar status." });
        res.json({ success: true, message: "Status updated successfully!" });
    });
});

// GET /api/admin/reservations - Retorna todas as reservas para o painel admin
app.get('/api/admin/reservations', (req, res) => {
    db.all(`SELECT * FROM reservations ORDER BY created_at DESC LIMIT 50`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: "Erro no servidor." });
        res.json({ success: true, reservations: rows });
    });
});

/**
 * Rota Fallback: Serve o arquivo 'index.html' para qualquer requisição não-API
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Inicialização do Servidor na Porta Definida
 */
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SERVIDOR BLEM'S PIZZARIA RODANDO NA PORTA ${PORT}`);
    console.log(`👉 Acesse no navegador: http://localhost:${PORT}`);
    console.log(`=======================================================`);
});
