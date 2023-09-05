document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.getElementById('menu-icon');
    const overlay = document.getElementById('overlay');

    menuIcon.addEventListener('click', function() {
        if (overlay.style.display === 'none' || overlay.style.display === '') {
            overlay.style.display = 'flex';
            menuIcon.src = 'img/xmark-solid.png';
        } else {
            overlay.style.display = 'none';
            menuIcon.src = 'img/bars-solid.png';
        }
    });
});
