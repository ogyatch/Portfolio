const hamburgerMenu = document.querySelector('.hamburger-menu');
const overlay = document.querySelector('.overlay');
const navButtons = overlay ? overlay.querySelector('.nav-buttons') : null;
const closeIcon = hamburgerMenu ? hamburgerMenu.querySelector('.fa-times') : null;
const barsIcon = hamburgerMenu ? hamburgerMenu.querySelector('.fa-bars') : null;

if (barsIcon) {
    // ハンバーガーアイコンがクリックされたときの動作
    barsIcon.addEventListener('click', function() {
        if (overlay) {
            overlay.style.display = 'flex';
        }
        this.style.display = 'none'; // ハンバーガーアイコンを非表示
        if (closeIcon) {
            closeIcon.style.display = 'block'; // ✕アイコンを表示
        }
    }, false);
}

if (closeIcon) {
    // 閉じるアイコンがクリックされたときの動作
    closeIcon.addEventListener('click', function() {
        if (overlay) {
            overlay.style.display = 'none';
        }
        if (barsIcon) {
            barsIcon.style.display = 'block'; // ハンバーガーアイコンを表示
        }
        this.style.display = 'none'; // ✕アイコンを非表示
    }, false);
}
