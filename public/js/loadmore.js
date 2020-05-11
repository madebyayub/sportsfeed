$('.espn.row-result-contents').slice(0,2).removeClass('hide');
$('.show-more.espn').on('click', function(){
    $('.espn.row-result-contents:hidden').slice(0,1).removeClass('hide');
    var remaining = $('.espn.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.espn').slice(0,1).addClass('hide');
    }
});
$('.br.row-result-contents').slice(0,2).removeClass('hide');
$('.show-more.br').on('click', function(){
    $('.br.row-result-contents:hidden').slice(0,1).removeClass('hide');
    var remaining = $('.br.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.br').slice(0,1).addClass('hide');
    }
});