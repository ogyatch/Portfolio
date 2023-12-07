$(document).ready(function () {
    // サムネイルの処理
    $('.thumbnail').hover(function () {
        // オリジナルのテキストを保存
        let originalTextCategory = $(this).find('.thumbnail-category').text();
        let originalTextTitle = $(this).find('.thumbnail-title').text();

        // アニメーションを開始
        animateText($(this).find('.thumbnail-category'), originalTextCategory, 340);
        animateText($(this).find('.thumbnail-title'), originalTextTitle, 340);

    }, function () {
        // マウスが離れたときに元のテキストに戻す
        $(this).find('.thumbnail-category').text($(this).find('.thumbnail-category').attr('data-original-text'));
        $(this).find('.thumbnail-title').text($(this).find('.thumbnail-title').attr('data-original-text'));
    });

    // $('ul li').each(function () {
    //     $(this).attr('data-original-text', $(this).text());
    // }).hover(function () {
    //     let originalText = $(this).attr('data-original-text');
    //     animateText($(this), originalText, 340);
    // }, function () {
    //     $(this).text($(this).attr('data-original-text'));
    // });

    // リンク付きリスト項目の処理
    $('ul li[data-url]').each(function(){
        $(this).attr('data-original-text', $(this).text());
    }).hover(function(){
        let originalText = $(this).attr('data-original-text');
        animateText($(this), originalText, 340, () => {
            // アニメーション終了後の処理
            $(this).addClass('clickable').on('click', function() {
                window.open($(this).data('url'), '_blank');
            });
        });
    }, function(){
        // マウスが離れたときの処理
        $(this).removeClass('clickable').off('click');
        $(this).text($(this).attr('data-original-text'));
    });
});

function animateText(element, originalText, duration, callback){
    let length = originalText.length;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-[]{}|;:',.<>?/";

    element.text("".repeat(length));

    for (let i = 0; i < length; i++) {
        setTimeout(function() {
            let charAnimation = setInterval(function(){
                let tempText = element.text();
                let randomChar = possible.charAt(Math.floor(Math.random() * possible.length));
                element.text(tempText.substring(0, i) + randomChar + tempText.substring(i + 1));
            }, 50);

            setTimeout(function(){
                clearInterval(charAnimation);
                let tempText = element.text();
                element.text(tempText.substring(0, i) + originalText.charAt(i) + tempText.substring(i + 1));

                if (i === length - 1 && callback) {
                    callback();
                }
            }, 340);

        }, i * (550 / length));
    }
}
