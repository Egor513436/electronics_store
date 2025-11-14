let cart = []; 
let totalItems = 0; 
let totalPrice = 0;

const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const notificationContainer = document.getElementById('notification-container');
const productContainer = document.querySelector('#Popular-products .product-container'); 

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    localStorage.setItem('totalItems', totalItems);
    localStorage.setItem('totalPrice', totalPrice);
}

function updateCartDisplay() {
    cartCountElement.textContent = `Корзина (${totalItems})`; 
    cartTotalElement.textContent = `Сумма: ${totalPrice} руб.`;
    saveCart();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.textContent = message;
    if (notificationContainer) {
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

function handleAddToCart(event) {
    const productName = event.target.dataset.name;
    const productPrice = parseFloat(event.target.dataset.price);
    
    cart.push({ name: productName, price: productPrice });
    totalItems++;
    totalPrice += productPrice;
    
    updateCartDisplay();
    showNotification(`${productName} добавлен в корзину!`, 'success');
    console.log(`Добавлен: ${productName}, Цена: ${productPrice}. Всего товаров: ${totalItems}, Общая сумма: ${totalPrice}`);
}

function rebindEventListeners() {
    const newButtons = document.querySelectorAll('.add-to-cart-btn');
    newButtons.forEach(button => {
        button.removeEventListener('click', handleAddToCart); 
        button.addEventListener('click', handleAddToCart);
    });
}

function fetchProducts() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const products = [ 
                { "id": 1, "name": "Игровая консоль PS5", "price": 65000, "image": "image/PS5.webp" },
                { "id": 2, "name": "Видеокарта RTX 5090", "price": 200000, "image": "image/Видео карта 5090.jpg" }
            ];
            resolve(products);
        }, 2000);
    });
}

function renderProducts(productsArray) {
    productContainer.innerHTML = ''; 
    
    productsArray.forEach(product => {
        const cardHTML = `
            <div class="product-card"> 
                <h3>${product.name}</h3>
                <img src="${product.image}" alt="${product.name}">
                <p>Цена: ${product.price} руб.</p>
                <button class="add-to-cart-btn" 
                        data-name="${product.name}" 
                        data-price="${product.price}">
                    Добавить в корзину
                </button>
            </div>
        `;
        productContainer.innerHTML += cardHTML;
    });
    
    rebindEventListeners();
}

fetchProducts()
    .then(data => {
        console.log("Данные получены, отрисовываем...");
        renderProducts(data); 
    })
    .catch(error => {
        console.error("Ошибка при получении данных:", error);
    });

updateCartDisplay();
