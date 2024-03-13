$(document).ready(function () {

    $('.thumbnail').hover(function () {
        let originalTextCategory = $(this).find('.thumbnail-category').text();
        let originalTextTitle = $(this).find('.thumbnail-title').text();

        animateText($(this).find('.thumbnail-category'), originalTextCategory, 340);
        animateText($(this).find('.thumbnail-title'), originalTextTitle, 340);

    }, function () {
        $(this).find('.thumbnail-category').text($(this).find('.thumbnail-category').attr('data-original-text'));
        $(this).find('.thumbnail-title').text($(this).find('.thumbnail-title').attr('data-original-text'));
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
