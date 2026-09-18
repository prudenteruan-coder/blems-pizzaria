const STORAGE_KEYS = {
    ORDERS: 'blems_db_orders',
    RESERVATIONS: 'blems_db_reservations',
    REVIEWS: 'blems_db_reviews'
};

const INITIAL_MENU = [
    { id: 1, name: "BLEM'S Brooklyn Supreme", category: "pizzas", description: "Pepperoni, Italian sausage, smoked bacon, bell peppers, red onions, mushrooms, and mozzarella.", price: 24.99, badge: "Bestseller", image: "/images/blems_hero_pizza.jpg" },
    { id: 2, name: "Classic NY Pepperoni", category: "pizzas", description: "Crispy cupped pepperoni, house San Marzano sauce, and double layer of mozzarella.", price: 21.99, badge: "Classic", image: "/images/blems_hero_pizza.jpg" },
    { id: 3, name: "Chicago Deep Dish Monster", category: "pizzas", description: "Thick butter-crisped crust packed with sausage, chunky tomato sauce, and molten cheese.", price: 26.99, badge: "Chef's Special", image: "/images/blems_hero_pizza.jpg" },
    { id: 4, name: "Detroit Style Smoky BBQ Chicken", category: "pizzas", description: "Rectangular airy dough, caramelized cheese crust, grilled chicken, and smoky BBQ drizzle.", price: 23.99, badge: "Popular", image: "/images/blems_hero_pizza.jpg" },
    { id: 5, name: "Truffle Mushroom & Wild Garlic", category: "pizzas", description: "Creamy garlic Alfredo base, roasted wild mushrooms, white truffle oil, and fresh thyme.", price: 25.49, badge: "Gourmet", image: "/images/blems_hero_pizza.jpg" },
    { id: 6, name: "Fiery Spicy Hawaiian Craze", category: "pizzas", description: "Smoked ham, caramelized pineapple, pickled jalapeños, bacon, and hot honey drizzle.", price: 22.99, badge: "Hot & Sweet", image: "/images/blems_hero_pizza.jpg" },
    { id: 7, name: "Margherita Di Bufala", category: "pizzas", description: "San Marzano tomatoes, fresh buffalo mozzarella, extra virgin olive oil, and organic basil.", price: 19.99, badge: "Vegetarian", image: "/images/blems_hero_pizza.jpg" },
    { id: 8, name: "Gluten-Free Garden Delight", category: "pizzas", description: "Cauliflower crust, spinach, cherry tomatoes, olives, artichokes, and vegan cheese.", price: 23.49, badge: "Gluten-Free", image: "/images/blems_hero_pizza.jpg" },

    { id: 9, name: "Buffalo Wings (10 pcs)", category: "sides", description: "Jumbo crispy wings tossed in spicy Buffalo sauce with blue cheese dip.", price: 14.99, badge: "Popular", image: "/images/blems_hero_pizza.jpg" },
    { id: 10, name: "Garlic Parmesan Knots (6 pcs)", category: "sides", description: "Dough knots brushed with garlic butter, fresh parsley, and grated parmesan.", price: 7.99, badge: "Must Try", image: "/images/blems_hero_pizza.jpg" },
    { id: 11, name: "Cheesy Mozzarella Sticks", category: "sides", description: "Golden fried string mozzarella sticks served with hot marinara dip.", price: 9.49, badge: "Classic", image: "/images/blems_hero_pizza.jpg" },

    { id: 12, name: "Craft IPA Beer (16 oz)", category: "drinks", description: "Local New York craft IPA beer with refreshing citrus and pine notes.", price: 6.99, badge: "21+ Only", image: "/images/blems_hero_pizza.jpg" },
    { id: 13, name: "Mexican Glass Bottle Coca-Cola", category: "drinks", description: "Made with real cane sugar in an authentic glass bottle (12 fl oz).", price: 3.99, badge: "Cold", image: "/images/blems_hero_pizza.jpg" },
    { id: 14, name: "San Pellegrino Sparkling Water", category: "drinks", description: "Imported Italian mineral sparkling water (500ml).", price: 4.49, badge: "Refreshing", image: "/images/blems_hero_pizza.jpg" },

    { id: 15, name: "Cinnabon Apple Cinnamon Pie", category: "desserts", description: "Wood-fired dessert pizza with spiced apples, cinnamon crumble, and sweet vanilla glaze.", price: 10.99, badge: "Sweet Tooth", image: "/images/blems_hero_pizza.jpg" },
    { id: 16, name: "NY Style Cheesecake Slice", category: "desserts", description: "Dense, creamy, authentic New York cheesecake served with berry compote.", price: 8.99, badge: "Classic NY", image: "/images/blems_hero_pizza.jpg" }
];

const INITIAL_REVIEWS = [
    { id: 1, customer_name: "Michael R.", location: "Manhattan, NY", rating: 5, comment: "Best NY style crust in town! The pepperoni cups hold the grease perfectly and the crust has the ultimate crunch." },
    { id: 2, customer_name: "Sarah Jenkins", location: "Brooklyn, NY", rating: 5, comment: "The Detroit style BBQ chicken pizza was mind-blowing! Caramelized cheese edges are crisp perfection." },
    { id: 3, customer_name: "David Miller", location: "Queens, NY", rating: 5, comment: "Fast delivery, hot pizza, and the live order tracker kept me updated step-by-step. BLEM'S is our new Friday night go-to!" }
];

const BlemsDB = {
    getMenu() {
        return INITIAL_MENU;
    },

    getReviews() {
        const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
        return INITIAL_REVIEWS;
    },

    getOrders() {
        const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        return [];
    },

    createOrder(orderData) {
        const orders = this.getOrders();

        const trackingCode = 'BLEM-' + Math.floor(100000 + Math.random() * 900000);
        
        const newOrder = {
            id: orders.length + 1,
            tracking_code: trackingCode,
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email || '',
            customer_phone: orderData.customer_phone,
            delivery_type: orderData.delivery_type,
            address: orderData.address,
            subtotal: orderData.subtotal,
            discount: orderData.discount || 0,
            tip: orderData.tip || 0,
            total: orderData.total,
            payment_method: orderData.payment_method,
            status: 'Received',
            items: orderData.items || [],
            created_at: new Date().toISOString()
        };

        orders.unshift(newOrder);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

        return {
            success: true,
            tracking_code: trackingCode,
            order: newOrder
        };
    },

    getOrderByCode(code) {
        const orders = this.getOrders();
        const found = orders.find(o => o.tracking_code === code.trim().toUpperCase());
        return found || null;
    },

    updateOrderStatus(orderId, newStatus) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === parseInt(orderId, 10));
        
        if (index > -1) {
            orders[index].status = newStatus;
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
            return true;
        }
        return false;
    },

    getReservations() {
        const stored = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        return [];
    },

    createReservation(resData) {
        const reservations = this.getReservations();
        
        const newRes = {
            id: reservations.length + 1,
            name: resData.name,
            email: resData.email || '',
            phone: resData.phone,
            reservation_date: resData.reservation_date,
            reservation_time: resData.reservation_time,
            guests: resData.guests,
            seating_preference: resData.seating_preference || 'Standard',
            created_at: new Date().toISOString()
        };

        reservations.unshift(newRes);
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));

        return {
            success: true,
            reservation: newRes
        };
    }
};
