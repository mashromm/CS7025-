export function handleScrollButton() {
    const backToTopButton = document.querySelector('.back-to-top-btn');

    if (!backToTopButton) {
        console.error("No element found with class 'back-to-top-btn'.");
        return;
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
