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

    // 动态生成图片
    images.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt;
        imgElement.classList.add('carousel-image'); // 为轮播图片指定独立的类
        imgElement.setAttribute('data-index', index); // 设置索引
        imageCarouselContainer.appendChild(imgElement);
    });

    const allImages = imageCarouselContainer.querySelectorAll('.carousel-image');
    let currentIndex = 0;

    // 初始化：显示第一张图片
    allImages.forEach(img => img.classList.remove('fade-in', 'fade-out', 'visible'));
    allImages[currentIndex].classList.add('fade-in', 'visible');

    function showNextImage() {
        // 当前图片淡出
        allImages[currentIndex].classList.remove('fade-in');
        allImages[currentIndex].classList.add('fade-out');

        // 计算下一张图片的索引
        const nextIndex = (currentIndex + 1) % allImages.length;

        // 下一张图片淡入
        allImages[nextIndex].classList.remove('fade-out');
        allImages[nextIndex].classList.add('fade-in', 'visible');

        // 更新索引
        currentIndex = nextIndex;

        // 1秒后显示下一张图片
        setTimeout(showNextImage, 1200);
    }

    // 启动轮播
    setTimeout(showNextImage, 1000);
}
