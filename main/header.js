document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    
    fetch('./main/header.html')
        .then(response => response.text())
        .then(html => {
            navbarPlaceholder.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
});
