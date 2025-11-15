let cart = []; 
let totalItems = 0; 
let totalPrice = 0;

const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const notificationContainer = document.getElementById('notification-container');
const productContainer = document.querySelector('#Popular-products .product-container'); 

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cart)); // [КОНЦЕПТ] JSON.stringify: Превращает массив/объект в строку для сохранения
    localStorage.setItem('totalItems', totalItems);
    localStorage.setItem('totalPrice', totalPrice);
}
function loadCart() {
    const storedItems = localStorage.getItem('cartItems');
    const storedTotalItems = localStorage.getItem('totalItems');
    const storedTotalPrice = localStorage.getItem('totalPrice');
    
    if (storedItems) { // [КОНЦЕПТ] if: Проверяем, есть ли данные
        cart = JSON.parse(storedItems); // [КОНЦЕПТ] JSON.parse: Превращает строку обратно в массив
        totalItems = parseInt(storedTotalItems) || 0; // [КОНЦЕПТ] parseInt: Превращает строку в целое число
        totalPrice = parseFloat(storedTotalPrice) || 0; // [КОНЦЕПТ] parseFloat: Превращает строку в дробное число
    }
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
        setTimeout(() => { // [КОНЦЕПТ] setTimeout: Делает функцию асинхронной (задержка)
            notification.remove();
        }, 3000);
    }
}

function handleAddToCart(event) {
    const productName = event.target.dataset.name;
    const productPrice = parseFloat(event.target.dataset.price);
    
    // [КРИТИЧЕСКИ ВАЖНО] Ищем родителя (.product-card), находим <img> и извлекаем его путь (src)
    const productImage = event.target.closest('.product-card').querySelector('img').getAttribute('src');
    
    // [КОНЦЕПТ] push: Добавляем новый элемент в конец массива cart
    cart.push({ 
        name: productName, 
        price: productPrice,
        image: productImage // Сохраняем путь к изображению
    });
    
    totalItems++;
    totalPrice += productPrice;
    
    updateCartDisplay();
    showNotification(`${productName} добавлен в корзину!`, 'success');
}


function rebindEventListeners() {
    const allButtons = document.querySelectorAll('.add-to-cart-btn');
    allButtons.forEach(button => {
        button.removeEventListener('click', handleAddToCart); 
        button.addEventListener('click', handleAddToCart);
    });
}

function fetchProducts() {
    return new Promise((resolve, reject) => { // [КОНЦЕПТ] new Promise: Начинаем асинхронную операцию
        setTimeout(() => {
            const products = [ 
                { "id": 1, "name": "Игровая консоль PS5", "price": 65000, "image": "image/PS5.webp" },
                { "id": 2, "name": "Видеокарта RTX 5090", "price": 200000, "image": "image/Видео карта 5090.jpg" }
            ];
            resolve(products); // [КОНЦЕПТ] resolve: Операция успешна, вот данные
        }, 2000);
    });
}

function renderProducts(productsArray) {
    if (productContainer) {
        productContainer.innerHTML = ''; 
        
        productsArray.forEach(product => {
            const cardHTML = `
                <div class="product-card"> 
                    <h3>${product.name}</h3>
                    <img src="${product.image}" alt="${product.name}">
                    <p>Цена: ${product.price} руб.
                    </p>
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
}

// [НОВАЯ ЛОГИКА] Функции для отображения и удаления товаров на странице Корзины (cart.html)
function displayCartItems() {
    const container = document.getElementById('cart-items-container');
    const finalTotalSpan = document.getElementById('final-total');
    
    if (!container) return; 

    container.innerHTML = ''; 

    if (cart.length === 0) {
        container.innerHTML = `<p id="empty-cart-message">Ваша корзина пуста.</p>`;
        finalTotalSpan.textContent = `0 руб.`;
        return; 
    }
    
    cart.forEach((item, index) => {
        const itemHTML = `
            <div class="cart-item" data-index="${index}" style="display: flex; align-items: center; border-bottom: 1px solid #ccc; padding: 10px 0;">
                
                <img src="${item.image}" alt="${item.name}" class="cart-item-img" style="width: 150px; height: 150px; object-fit: cover; margin-right: 15px; border-radius: 15px;"> 
                
                <p style="flex-grow: 1;">${item.name} - ${item.price} руб.</p>
                <button class="remove-item-btn" data-index="${index}">Удалить</button>
            </div>
        `;
        container.innerHTML += itemHTML;
    });

    finalTotalSpan.textContent = `${totalPrice} руб.`;
    
    attachCartPageListeners();
}

function attachCartPageListeners() {
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearEntireCart);
    }

    const removeButtons = document.querySelectorAll('.remove-item-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', removeItemFromCart);
    });
}

function clearEntireCart() {
    cart = [];          
    totalItems = 0;     
    totalPrice = 0;     
    
    updateCartDisplay();   
    displayCartItems();    
}

function removeItemFromCart(event) {
    const indexToRemove = parseInt(event.target.dataset.index);
    const itemToRemove = cart[indexToRemove];

    cart.splice(indexToRemove, 1); // [КОНЦЕПТ] splice: Удаление элемента из массива
    
    totalItems--;
    totalPrice -= itemToRemove.price; 
    
    updateCartDisplay();   
    displayCartItems();    
}


// --- СТАРТ ПРИЛОЖЕНИЯ ---

loadCart();
updateCartDisplay(); 

if (productContainer) {
    fetchProducts()
        .then(renderProducts)
        .catch(error => {
            console.error("Ошибка при получении данных:", error);
        });
}