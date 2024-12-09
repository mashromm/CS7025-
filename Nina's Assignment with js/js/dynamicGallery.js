
export async function loadGalleryData(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

export function generateImageGallery(containerID, images) {
    const galleryContainer = document.getElementById(containerID);

    if (!galleryContainer) {
        console.error(`Container with ID "${containerID}" not found.`);
        return;
    }

    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: "0px", // Offset
        threshold: 0.1 // Trigger when 10% of the element enters the viewport
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in"); // Add fade-in class
                observer.unobserve(entry.target); // Stop observing
            }
        });
    }, observerOptions);

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.classList.add('gallery-image', 'observer-target'); // Add style class and target class
        galleryContainer.appendChild(imgElement);

        // Add observation immediately when dynamically creating images
        observer.observe(imgElement);
    });
}
