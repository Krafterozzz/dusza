document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const logoutButton = document.getElementById('logout-button');
    const messageDiv = document.getElementById('message');

    // Felhasználói adatok betöltése
    fetch('../php/versenyzo_profile.php')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const data = result.data;
                document.getElementById('team_name').value = data.team_name;
                document.getElementById('school_name').value = data.school_name;
                document.getElementById('team_member1_name').value = data.team_member1_name;
                document.getElementById('team_member1_grade').value = data.team_member1_grade;
                document.getElementById('team_member2_name').value = data.team_member2_name;
                document.getElementById('team_member2_grade').value = data.team_member2_grade;
                document.getElementById('team_member3_name').value = data.team_member3_name;
                document.getElementById('team_member3_grade').value = data.team_member3_grade;
                document.getElementById('substitute_member_name').value = data.substitute_member_name;
                document.getElementById('substitute_member_grade').value = data.substitute_member_grade;
                document.getElementById('teacher').value = data.teacher;
                document.getElementById('category').value = data.category;
                document.getElementById('programming_language').value = data.programming_language;
            } else {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Hiba történt:', error);
            messageDiv.textContent = 'Hiba történt az adatok betöltése során.';
            messageDiv.style.color = 'red';
        });

    // Profil frissítése
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);

        try {
            const response = await fetch('../php/versenyzo_profile.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'green';
            } else {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Hiba történt:', error);
            messageDiv.textContent = 'Hiba történt a profil frissítése során.';
            messageDiv.style.color = 'red';
        }
    });

    // Kijelentkezés
    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('../php/logout.php');
            const result = await response.json();

            if (result.success) {
                window.location.href = '../html/versenyzo_login.html';
            } else {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Hiba történt:', error);
            messageDiv.textContent = 'Hiba történt a kijelentkezés során.';
            messageDiv.style.color = 'red';
        }

        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    const response = await fetch('../php/versenyzo_logout.php');
                    const result = await response.json();
                    if (result.success) {
                        window.location.href = '../index.html'; // Átirányítás a főoldalra
                    } else {
                        alert('Hiba történt a kijelentkezés során: ' + result.message);
                    }
                } catch (error) {
                    console.error('Hiba:', error);
                    alert('Hiba történt a kijelentkezés során.');
                }
            });
        }



    });
});