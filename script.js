document.addEventListener('DOMContentLoaded', () => {

    const allProducts = [
        { "id": "ps5", "name": "Игровая консоль PS5", "price": 65000, "image": "image/PS5.webp", "popular": true },
        { "id": "gpu-rtx-5090", "name": "Видеокарта RTX 5090", "price": 200000, "image": "image/Видео карта 5090.jpg", "popular": true },
        { "id": "laptop-gaming-pro", "name": "Ноутбук Gaming Pro", "price": 120000, "image": "image/ноутбук.webp", "popular": false },
        { "id": "smartphone-ultra-x", "name": "Смартфон Ultra X", "price": 80000, "image": "image/Смартфон.webp", "popular": true },
        { "id": "pc-maxon-pro", "name": "Игровой ПК MaxON-small PRO", "price": 40000, "image": "image/orig.webp", "popular": false },
        { "id": "monitor-lg-27", "name": "Монитор LG 27\" UltraGear", "price": 45168, "image": "image/optimize.webp", "popular": false },
        { "id": "keyboard-aula-f98", "name": "Клавиатура AULA F98Pro", "price": 5962, "image": "image/optimize (1).webp", "popular": false }
    ];

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }

    function showNotification(message, type = 'success') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
container.appendChild(notification);
    }

    function formatPrice(price) {
        return price.toLocaleString('ru-RU');
    }

    function createProductCard(product) {
        const imagePath = getCorrectImagePath(product.image);
        return `
            <div class="product-card">
                <div class="product-image-wrapper">
                    <img src="${imagePath}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)} руб.</p>
                <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
            </div>
        `;
    }
    
    function getCorrectImagePath(path) {
        return window.location.pathname.includes('/pages/') ? `../${path}` : path;
    }
    
    function renderProducts(containerId, filterFn) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = allProducts
            .filter(filterFn)
            .map(createProductCard)
            .join('');
    }
    
    function updateCartDisplay() {
        const cart = getCart();
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartBadge = document.getElementById('cart-count-badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        if (window.location.pathname.includes('/cart.html')) {
            renderCartPage();
        }
    }

    function renderCartPage() {
        const cart = getCart();
        const container = document.getElementById('cart-items-container');
        const summary = document.getElementById('cart-summary');
        const finalTotalEl = document.getElementById('final-total');

        if (!container || !summary) return;

        if (cart.length === 0) {
            container.innerHTML = '<p id="empty-cart-message">Ваша корзина пуста. Время добавить что-нибудь крутое!</p>';
            summary.classList.add('hidden');
            return;
        }

        summary.classList.remove('hidden');
        container.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const product = allProducts.find(p => p.id === item.id);
            if (!product) return;

            totalPrice += product.price * item.quantity;
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${getCorrectImagePath(product.image)}" alt="${product.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p>${formatPrice(product.price)} руб.</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-change" data-id="${item.id}" data-change="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-change" data-id="${item.id}" data-change="1">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">
                        <img src="../image/delete.png" alt="Удалить">
                    </button>
                </div>
            `;
            container.appendChild(itemElement);
        });

        finalTotalEl.textContent = `${formatPrice(totalPrice)} руб.`;
    }

    function addToCart(productId) {
        let cart = getCart();
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        const itemInCart = cart.find(item => item.id === productId);
        if (itemInCart) {
            itemInCart.quantity++;
        } else {
            cart.push({ id: productId, quantity: 1 });
        }
        saveCart(cart);
        showNotification(`${product.name} добавлен в корзину!`);
    }

    function changeQuantity(productId, change) {
        let cart = getCart();
        const itemInCart = cart.find(item => item.id === productId);
        if (!itemInCart) return;

        itemInCart.quantity += change;

        if (itemInCart.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        saveCart(cart);
    }
    
    function removeItemFromCart(productId) {
        let cart = getCart();
        const product = allProducts.find(p => p.id === productId);
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        if (product) {
            showNotification(`${product.name} удален из корзины.`, 'info');
        }
    }

    function clearCart() {
        saveCart([]);
        showNotification('Корзина очищена.', 'info');
    }
    
    function handleBurgerMenu() {
        const burger = document.getElementById('burger-menu');
        const nav = document.querySelector('.main-navigation');
        if (burger && nav) {
            burger.addEventListener('click', () => {
                nav.classList.toggle('active');
            });
        }
    }

    function handleFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = question.classList.contains('active');
                
                faqItems.forEach(i => {
                    i.querySelector('.faq-question').classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                });
                
                if (!isActive) {
                    question.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const productId = e.target.closest('.add-to-cart-btn').dataset.id;
            addToCart(productId);
        }
        if (e.target.closest('.quantity-change')) {
            const button = e.target.closest('.quantity-change');
            const productId = button.dataset.id;
            const change = parseInt(button.dataset.change);
            changeQuantity(productId, change);
        }
        if (e.target.closest('.remove-item-btn')) {
            const productId = e.target.closest('.remove-item-btn').dataset.id;
            removeItemFromCart(productId);
        }
        if (e.target.id === 'clear-cart-btn') {
            clearCart();
        }
    });

    renderProducts('popular-products-grid', p => p.popular);
    renderProducts('catalog-products-grid', p => true);
    
    handleBurgerMenu();
    handleFaqAccordion();
    updateCartDisplay();
});
