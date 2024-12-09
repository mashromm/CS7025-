// imageCarousel.js
export async function loadCarouselData(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

export function startImageCarousel(containerID, images) {
    const imageCarouselContainer = document.getElementById(containerID);

    if (!imageCarouselContainer) {
        console.error(`Container with ID "${containerID}" not found.`);
        return;
    }

    // Dynamically generate images
    images.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.classList.add('carousel-image'); // Assign a dedicated class for carousel images
        imgElement.setAttribute('data-index', index); // Set index
        imageCarouselContainer.appendChild(imgElement);
    });

    const allImages = imageCarouselContainer.querySelectorAll('.carousel-image');
    let currentIndex = 0;

    // Initialize: Show the first image
    allImages.forEach(img => img.classList.remove('fade-in', 'fade-out', 'visible'));
    allImages[currentIndex].classList.add('fade-in', 'visible');

    function showNextImage() {
        // Fade out the current image
        allImages[currentIndex].classList.remove('fade-in');
        allImages[currentIndex].classList.add('fade-out');

        // Calculate the index of the next image
        const nextIndex = (currentIndex + 1) % allImages.length;

        // Fade in the next image
        allImages[nextIndex].classList.remove('fade-out');
        allImages[nextIndex].classList.add('fade-in', 'visible');

        // Update the index
        currentIndex = nextIndex;

        // Show the next image after 1 second
        setTimeout(showNextImage, 1200);
    }

    // Start the carousel
    setTimeout(showNextImage, 1000);
}
