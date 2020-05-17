/*
    JavaScript file for the functionality of the load more button.
    HTML file hides all result rows, this JS file unhides the first
    two rows, and adds a click event listener to the show more button
    which unhides the next row.
*/
var rows = $('.result-row');
for (let i = 0; i < rows.length; i++){
    $('.resultrow'+i).slice(0,2).removeClass('hide');
    $('#show-resultrow'+i).on('click', function(){
        console.log(i);
        var row = $('.resultrow' + i + '.row-result-contents:hidden').slice(0,1).slideDown();
        row.slideDown();
        row.css('display', 'flex');
        var remaining = $('.resultrow' + i + '.row-result-contents:hidden').slice(0,1);
        if(remaining.length === 0){
            $('#show-resultrow'+i).slice(0,1).addClass('hide');
        }
    });
}