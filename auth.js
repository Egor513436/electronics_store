document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.auth-tabs .tab-button');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (!tabButtons.length || !loginForm || !registerForm) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const formToShow = button.dataset.form;

            loginForm.classList.remove('active-form');
            registerForm.classList.remove('active-form');

            if (formToShow === 'login') {
                loginForm.classList.add('active-form');
            } else {
                registerForm.classList.add('active-form');
            }
        });
    }
);
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Вход выполнен (функционал в разработке)');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        alert('Регистрация успешна (функционал в разработке)');
    });
});