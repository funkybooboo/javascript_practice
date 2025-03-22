let navItems = $('#nav').children();
$(navItems).each(function(){
    $(this).css('color', 'white');
});

$('#nav').css('background-color', '#145');

let children = $('ul').children();
let count = 0;
$(children).each(function(){
    if(++count % 2 === 0){
        $(this).css('background-color', '#ccc');
    }else{
        $(this).css('background-color', '#aaa');
    }
});

$("input:text").val("Nathan");
