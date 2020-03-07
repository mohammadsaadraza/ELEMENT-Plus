$(document).ready(function(){
    $('.card-hover').click(function(){
        var temp = "../titlePages/" + $(this).attr('id') + '.html';
        window.open(temp,'_self');
        window.load();
    });
});