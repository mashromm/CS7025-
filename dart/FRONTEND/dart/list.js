function toggleDropdown(element) {
    let dropdown = element.nextElementSibling;

    if (!dropdown || !dropdown.classList.contains("dropdown")) {
        console.error("Dropdown not found for element:", element);
        return;
    }

    console.log("Dropdown found:", dropdown); // Debugging

    // **关闭其他展开的 dropdown**
    document.querySelectorAll(".dropdown").forEach(d => {
        if (d !== dropdown) {
            d.classList.remove("active");
        }
    });

    // **切换 class**
    dropdown.classList.toggle("active");
}



document.addEventListener("DOMContentLoaded", function () {
    const stations = document.querySelectorAll(".station");

    stations.forEach(station => {
        station.addEventListener("click", function () {
            const dropdown = this.nextElementSibling;
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });
    });
});



// choose station
function selectStation(element) {
    const repoStep = element.closest('.station-section').querySelector('.repo-step');
    repoStep.innerText = element.innerText;
    element.closest('.station-dropdown').style.display = "none";
}

// choose issue type
function selectIssue(element) {
    const repoStep = element.closest('.issue-section').querySelector('.repo-step');
    repoStep.innerText = element.innerText;
    element.closest('.issue-dropdown').style.display = "none";
}

// show popup
function showPopup(event) {
    event.preventDefault();

    document.getElementById('thankYouPopup').style.display = 'flex';
}

// function closePopup() {
//     document.getElementById('thankYouPopup').style.display = 'none';
// }


