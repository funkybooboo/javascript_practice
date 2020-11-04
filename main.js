let values = [
    {
        name: "Dave",
        comment: "stuff here"
    },
    {
        name: "Bob",
        comment: "Another comment"
    }
];
function refreshPage() {
    let html = "";
    let row = 0;
    values.forEach(value => {
        
        html += '<div class="comment">';

        html += '<img class="icon" src="https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png">';

        html += '<div class="theUsersCommentBox">';

        html += '<div class="userInput">';
        html += '<div class="userName">' + value.name + '</div>';
        html += '<div class="userCommet">' + value.comment + '</div>';
        html += '</div>';

        html += '<div class="EditandDelete">';
        html += '<div class="edit" id="' + row + '">Edit</div>';
        html += '<div class="delete" id="' + row + '">Delete</div>';
        html += '<input class="editText editText' + row + '" type="text" id="' + row + '" name="editBox" value="' + value.comment + '" style="display:none">';
        html += '<input class="editSubmit editSubmit' + row + '" type="submit" id="' + row + '" name="editSubmit" value="' + 'Submit' + '" style="display:none">';

        html += '</div>';

        html += '</div>';

        html += '</div>';
        row++;
    });
    $(".commentsPage").html(html);  
}

    refreshPage();


$(".submit").hover(function(){
    $(this).css("color", "blue");
    }, function(){
    $(this).css("color", "lightseagreen");
});

$(".makeAComment").on('click', '.submit', function(){
    let name = $("#displayName").val();
    let comment = $("#commentBox").val();

    if(name === "" && comment === ""){
        alert("Please Enter a Display Name and a Comment")
        return;
    }else if(name === ""){
        alert("Please Enter a Display Name");
        return;
    }else if(comment === ""){
        alert("Please Enter a Comment");
        return;
    }
    let entry = {};
    entry['name'] = name;
    entry['comment'] = comment;
    values.unshift(entry);
    $("#displayName").val("");
    $("#commentBox").val("");

    refreshPage();
});



$(".edit").hover(function(){
    $(this).css("color", "blue");
    }, function(){
    $(this).css("color", "lightseagreen");
});
$(".editSubmit").hover(function(){
    $(this).css("color", "blue");
    }, function(){
    $(this).css("color", "lightseagreen");
});
$('.commentsPage').on('click', '.editSubmit', function(){
    let row = $(this).attr('id');
    $(".editSubmit" + row).toggle();
    $(this).toggle();
    $(".editText" + row).toggle();

    let newValue = $(this).prev().val()
    let parents = $(this).parents()[1];
    let kid = $(parents).children()[0];
    let kid2 = $(kid).children()[1];
    let children = $(kid2);
    $(children).text(newValue);


});
$(".EditandDelete").on('click', '.editSubmit', function(){
    let row = $(this).attr('id');
    $(".editSubmit" + row).toggle();

});



$(".commentsPage").on('click', '.edit', function(){
    let row = $(this).attr('id');
    $(".editText" + row).toggle();
    $(".editSubmit" + row).toggle();
    

});

$(".delete").hover(function(){
    $(this).css("color", "blue");
    }, function(){
    $(this).css("color", "lightseagreen");
});

$(".commentsPage").on('click', '.delete', function(){
    let row = $(this).attr('id');
    values.splice(row, 1);
    refreshPage();
});



