

document.addEventListener("DOMContentLoaded", function () {
    const stations = document.querySelectorAll(".station");

    stations.forEach(station => {
        station.addEventListener("click", function () {
            const dropdown = this.nextElementSibling;
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // array of station names
    const stationNames = [
        "Howth", "Sutton", "Bayside", "Malahide", "Portmarnock", "Clongriffin",
        "Howth Junctions & Donaghmede", "Kilbarrack", "Raheny", "Harmonstown",
        "Killester", "Clontarf Road", "Docklands", "Connolly", "Tara Street",
        "Pearse", "Grand Canal Dock", "Lansdowne Road", "Sandymount", "Sydney Parade",
        "Booterstown", "Blackrock", "Seapoint", "Salthill & Monkstown", "Dun Laoghaire",
        "Sandycove & Glasthule", "Glengeary", "Dalkey", "Killiney", "Shankill",
        "Bray", "Greystones"
    ];
    stationNames.sort(); // ordered by alphabet

    // create a dropdown menu dynamicallu
    const stationDropdown = document.querySelector(".station-dropdown");
    stationDropdown.innerHTML = '';

    stationNames.forEach(station => {
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.innerText = station;
        dropdownItem.onclick = function () {
            selectStation(this);
        };
        stationDropdown.appendChild(dropdownItem);
    });

    // choose issue type
    const issueTypes = ["Elevators", "Toilets", "Shelter", "Seating", "Kiosks", "Other"];

    // create a dropdown menu dynamicallu
    const issueDropdown = document.querySelector(".issue-dropdown");
    issueDropdown.innerHTML = '';
    issueTypes.forEach(issue => {
        const dropdownItem = document.createElement('div');
        dropdownItem.classList.add('dropdown-item');
        dropdownItem.innerText = issue;
        dropdownItem.onclick = function () {
            selectIssue(this);
        };
        issueDropdown.appendChild(dropdownItem);
    });

    // bind with click event, show/hide the dropdown menu
    document.querySelectorAll(".dropdown-trigger").forEach(trigger => {
        trigger.addEventListener("click", function () {
            const dropdown = this.nextElementSibling; // find the menu accordingly
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


