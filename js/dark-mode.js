document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Initialize based on previous preference
    if (localStorage.getItem('dark-mode') === 'enabled') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '☀️';
    } else {
        toggleButton.textContent = '🌙';
    }

    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            toggleButton.textContent = '☀️';
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            toggleButton.textContent = '🌙';
            localStorage.setItem('dark-mode', 'disabled');
        }
    });
});