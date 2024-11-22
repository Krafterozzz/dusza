
let clickCount = 0; // Kattintások számlálója

document.getElementById("close-registration").addEventListener("click", function() {
  clickCount++; // Növeli a kattintásszámlálót
  if (clickCount < 3) {
    document.getElementById("message").innerText = `Még ${3 - clickCount} kattintás szükséges a lezáráshoz.`;
  } else {
    document.getElementById("message").innerText = "A jelentkezés lezárva!";
    document.getElementById("close-registration").disabled = true; // Gomb letiltása lezárás után
  }
});


   document.addEventListener("DOMContentLoaded", function() {
    const deadlineForm = document.getElementById("deadline-form");
    const deadlineInput = document.getElementById("deadline");
    const currentDeadlineElement = document.getElementById("current-deadline");
    const messageElement = document.getElementById("message");

    // Fetch the current deadline when the page loads
    fetchDeadline();

    // Function to fetch the current registration deadline
    function fetchDeadline() {
        fetch("../php/get_deadline.php")
            .then(response => response.json())
            .then(data => {
                if (data.deadline) {
                    // Convert the deadline to a local date format
                    const formattedDeadline = new Date(data.deadline).toLocaleString();
                    currentDeadlineElement.innerHTML = `Jelenlegi határidő: ${formattedDeadline}`;
                } else {
                    currentDeadlineElement.innerHTML = "Jelenlegi határidő: Nincs beállítva.";
                }
            })
            .catch(error => {
                currentDeadlineElement.innerHTML = "Hiba történt a határidő lekérése során.";
                console.error('Error fetching deadline:', error);
            });
    }

    // Handle form submission to update the deadline
    deadlineForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const newDeadline = deadlineInput.value;
        
        const formData = new FormData();
        formData.append("deadline", newDeadline);

        fetch("../php/update_deadline.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(message => {
            messageElement.innerHTML = message;
            fetchDeadline(); // Refresh the current deadline after update
        })
        .catch(error => {
            messageElement.innerHTML = "Hiba történt a frissítés során.";
            console.error('Error updating deadline:', error);
        });
    });
});
