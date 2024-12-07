// formValidation.js
export function validateForm() {
    const emailInput = document.querySelector(".email-input");
    const submitButton = document.querySelector(".submit-btn");

    if (!emailInput || !submitButton) {
        console.error("Form elements not found.");
        return;
    }

    submitButton.addEventListener("click", function (event) {
        event.preventDefault();
        const email = emailInput.value.trim();

        if (email === "") {
            alert("Please enter your email address.");
        } else if (!validateEmail(email)) {
            alert("Please enter a valid email address.");
        } else {
            alert("Thank you for subscribing!");
        }
    });
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
