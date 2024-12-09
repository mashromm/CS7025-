import { handleScrollButton } from "./scroll.js";
import { validateForm } from "./formValidation.js";
import { loadBlogData, generateBlogPosts } from "./blogLoader.js";
import { loadGalleryData, generateImageGallery } from './dynamicGallery.js';
import { loadCarouselData, startImageCarousel } from './imageCarousel.js';
import { initializeWeatherFeature } from './fetchWeather.js';

document.addEventListener("DOMContentLoaded", function () {
    handleScrollButton();
    validateForm();
    initializeWeatherFeature();

    Promise.all([
        loadGalleryData('./js/gallery.json'),
        loadBlogData('./js/blogData.json'),
        loadCarouselData('./js/imageCarousel.json') // Load carousel data
    ])
    .then(([galleryData, blogData, carouselData]) => {
        generateBlogPosts('blog-container', blogData.blogPosts);
        generateImageGallery('gallery-container', galleryData.gallery);
        startImageCarousel('imageCarousel-container', carouselData.carouselImages); // carouselData is a variable name and can be replaced; it holds the entire JSON object, but I only need the images array, so I use .carouselImages
    })
    .catch(error => console.error('Error loading JSON data:', error));
});
