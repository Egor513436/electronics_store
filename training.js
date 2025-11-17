// 1. Функция для подсчета итоговой суммы
function calculateTotal(itemsPrice, tax) {
    // 1.1. Проверка условия: если цена не число, возвращаем 0
    if (typeof itemsPrice !== 'number' || typeof tax !== 'number') {
        return 0; 
    }
    
    // 1.2. Расчет налога
    const taxAmount = itemsPrice * tax;
    
    // 1.3. Расчет итоговой суммы
    const finalPrice = itemsPrice + taxAmount;
    
    // 1.4. Возврат результата
    return finalPrice;
}

// 2. Тестирование функции
const product1 = 2000;
const rate = 0.13; // 13%

console.log(`Цена без налога: ${product1}`);
console.log(`Итоговая цена: ${calculateTotal(product1, rate)}`); 
// --- БЛОК 2: DOM-МАНИПУЛЯЦИЯ (ИНТЕРАКТИВНОСТЬ) ---

document.addEventListener('DOMContentLoaded', () => {
    // 2.1. Находим кнопку по ID
    const button = document.getElementById('testButton'); 
    
    // 2.2. Находим элемент для изменения (например, главный заголовок h1)
    const title = document.querySelector('h1');

    if (button && title) {
        // 2.3. Добавление обработчика клика
        button.addEventListener('click', () => {
            // 2.4. Меняем текст и стиль
            title.textContent = "Успешная DOM-манипуляция!";
            button.style.backgroundColor = 'red';
            
            // 2.5. Скрываем кнопку через 2 секунды
            setTimeout(() => {
                button.style.display = 'none'; // Правильная команда для скрытия
            }, 2000);
        });
    }
});
