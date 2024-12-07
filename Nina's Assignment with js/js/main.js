import { handleScrollButton } from "./scroll.js";
import { validateForm } from "./formValidation.js";
import { loadBlogData, generateBlogPosts } from "./blogLoader.js";
import { loadGalleryData, generateImageGallery } from './dynamicGallery.js';
import { loadCarouselData, startImageCarousel } from './imageCarousel.js';
import { initializeWeatherFeature} from './fetchWeather.js';

document.addEventListener("DOMContentLoaded", function () {
    handleScrollButton();
    validateForm();
    initializeWeatherFeature();

    Promise.all([
        loadGalleryData('./js/gallery.json'),
        loadBlogData('./js/blogData.json'),
        loadCarouselData('./js/imageCarousel.json') // 加载轮播数据
    ])
    .then(([galleryData, blogData,carouselData]) => {
        generateBlogPosts('blog-container', blogData.blogPosts);
        generateImageGallery('gallery-container', galleryData.gallery);
        startImageCarousel('imageCarousel-container', carouselData.carouselImages); //carouselData是变量名可随意替换，承接了整个json对象，但我只需要图片数组，所以用.carouselImages
        
    })
    .catch(error => console.error('Error loading JSON data:', error));
});