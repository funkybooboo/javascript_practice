for(let i = 0; i < 16; i++){
    $('.grid-container').append('<div class= "grid-item"></div>')
}

$(".grid-item").click(function(){
    $(this).toggleClass("button")
});

