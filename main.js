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
        html += '<div class="userInput">';
        html += '<div class="userName">' + value.name + '</div>';
        html += '<div class="userCommet">' + value.comment + '</div>';
        html += '</div>';
        html += '<div class="edit">Edit</div>';
        html += '<div class="delete" id="' + row++ + '">Delete</div>';
        html += '</div>';
    });
    $(".commentsPage").html(html);
    
}

refreshPage();

$(".submit").hover(function(){
    $(this).css("color", "blue");
    }, function(){
    $(this).css("color", "lightseagreen");
});

$(".submit").click(function(){
    let name = $("#displayName").val();
    let comment = $("#commentBox").val();

    if(name === ""){
        alert("Please Enter a Display Name");
        return;
    }
    if(comment === ""){
        alert("Please Enter a Comment");
        return;
    }
    let entry = {};
    entry['name'] = name;
    entry['comment'] = comment;
    values.push(entry);
    refreshPage();
});

$(".edit").hover(function(){
    $(this).css("color", "blue");
    }, function(){
    $(this).css("color", "lightseagreen");
});

$(".edit").click(function(){
    // change object from "values" array
    refreshPage();
});

$(".delete").hover(function(){
    $(this).css("color", "blue");
    }, function(){
    $(this).css("color", "lightseagreen");
});

$(".delete").click(function(){
    let row = $(this).attr('id');
    values.splice(row, 1);
    refreshPage();
});
