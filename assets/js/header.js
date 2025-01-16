document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    
    // Dynamically set path to header.html
    const pathToHeader = window.location.pathname.includes('/pages/')
        ? '../components/header.html' // For files in the pages/ folder
        : 'components/header.html';   // For index.html in the root

    fetch(pathToHeader)
        .then(response => response.text())
        .then(html => {
            navbarPlaceholder.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
});
