// Üzenet megjelenítése
function showMessage(message, type) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerText = message;
    messageDiv.className = type;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
        messageDiv.className = '';
    }, 3000);
}

// Dialógus megjelenítő függvények
function showEditDialog(id, currentName) {
    currentActionId = id;
    document.getElementById('editLanguageName').value = currentName;
    document.getElementById('editOverlay').style.display = 'block';
    document.getElementById('editDialog').style.display = 'block';
}

function showDeleteDialog(id) {
    currentActionId = id;
    document.getElementById('deleteOverlay').style.display = 'block';
    document.getElementById('deleteDialog').style.display = 'block';
}

function showAddDialog() {
    document.getElementById('addOverlay').style.display = 'block';
    document.getElementById('addDialog').style.display = 'block';
    document.getElementById('newLanguageName').value = '';
}

// Dialógus elrejtő függvények
function hideEditDialog() {
    document.getElementById('editOverlay').style.display = 'none';
    document.getElementById('editDialog').style.display = 'none';
    currentActionId = null;
}

function hideDeleteDialog() {
    document.getElementById('deleteOverlay').style.display = 'none';
    document.getElementById('deleteDialog').style.display = 'none';
    currentActionId = null;
}

function hideAddDialog() {
    document.getElementById('addOverlay').style.display = 'none';
    document.getElementById('addDialog').style.display = 'none';
}

// Programnyelvek betöltése
function loadLanguages() {
    fetch("../php/get_languages.php", {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tableBody = document.getElementById("languages-body");
            tableBody.innerHTML = "";
            data.languages.forEach(language => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${language.name}</td>
                    <td class="action-buttons">
                        <button class="edit-btn" onclick="showEditDialog(${language.id}, '${language.name}')">
                            Szerkesztés
                        </button>
                        <button class="delete-btn" onclick="showDeleteDialog(${language.id})">
                            Törlés
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            showMessage(data.message || "Hiba történt az adatok betöltése során.", "error");
        }
    })
    .catch(error => {
        console.error("Hiba:", error);
        showMessage("Hiba történt az adatok betöltése során.", "error");
    });
}

// Programnyelv hozzáadása
document.getElementById('confirmAdd').addEventListener('click', () => {
    const name = document.getElementById('newLanguageName').value;
    fetch('../php/add_language.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadLanguages();
            showMessage("Programnyelv sikeresen hozzáadva!", "success");
        } else {
            showMessage(data.message || "Hiba történt a hozzáadás során.", "error");
        }
        hideAddDialog();
    })
    .catch(error => {
        console.error("Hiba:", error);
        showMessage("Hiba történt a hozzáadás során.", "error");
        hideAddDialog();
    });
});

// Programnyelv szerkesztése
document.getElementById('confirmEdit').addEventListener('click', () => {
    const name = document.getElementById('editLanguageName').value;
    fetch('../php/update_language.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentActionId, name }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadLanguages();
            showMessage("Programnyelv sikeresen módosítva!", "success");
        } else {
            showMessage(data.message || "Hiba történt a módosítás során.", "error");
        }
        hideEditDialog();
    })
    .catch(error => {
        console.error("Hiba:", error);
        showMessage("Hiba történt a módosítás során.", "error");
        hideEditDialog();
    });
});

// Programnyelv törlése
document.getElementById('confirmDelete').addEventListener('click', () => {
    fetch('../php/delete_language.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: currentActionId }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadLanguages();
            showMessage("Programnyelv sikeresen törölve!", "success");
        } else {
            showMessage(data.message || "Hiba történt a törlés során.", "error");
        }
        hideDeleteDialog();
    })
    .catch(error => {
        console.error("Hiba:", error);
        showMessage("Hiba történt a törlés során.", "error");
        hideDeleteDialog();
    });
});

// Dialógus kezelők
document.getElementById('addLanguageBtn').addEventListener('click', showAddDialog);
document.getElementById('cancelAdd').addEventListener('click', hideAddDialog);
document.getElementById('cancelEdit').addEventListener('click', hideEditDialog);
document.getElementById('cancelDelete').addEventListener('click', hideDeleteDialog);

// Kezdeti betöltés
loadLanguages();
window.showEditDialog = showEditDialog;
window.showDeleteDialog = showDeleteDialog;