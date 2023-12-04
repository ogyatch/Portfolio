$(document).ready(function(){
    // サムネイルの処理
    $('.thumbnail').hover(function(){
        // オリジナルのテキストを保存
        let originalTextCategory = $(this).find('.thumbnail-category').text();
        let originalTextTitle = $(this).find('.thumbnail-title').text();

        // アニメーションを開始
        animateText($(this).find('.thumbnail-category'), originalTextCategory, 340);
        animateText($(this).find('.thumbnail-title'), originalTextTitle, 340);

    }, function(){
        // マウスが離れたときに元のテキストに戻す
        $(this).find('.thumbnail-category').text($(this).find('.thumbnail-category').attr('data-original-text'));
        $(this).find('.thumbnail-title').text($(this).find('.thumbnail-title').attr('data-original-text'));
    });

    // リスト項目の処理
    $('ul li').each(function(){
        // 各リスト項目のオリジナルのテキストを保存
        $(this).attr('data-original-text', $(this).text());
    }).hover(function(){
        // マウスオーバーされたときの処理
        let originalText = $(this).attr('data-original-text');
        animateText($(this), originalText, 340);
    }, function(){
        // マウスが離れたときの処理
        $(this).text($(this).attr('data-original-text'));
    });
});

function animateText(element, originalText, duration){
    let length = originalText.length;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-[]{}|;:',.<>?/";

    // テキストをクリアする
    element.text("".repeat(length));

    for (let i = 0; i < length; i++) {
        setTimeout(function() {
            let charAnimation = setInterval(function(){
                let tempText = element.text();
                let randomChar = possible.charAt(Math.floor(Math.random() * possible.length));
                element.text(tempText.substring(0, i) + randomChar + tempText.substring(i + 1));
            }, 50);

            // アニメーションを終了し、オリジナルの文字に戻す
            setTimeout(function(){
                clearInterval(charAnimation);
                let tempText = element.text();
                element.text(tempText.substring(0, i) + originalText.charAt(i) + tempText.substring(i + 1));
            }, 340);

        }, i * (550 / length)); // 各文字に対するタイムラグを設定
    }
}
