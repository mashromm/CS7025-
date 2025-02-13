document.addEventListener("DOMContentLoaded", function () {
    // Get the HTML elements of the upload component
    const uploadBox = document.getElementById("uploadBox");
    const imageInput = document.getElementById("imageInput");
    const previewImage = document.getElementById("previewImage");
    const uploadText = document.getElementById("uploadText");
    const uploadButton = document.getElementById("uploadButton");

    let uploadedImage = null;

    // First, check if uploadBox exists to prevent `null.addEventListener` error
    if (!uploadBox || !imageInput || !previewImage || !uploadText || !uploadButton) {
        console.error("Upload elements not found. Check your HTML.");
        return;
    }

    // Trigger file selection when the upload box is clicked
    uploadBox.addEventListener("click", () => {
        imageInput.click();
    });

    // Handle user file selection
    imageInput.addEventListener("change", function (event) {
        handleFileUpload(event.target.files[0]);
    });

    // Drag-and-drop upload functionality
    uploadBox.addEventListener("dragover", (event) => {
        event.preventDefault();
        uploadBox.style.borderColor = "#007bff";
    });

    uploadBox.addEventListener("dragleave", (event) => {
        uploadBox.style.borderColor = "#ccc";
    });

    uploadBox.addEventListener("drop", (event) => {
        event.preventDefault();
        uploadBox.style.borderColor = "#ccc";

        const file = event.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    });

    function handleFileUpload(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                uploadText.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    }
});
