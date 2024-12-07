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
        root: null, // 使用视口作为根
        rootMargin: "0px", // 偏移量
        threshold: 0.1 // 元素进入视口 10% 时触发
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in"); // 添加淡入类
                observer.unobserve(entry.target); // 停止观察
            }
        });
    }, observerOptions);

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.classList.add('gallery-image', 'observer-target'); // 添加样式类和目标类
        galleryContainer.appendChild(imgElement);

        // 在动态创建图片时立即添加观察
        observer.observe(imgElement);
    });
}
