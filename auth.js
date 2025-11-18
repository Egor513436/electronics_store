document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.auth-tabs .tab-button');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            button.classList.add('active');

            const formToShow = button.dataset.form;

            // Скрываем/показываем формы
            if (formToShow === 'login') {
                loginForm.classList.add('active-form');
                loginForm.classList.remove('hidden-form');
                registerForm.classList.add('hidden-form');
                registerForm.classList.remove('active-form');
            } else if (formToShow === 'register') {
                registerForm.classList.add('active-form');
                registerForm.classList.remove('hidden-form');
                loginForm.classList.add('hidden-form');
                loginForm.classList.remove('active-form');
            }
        });
    });
    
    // Пример заглушки для формы (пока без реальной авторизации)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Вход выполнен (функционал авторизации пока не реализован)');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        alert('Регистрация успешна (функционал авторизации пока не реализован)');
    });
});
