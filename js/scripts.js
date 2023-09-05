$(document).ready(function(){
    $('#hamburger-menu').click(function(){
        $('#menu-shade').toggle(); // シェードの表示・非表示を切り替え
        
        const currentIconSrc = $('#menu-icon').attr('src');
        
        if(currentIconSrc === 'img/bars-solid.png') {
            $('#menu-icon').attr('src', 'img/xmark-solid.png');
        } else {
            $('#menu-icon').attr('src', 'img/bars-solid.png');
        }
    });

    $('#menu-shade').click(function(){
        $(this).hide();
        $('#menu-icon').attr('src', 'img/bars-solid.png');
    });
});
