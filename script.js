const popularProductsData = [
    {
        "id": 1,
        "name": "Игровая консоль PS5",
        "price": 65000,
        "image": "image/PS5.webp"
    },
    {
        "id": 2,
        "name": "Видеокарта RTX 5090",
        "price": 200000,
        "image": "image/Видео карта 5090.jpg"
    }
];

const allProducts = [
    ...popularProductsData, 
    { "id": 3, "name": "Ноутбук Gaming Pro", "price": 120000, "image": "image/ноутбук.webp" },
    { "id": 4, "name": "Смартфон Ultra X", "price": 80000, "image": "image/Смартфон.webp" },
    { "id": 5, "name": "Системный блок игровой ПК MaxON-small PRO i7 7700  RX580 8gb, 32gb ОЗУ, SSD 1024GB", "price": 40000, "image": "image/orig.webp" },
    { "id": 6, "name": "Монитор", "price": 45168, "image": "image/optimize.webp" },
    { "id": 7, "name": "Клавиатура", "price": 5962, "image": "image/optimize (1).webp" }
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

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function displayCartItems() {
    const container = document.getElementById('cart-items-container');
    const cart = getCart();

    if (!container) return; 

    if (cart.length === 0) {
        container.innerHTML = '<p id="empty-cart-message">Ваша корзина пуста.</p>';
        return;
    }

    container.innerHTML = ''; 

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        let itemPath = item.image; 
        if (window.location.pathname.includes('/pages/')) {
             itemPath = `../${item.image}`; 
        }

        itemElement.innerHTML = `
            <div class="cart-item-details">
                <img src="${itemPath}" alt="${item.name}">
                <div class="item-info">
                    <p><strong>${item.name}</strong></p>
                    <p>Цена: ${item.price.toLocaleString('ru-RU')} руб.</p>
                    <p>Количество: ${item.quantity}</p>
                </div>
            </div>
            <div class="cart-item-controls">
                <button class="remove-item-btn" data-name="${item.name}">Удалить</button>
            </div>
        `;
        container.appendChild(itemElement);
    });

    container.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            removeFromCart(name);
        });
    });
}

function updateCartDisplay() {
    const cart = getCart();
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    const cartCountElements = document.querySelectorAll('#cart-count');
    const cartTotalElements = document.querySelectorAll('#cart-total');

    const cartLink = window.location.pathname.includes('/pages/') ? 'cart.html' : 'pages/cart.html';

    cartCountElements.forEach(el => {
        el.textContent = `Корзина (${totalItems})`;
        el.href = cartLink;
    });

    cartTotalElements.forEach(el => {
        el.textContent = `Сумма: ${totalPrice.toLocaleString('ru-RU')} руб.`;
        el.href = cartLink;
    });
    
    const finalTotalElement = document.getElementById('final-total')
;
    if (finalTotalElement) {
        finalTotalElement.textContent = `${totalPrice.toLocaleString('ru-RU')} руб.`;
        displayCartItems(); 
    }
}

function addToCart(productName, productPrice) {
    let cart = getCart();
    const product = allProducts.find(p => p.name === productName);
    
    if (!product) {
        showNotification(`Ошибка: товар "${productName}" не найден.`, 'info');
        return;
    }

    const itemIndex = cart.findIndex(item => item.name === productName);

    if (itemIndex > -1) {
        cart[itemIndex].quantity++;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1,
            image: product.image 
        });
    }

    saveCart(cart);
    showNotification(`${productName} добавлен в корзину!`);
}

function removeFromCart(productName) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== productName);
    saveCart(cart);
    showNotification(`${productName} удален из корзины.`, 'info');
}

function clearCart() {
    saveCart([]);
    showNotification('Корзина очищена.', 'info');
}

function renderPopularProducts() {
    const container = document.querySelector('#Popular-products .product-container');
    if (!container) return;

    container.innerHTML = popularProductsData.map(product => `
        <div class="product-card"> 
            <h3>${product.name}</h3>
            <img src="${product.image}" alt="${product.name}">
            <p>Цена: ${product.price.toLocaleString('ru-RU')} руб.</p>
            <button class="add-to-cart-btn" data-name="${product.name}" data-price="${product.price}">Добавить в корзину</button>
        </div>
    `).join('');
}

function bindEventListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.dataset.name;
            const price = parseInt(e.target.dataset.price);
            addToCart(name, price);
        });
    });

    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay(); 
    renderPopularProducts();
    bindEventListeners();
});