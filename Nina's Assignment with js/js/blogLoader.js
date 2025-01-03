
export async function loadBlogData(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
}

// Dynamically generate blog posts
export function generateBlogPosts(containerID, posts) {
    const blogContainer = document.getElementById(containerID);

    if (!blogContainer) {
        console.error(`Container with id "${containerID}" not found.`);
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('blog-post'); // Add a class to the div
        // Assign the h2 tag to the post.title from JSON
        postElement.innerHTML = `
            <h2>${post.title}</h2>             
            <p><strong>Category:</strong> ${post.category} | <strong>Date:</strong> ${post.date}</p>
            <p>${post.content}</p>
        `;
        blogContainer.appendChild(postElement);
    });
}
