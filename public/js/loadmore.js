$('.espn.row-result-contents').slice(0,2).removeClass('hide');
$('.show-more.espn').on('click', function(){
    var row = $('.espn.row-result-contents:hidden').slice(0,1).slideDown();
    row.slideDown();
    row.css('display', 'flex');
    var remaining = $('.espn.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.espn').slice(0,1).addClass('hide');
    }
});
$('.br.row-result-contents').slice(0,2).removeClass('hide');
$('.show-more.br').on('click', function(){
    var row = $('.br.row-result-contents:hidden').slice(0,1);
    row.slideDown();
    row.css('display', 'flex');
    var remaining = $('.br.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.br').slice(0,1).addClass('hide');
    }
});
$('.fox.row-result-contents').slice(0,2).removeClass('hide');
$('.show-more.fox').on('click', function(){
    var row = $('.fox.row-result-contents:hidden').slice(0,1);
    row.slideDown();
    row.css('display', 'flex');
    var remaining = $('.fox.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.fox').slice(0,1).addClass('hide');
    }
});
$('.nba.row-result-contents').slice(0,2).removeClass('hide');
$('.show-more.nba').on('click', function(){
    var row = $('.nba.row-result-contents:hidden').slice(0,1);
    row.slideDown();
    row.css('display', 'flex');
    var remaining = $('.nba.row-result-contents:hidden').slice(0,1);
    if(remaining.length === 0){
        $('.show-more.nba').slice(0,1).addClass('hide');
    }
});