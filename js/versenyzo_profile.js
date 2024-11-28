  // Fetch user data and populate form
  document.addEventListener("DOMContentLoaded", function() {
    fetch("../php/versenyzo_profile.php", {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("team_name").value = data.data.team_name || '';
            document.getElementById("school_name").value = data.data.school_name || '';
            document.getElementById("team_member1_name").value = data.data.team_member1_name || '';
            document.getElementById("team_member1_grade").value = data.data.team_member1_grade || '';
            document.getElementById("team_member2_name").value = data.data.team_member2_name || '';
            document.getElementById("team_member2_grade").value = data.data.team_member2_grade || '';
            document.getElementById("team_member3_name").value = data.data.team_member3_name || '';
            document.getElementById("team_member3_grade").value = data.data.team_member3_grade || '';
            document.getElementById("substitute_member_name").value = data.data.substitute_member_name || '';
            document.getElementById("substitute_member_grade").value = data.data.substitute_member_grade || '';
            document.getElementById("teacher").value = data.data.teacher || '';
            document.getElementById("category").value = data.data.category || '';
            document.getElementById("programming_language").value = data.data.programming_language || '';
        } else {
            document.getElementById("message").innerText = data.message;
        }
    })
    .catch(error => {
        console.error("Error fetching user data:", error);
        document.getElementById("message").innerText = "Hiba történt az adatok betöltésekor.";
    });
});

document.getElementById("profile-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch("../php/versenyzo_profile.php", {
        method: "POST",
        credentials: "include",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const messageElement = document.getElementById("message");
        if (data.success) {
            messageElement.innerText = "Adatok sikeresen frissítve!";
            messageElement.style.color = "green";  // Set the message text color to green
        } else {
            messageElement.innerText = "Hiba történt: " + data.message;
            messageElement.style.color = "red";  // Set the message text color to red in case of an error
        }
    })
    .catch(error => {
        console.error("Error updating user data:", error);
        const messageElement = document.getElementById("message");
        messageElement.innerText = "Hiba történt a frissítés során.";
        messageElement.style.color = "red";  // Set the message text color to red in case of an error
    });
});