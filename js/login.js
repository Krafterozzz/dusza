document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);

        try {
            const response = await fetch('../php/versenyzo_login.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = '../html/versenyzo_profile.html';
            } else {
                errorMessage.textContent = result.message;
            }
        } catch (error) {
            console.error('Hiba történt:', error);
            errorMessage.textContent = 'Hiba történt a bejelentkezés során.';
        }
    });
});