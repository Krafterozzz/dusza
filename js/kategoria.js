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
        document.getElementById('editCategoryName').value = currentName;
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
        document.getElementById('newCategoryName').value = '';
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

    // Kategóriák betöltése
    function loadCategories() {
        fetch("../php/get_categories.php", {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tableBody = document.getElementById("categories-body");
                tableBody.innerHTML = "";
                data.categories.forEach(category => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${category.name}</td>
                        <td class="action-buttons">
                            <button class="edit-btn" onclick="showEditDialog(${category.id}, '${category.name}')">
                                Szerkesztés
                            </button>
                            <button class="delete-btn" onclick="showDeleteDialog(${category.id})">
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

    // Kategória hozzáadása
    document.getElementById('confirmAdd').addEventListener('click', () => {
        const name = document.getElementById('newCategoryName').value;
        fetch('../php/add_category.php', {
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
                loadCategories();
                showMessage("Kategória sikeresen hozzáadva!", "success");
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

    // Kategória szerkesztése
    document.getElementById('confirmEdit').addEventListener('click', () => {
        const name = document.getElementById('editCategoryName').value;
        fetch('../php/update_category.php', {
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
                loadCategories();
                showMessage("Kategória sikeresen módosítva!", "success");
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

    // Kategória törlése
    document.getElementById('confirmDelete').addEventListener('click', () => {
        fetch('../php/delete_category.php', {
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
                loadCategories();
                showMessage("Kategória sikeresen törölve!", "success");
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
    document.getElementById('addCategoryBtn').addEventListener('click', showAddDialog);
    document.getElementById('cancelAdd').addEventListener('click', hideAddDialog);
    document.getElementById('cancelEdit').addEventListener('click', hideEditDialog);
    document.getElementById('cancelDelete').addEventListener('click', hideDeleteDialog);

    // Kezdeti betöltés
    loadCategories();
    window.showEditDialog = showEditDialog;
    window.showDeleteDialog = showDeleteDialog;
    

    
    
          
    




