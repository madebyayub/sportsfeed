$('.espn.row-result-contents').slice(0,1).removeClass('hide');
$('.show-more.espn').on('click', function(){
    var row = $('.espn.row-result-contents:hidden').slice(0,1).slideDown();
    row.slideDown();
    row.css('display', 'flex');
    var remaining = $('.espn.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.espn').slice(0,1).addClass('hide');
    }
});
$('.br.row-result-contents').slice(0,1).removeClass('hide');
$('.show-more.br').on('click', function(){
    var row = $('.br.row-result-contents:hidden').slice(0,1);
    row.slideDown();
    row.css('display', 'flex');
    var remaining = $('.br.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.br').slice(0,1).addClass('hide');
    }
});