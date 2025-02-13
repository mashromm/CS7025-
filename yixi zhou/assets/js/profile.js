document.addEventListener("DOMContentLoaded", function () {
    console.log("Sidebar script loaded.");

    // Handle Sidebar menu toggle
    const sidebarLinks = document.querySelectorAll(".sidebar .sidebar-link");
    const gallerySections = document.querySelectorAll(".gallery-content");

    function handleSectionClick(event) {
        event.preventDefault();
        const section = this.getAttribute("data-section");

        console.log("Clicked section:", section);

        if (!section || !document.getElementById(`gallery-${section}`)) {
            console.warn("No matching gallery section found:", `gallery-${section}`);
            return;
        }

        // Hide all gallery sections and display the selected one
        gallerySections.forEach(div => div.classList.add("d-none"));
        document.getElementById(`gallery-${section}`).classList.remove("d-none");

        // Update selection state
        sidebarLinks.forEach(link => link.classList.remove("fw-bold"));
        this.classList.add("fw-bold");
    }

    sidebarLinks.forEach(link => link.addEventListener("click", handleSectionClick));

    // Profile picture upload logic
    const profileInput = document.getElementById("profile-picture-upload");
    const profilePhoto = document.getElementById("ProfilePhoto");

    if (profileInput && profilePhoto) {
        profileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePhoto.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.error("Profile picture input or image element not found.");
    }
});
