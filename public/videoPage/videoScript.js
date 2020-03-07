var compID = localStorage.getItem('id');
var title = localStorage.getItem('title');
var backButton = document.querySelector('.backButton');
var markupURL = 'http://localhost:5000/video/stream/' + compID;

$(document).ready(function(){
    $('video').attr('src',markupURL);
    $('#videoTitle').text(title);
});

backButton.addEventListener('click', function(){
    var temp = "../titlePages/" + compID.split("_")[1] + ".html";
    
    window.open(temp,'_self');
    window.load();
});
alert(compID);
alert(title);
localStorage.removeItem("id");
localStorage.removeItem("title");