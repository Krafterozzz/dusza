document.addEventListener("DOMContentLoaded", function() {
    let currentActionId = null;
    
    // Overlay és dialógus elemek
    const deleteOverlay = document.getElementById('deleteOverlay');
    const approveOverlay = document.getElementById('approveOverlay');
    const rejectOverlay = document.getElementById('rejectOverlay');
    
    const deleteConfirmation = document.getElementById('deleteConfirmation');
    const approveConfirmation = document.getElementById('approveConfirmation');
    const rejectConfirmation = document.getElementById('rejectConfirmation');
    
    // Megerősítő és megszakító gombok
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const confirmApproveBtn = document.getElementById('confirmApprove');
    const confirmRejectBtn = document.getElementById('confirmReject');
    
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const cancelApproveBtn = document.getElementById('cancelApprove');
    const cancelRejectBtn = document.getElementById('cancelReject');

    // Dialógus megjelenítő függvények
    function showDeleteConfirmation(id) {
        currentActionId = id;
        deleteOverlay.style.display = 'block';
        deleteConfirmation.style.display = 'block';
    }

    function showApproveConfirmation(id) {
        currentActionId = id;
        approveOverlay.style.display = 'block';
        approveConfirmation.style.display = 'block';
    }

    function showRejectConfirmation(id) {
        currentActionId = id;
        rejectOverlay.style.display = 'block';
        rejectConfirmation.style.display = 'block';
    }

    // Dialógus elrejtő függvények
    function hideDeleteConfirmation() {
        deleteOverlay.style.display = 'none';
        deleteConfirmation.style.display = 'none';
        currentActionId = null;
    }

    function hideApproveConfirmation() {
        approveOverlay.style.display = 'none';
        approveConfirmation.style.display = 'none';
        currentActionId = null;
    }

    function hideRejectConfirmation() {
        rejectOverlay.style.display = 'none';
        rejectConfirmation.style.display = 'none';
        currentActionId = null;
    }

    // Műveletek végrehajtása
    async function deleteApplication(id) {
        try {
            const response = await fetch('../php/delete_application.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    row.remove();
                }
                
                showMessage("Sikeres törlés!", "success");
                
            } else {
                showMessage(result.message || "Hiba történt a törlés során.", "error");
            }
        } catch (error) {
            console.error("Hiba történt a törlés során:", error);
            showMessage("Hiba történt a törlés során.", "error");
        }
    }

    async function updateApplicationStatus(id, status) {
        try {
            const response = await fetch('../php/update_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, status: status })
            });
            
            const result = await response.json();
            
            if (result.success) {
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                    row.className = status;
                    const statusCell = row.querySelector('.status-badge');
                    statusCell.textContent = getStatusText(status);
                    statusCell.className = `status-badge status-${status}`;
                }
                showMessage(`Jelentkezés ${getStatusText(status).toLowerCase()}!`, "success");
                location.reload(); // Oldal újratöltése a friss sorrendért
            } else {
                showMessage(result.message || "Hiba történt a státusz módosítása során.", "error");
            }
        } catch (error) {
            console.error("Hiba történt a státusz módosítása során:", error);
            showMessage("Hiba történt a státusz módosítása során.", "error");
        }
    }

    function getStatusText(status) {
        switch(status) {
            case 'approved': return 'Elfogadva';
            case 'rejected': return 'Visszautasítva';
            default: return 'Függőben';
        }
    }

    function showMessage(message, type) {
        const messageDiv = document.getElementById("message");
        messageDiv.innerText = message;
        messageDiv.style.color = type === "success" ? "green" : "red";
    }

    // Eseménykezelők
    confirmDeleteBtn.addEventListener('click', () => {
        if (currentActionId) {
            deleteApplication(currentActionId);
            hideDeleteConfirmation();
        }
    });

    confirmApproveBtn.addEventListener('click', () => {
        if (currentActionId) {
            updateApplicationStatus(currentActionId, 'approved');
            hideApproveConfirmation();
        }
    });

    confirmRejectBtn.addEventListener('click', () => {
        if (currentActionId) {
            updateApplicationStatus(currentActionId, 'rejected');
            hideRejectConfirmation();
        }
    });

    // Megszakító gombok eseménykezelői
    cancelDeleteBtn.addEventListener('click', hideDeleteConfirmation);
    cancelApproveBtn.addEventListener('click', hideApproveConfirmation);
    cancelRejectBtn.addEventListener('click', hideRejectConfirmation);

    // Overlay kattintás eseménykezelők
    deleteOverlay.addEventListener('click', hideDeleteConfirmation);
    approveOverlay.addEventListener('click', hideApproveConfirmation);
    rejectOverlay.addEventListener('click', hideRejectConfirmation);

    // Adatok betöltése
    fetch("../php/get_schools.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tableBody = document.getElementById("schools-body");
            tableBody.innerHTML = "";
            
            data.data.forEach(application => {
                const row = document.createElement("tr");
                row.setAttribute('data-id', application.id);
                row.className = application.status || 'pending';
                
                row.innerHTML = `
                    <td>${application.school_name}</td>
                    <td>${application.team_name}</td>
                    <td><span class="status-badge status-${application.status || 'pending'}">${getStatusText(application.status)}</span></td>
                    <td>
                        <details>
                            <summary>Részletek</summary>
                            <div class="details-content">
                                <p>Első tag: ${application.team_member1_name}, Osztály: ${application.team_member1_grade}</p>
                                <p>Második tag: ${application.team_member2_name}, Osztály: ${application.team_member2_grade}</p>
                                <p>Harmadik tag: ${application.team_member3_name}, Osztály: ${application.team_member3_grade}</p>
                                <p>Pót tag: ${application.substitute_member_name}, Osztály: ${application.substitute_member_grade}</p>
                                <p>Felkészítő tanár: ${application.teacher}</p>
                                <p>Kategória: ${application.category}</p>
                                <p>Programnyelv: ${application.programming_language}</p>
                            </div>
                        </details>
                    </td>
                    <td class="action-buttons">
                        <button class="approve-btn" onclick="showApproveConfirmation('${application.id}')">
                            Elfogadás
                        </button>
                        <button class="reject-btn" onclick="showRejectConfirmation('${application.id}')">
                            Visszautasítás
                        </button>
                        <button class="delete-btn" onclick="showDeleteConfirmation('${application.id}')">
                            Törlés
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            showMessage(data.message || "Nincsenek adatok elérhetőek.", "error");
        }
    })
    .catch(error => {
        console.error("Hiba történt a lekérés során:", error);
        showMessage("Hiba történt a lekérés során.", "error");
    });

// CSV Export gomb eseménykezelője
document.getElementById('exportCsv').addEventListener('click', () => {
    window.location.href = '../php/export_csv.php';
});
    
    // Globális függvények
    window.showDeleteConfirmation = showDeleteConfirmation;
    window.showApproveConfirmation = showApproveConfirmation;
    window.showRejectConfirmation = showRejectConfirmation;
});