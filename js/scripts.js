$(document).ready(function () {
    $('#hamburger-menu').click(function () {
        $('#menu-shade').toggle(); // シェードの表示・非表示を切り替え

        const currentIconSrc = $('#menu-icon').attr('src');

        if (currentIconSrc === 'img/bars-solid.png') {
            $('#menu-icon').attr('src', 'img/xmark-solid.png');
            $('.hamburger-menu').css('z-index', '1001'); // シェードより上に
        } else {
            $('#menu-icon').attr('src', 'img/bars-solid.png');
            $('.hamburger-menu').css('z-index', '0'); // 元に戻す
        }
    });

    $('#menu-shade').click(function () {
        $(this).hide();
        $('#menu-icon').attr('src', 'img/bars-solid.png');
        $('.hamburger-menu').css('z-index', '0'); // 元に戻す
    });
});
