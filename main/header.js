document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            navbarPlaceholder.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
});
