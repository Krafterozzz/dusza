document.addEventListener('DOMContentLoaded', function() {
    // Ellenőrizzük a bejelentkezési jelzőt a localStorage-ban
    if (!localStorage.getItem('is_logged_in')) {
        // Ha a felhasználó nincs bejelentkezve, visszairányítjuk a bejelentkezés oldalra
        window.location.href = '..//html/admin_login.html';
    }

    // Programnyelvek kezelése
    document.getElementById('language-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const language = document.getElementById('language').value;
        sendToAdminProfile({ action: 'add_language', language: language });
    });

    // Kategóriák kezelése
    document.getElementById('category-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const category = document.getElementById('category').value;
        sendToAdminProfile({ action: 'add_category', category: category });
    });

    // Jelentkezési határidő kezelése
    document.getElementById('deadline-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const deadline = document.getElementById('deadline').value;
        sendToAdminProfile({ action: 'set_deadline', deadline: deadline });
    });

    // Jelentkezés azonnali lezárása
    document.getElementById('close-registration').addEventListener('click', function() {
        if (confirm('Biztosan le szeretné zárni a jelentkezést?')) {
            sendToAdminProfile({ action: 'close_registration' });
        }
    });

    // Iskolák kezelése
    document.getElementById('school-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const schoolData = {
            username: document.getElementById('school-username').value,
            password: document.getElementById('school-password').value,
            name: document.getElementById('school-name').value,
            address: document.getElementById('school-address').value,
            contactName: document.getElementById('contact-name').value,
            contactEmail: document.getElementById('contact-email').value
        };
        sendToAdminProfile({ action: 'add_school', schoolData: schoolData });
    });

    // Csapatok szűrése
    document.getElementById('apply-filters').addEventListener('click', function() {
        const filters = {
            school: document.getElementById('filter-school').value,
            category: document.getElementById('filter-category').value,
            status: document.getElementById('filter-status').value
        };
        sendToAdminProfile({ action: 'filter_teams', filters: filters });
    });

    // Csapatok exportálása
    document.getElementById('export-teams').addEventListener('click', function() {
        sendToAdminProfile({ action: 'export_teams' });
    });

    // Adatok küldése a szervernek
    function sendToAdminProfile(data) {
        fetch('../php/admin_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
            console.log('Success:', responseData);
            handleResponse(responseData);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('message').innerText = 'Hiba történt: ' + error.message;
        });
    }

    // Szerver válaszának kezelése
    function handleResponse(response) {
        if (response.success) {
            document.getElementById('message').innerText = response.message;
            if (response.action === 'add_language') {
                updateLanguageList(response.languages);
            } else if (response.action === 'add_category') {
                updateCategoryList(response.categories);
            } else if (response.action === 'set_deadline' || response.action === 'close_registration') {
                updateDeadline(response.deadline);
            } else if (response.action === 'add_school') {
                updateSchoolList(response.schools);
            } else if (response.action === 'filter_teams') {
                updateTeamList(response.teams);
            }
        } else {
            document.getElementById('message').innerText = 'Hiba: ' + response.message;
        }
    }

    // Listák frissítése
    function updateLanguageList(languages) {
        const listBody = document.getElementById('language-list-body');
        listBody.innerHTML = '';
        languages.forEach(lang => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lang.name}</td>
                <td><button onclick="deleteLanguage('${lang.name}')">Törlés</button></td>
            `;
            listBody.appendChild(row);
        });
    }

    function updateCategoryList(categories) {
        const listBody = document.getElementById('category-list-body');
        listBody.innerHTML = '';
        categories.forEach(cat => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${cat.name}</td>
                <td><button onclick="deleteCategory('${cat.name}')">Törlés</button></td>
            `;
            listBody.appendChild(row);
        });
    }

    function updateDeadline(deadline) {
        document.getElementById('current-deadline-value').innerText = deadline;
    }

    function updateSchoolList(schools) {
        const listBody = document.getElementById('school-list-body');
        listBody.innerHTML = '';
        schools.forEach(school => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${school.name}</td>
                <td>${school.contact_name}</td>
                <td>
                    <button onclick="editSchool(${school.id})">Szerkesztés</button>
                    <button onclick="deleteSchool(${school.id})">Törlés</button>
                </td>
            `;
            listBody.appendChild(row);
        });
    }

    function updateTeamList(teams) {
        const listBody = document.getElementById('team-list-body');
        listBody.innerHTML = '';
        teams.forEach(team => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${team.team_name}</td>
                <td>${team.school_name}</td>
                <td>${team.category}</td>
                <td>${team.organizer_approval}</td>
                <td>
                    <button onclick="viewTeam(${team.id})">Megtekintés</button>
                    <button onclick="approveTeam(${team.id})">Jóváhagyás</button>
                    <button onclick="requestCorrection(${team.id})">Hiánypótlás</button>
                </td>
            `;
            listBody.appendChild(row);
        });
    }

    // Kezdeti adatok betöltése
    sendToAdminProfile({ action: 'load_initial_data' });
});

// Globális függvények a gombokhoz
function deleteLanguage(lang) {
    if (confirm(`Biztosan törli a "${lang}" programnyelvet?`)) {
        sendToAdminProfile({ action: 'delete_language', language: lang });
    }
}

function deleteCategory(cat) {
    if (confirm(`Biztosan törli a "${cat}" kategóriát?`)) {
        sendToAdminProfile({ action: 'delete_category', category: cat });
    }
}

function editSchool(id) {
    // Iskola szerkesztése funkció implementálása
    console.log('Iskola szerkesztése:', id);
    // Itt kellene megnyitni egy modált vagy átirányítani egy szerkesztő oldalra
}

function deleteSchool(id) {
    if (confirm('Biztosan törli ezt az iskolát?')) {
        sendToAdminProfile({ action: 'delete_school', schoolId: id });
    }
}

function viewTeam(id) {
    // Csapat megtekintése funkció implementálása
    console.log('Csapat megtekintése:', id);
    // Itt kellene megnyitni egy modált vagy átirányítani egy részletes nézet oldalra
}

function approveTeam(id) {
    if (confirm('Biztosan jóváhagyja ezt a csapatot?')) {
        sendToAdminProfile({ action: 'approve_team', teamId: id });
    }
}

function requestCorrection(id) {
    const message = prompt('Kérem, adja meg a hiánypótlás okát:');
    if (message) {
        sendToAdminProfile({ action: 'request_correction', teamId: id, message: message });
    }
}

// Globális sendToAdminProfile függvény
function sendToAdminProfile(data) {
    fetch('../php/admin_profile.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
        console.log('Success:', responseData);
        handleResponse(responseData);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'Hiba történt: ' + error.message;
    });
}

// Globális handleResponse függvény
function handleResponse(response) {
    if (response.success) {
        document.getElementById('message').innerText = response.message;
        if (response.action === 'add_language' || response.action === 'delete_language') {
            updateLanguageList(response.languages);
        } else if (response.action === 'add_category' || response.action === 'delete_category') {
            updateCategoryList(response.categories);
        } else if (response.action === 'set_deadline' || response.action === 'close_registration') {
            updateDeadline(response.deadline);
        } else if (response.action === 'add_school' || response.action === 'delete_school') {
            updateSchoolList(response.schools);
        } else if (response.action === 'filter_teams' || response.action === 'approve_team' || response.action === 'request_correction') {
            updateTeamList(response.teams);
        }
    } else {
        document.getElementById('message').innerText = 'Hiba: ' + response.message;
    }
}