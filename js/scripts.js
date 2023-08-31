const hamburgerMenu = document.querySelector('.hamburger-menu');
const overlay = document.querySelector('.overlay');
const navButtons = overlay.querySelector('.nav-buttons');

hamburgerMenu.addEventListener('click', function() {
    if (overlay.style.display === 'flex') {
        overlay.style.display = 'none';
        // ハンバーガーアイコンを表示、✕アイコンを非表示
        hamburgerMenu.querySelector('.bar').style.display = 'block';
        hamburgerMenu.querySelector('.close-icon').style.display = 'none';
    } else {
        overlay.style.display = 'flex';
        // ✕アイコンを表示、ハンバーガーアイコンを非表示
        hamburgerMenu.querySelector('.bar').style.display = 'none';
        hamburgerMenu.querySelector('.close-icon').style.display = 'block';
    }
});
