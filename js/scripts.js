$(document).ready(function(){
    $('.thumbnail').hover(function(){
        // マウスオーバーされたとき
        let originalTextCategory = $(this).find('.thumbnail-category').text();
        let originalTextTitle = $(this).find('.thumbnail-title').text();

        // テキストをハイフンでクリアする
        $(this).find('.thumbnail-category').text("".repeat(originalTextCategory.length));
        $(this).find('.thumbnail-title').text("".repeat(originalTextTitle.length));

        // アニメーション開始
        animateText($(this).find('.thumbnail-category'), originalTextCategory, 340);
        animateText($(this).find('.thumbnail-title'), originalTextTitle, 340);

    }, function(){
        // マウスが離れたとき（テキストをリセット）
        $(this).find('.thumbnail-category').text(originalTextCategory);
        $(this).find('.thumbnail-title').text(originalTextTitle);
    });
});

function animateText(element, originalText, duration){
    let length = originalText.length;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-[]{}|;:',.<>?/";

    for (let i = 0; i < length; i++) {
        setTimeout(function() {
            let charAnimation = setInterval(function(){
                let tempText = element.text();
                let randomChar = possible.charAt(Math.floor(Math.random() * possible.length));
                element.text(tempText.substring(0, i) + randomChar + tempText.substring(i + 1));
            }, 50);

            // アニメーションを0.55秒後に終了し、オリジナルの文字に戻す
            setTimeout(function(){
                clearInterval(charAnimation);
                let tempText = element.text();
                element.text(tempText.substring(0, i) + originalText.charAt(i) + tempText.substring(i + 1));
            }, 340);

        }, i * (550 / length)); // 各文字に対するタイムラグを設定
    }
}
