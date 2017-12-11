var box = '';
var bombs = [];
var flags = [];
var numBombs = 10;
var clickTile = {'border':'1px dotted black','height':'28px', 'width':'28px'};
var ur = 0
var u = 0
var ul = 0
var l = 0
var r = 0
var lowr = 0
var low = 0
var lowl = 0
var theTimer;
var timer = parseInt($(".timer").text());
function box(){
  return "<div class='box'></div>"
}
function setGrid(width,height) {
  return {
    width: width,
    height: height
  };
}
$(document).ready(function(){
  bindClickHandlers();
  gridSetup();
  $('.board').hide();
});
function setTimer(){
  $(".timer").text(parseInt($(".timer").text())+1);
}
//setTimer utilized by var: theTimer
function secondHandlerBinding(){
   $("#X").click(function(){
    confirm('Are you sure you want to quit?');
  });
  $('#X').off('click');
  $("#X").on('click');
  $("#X").click(function(){
    if (confirm('Are you sure you want to quit?') == true){
      resetBoard();}
  });
  $("#i").off('click');
  $("#i").click(function(){
    alert('Select Box: Left Click. Flag Box: Ctrl + Left Click');
  });
  $(".face").off('click');
  $(".face").on('click');
  $(".container").children().mousedown(function(ev){
    if($(this).hasClass('gameOver')){return;}
    if($(this).hasClass('box')){
      if ($(this).hasClass('clicked')){}
      else if (ev.ctrlKey){}
      else{
        $(this).css('border', '4px inset grey');}
      }});
  $('.container').children().mouseup(function(ev){
    if($(this).hasClass('gameOver')){return;}
    var indy = parseInt($(this).attr('id'));
    if (parseInt($(".timer").text())===0) {
      $(".timer").text(1);
      theTimer = setInterval(function(){setTimer()}, 1000);
    }
    if ($(this).hasClass('box') && ev.ctrlKey && !($(this).hasClass('clicked'))){

      if ($(this).hasClass('flag')){
        $(this).removeClass('flag');
        flags.splice(flags.indexOf(indy),1);
      }
      else{
          flags.push(indy);
          $(this).addClass('flag');
          if (bombs.length == flags.length){
            if (bombs.sort().toString() == flags.sort().toString()){ youWon();}
          }
        }
      $(".score").text(numBombs - flags.length);
      }

    else if ($(this).hasClass('bmb')){
      $(this).html("<i class='fa-bomb fa fa-lg' aria-hidden='true'></i>");
      $(this).addClass('clicked');
      $(this).css(clickTile);
      youLose();
    }
    else{
      if ($(this).hasClass('flag')){
        flags.splice(flags.indexOf(indy),1);
        $(".score").text(parseInt($(".score").text())+1);
        $(this).removeClass('flag');
      }
      $(this).css(clickTile);
      $(this).addClass('clicked');
      if ($(this).attr('value') != '0'){
        $(this).text($(this).attr("value"));
        $(this).css("text-align", "center");
      }
      else if ($(this).hasClass('blank')){
        clearBlanks(parseInt($(this).attr('id')));
      }
    }
  });
}
function little(){

}
function bindClickHandlers(){
  $("#boom").click(function(ev){
    console.log(ev.ctrlKey);
  });
  $(".small").click(function(){
    $(".score").text(10);
    gridSetup(9,9,0);
    numBombs = 10;
    bombSetup(9*9);
    $(".face").css('flex','2')});
  $(".medium").click(function(){
    $(".score").text(40);
    gridSetup(16,16,1);
    numBombs = 40;
    bombSetup(16*16);
    $(".face").css('flex','5');
    });
  $(".large").click(function(){
    $(".score").text(99);
    gridSetup(16,30,2);
    numBombs = 99;
    bombSetup(16*30);
    $(".face").css('flex','10');});
  $(".size").children().mouseup(function(){
    $(".selector").hide();
  });

}

/* use variables in gridSetup for different sizes*/
function gridSetup(y,x,z){

  $('.board').show();
  if (z == 0){
    $('.container').animate(setGrid(252,260),0);
    $('.board').animate(setGrid(252,310),0);
    $('.scorebar').animate(setGrid(252,36),0);
    $('.navbar').animate(setGrid(249,18),0);
  }
  else if (z == 1){
    $('.container').animate(setGrid(448,450),0);
    $('.board').animate(setGrid(448,506),0);
    $('.scorebar').animate(setGrid(448,36),0);
    $('.navbar').animate(setGrid(445,18),0);
  }
  else{
    $('.container').animate(setGrid(840,450),0);
    $('.board').animate(setGrid(840,506),0);
    $('.scorebar').animate(setGrid(840,36),0);
    $('.navbar').animate(setGrid(837,18),0);
  }

  for (j=1;j<(y*x)+1;j++){
    num = j;
    $(".container").append('<div class="box blank" id = ' + num + ' value = 0></div>');
  }
  secondHandlerBinding();
  /*for (j=1;j<(y*x)+1;j++){
    $("#" + j).text(j);
  }*/


}
function flag(){
  if ((thing).hasFlag()){
    click();
  }
}
function bombSetup(area){
  bombs = [];

  /*first setup array*/
  while (bombs.length < numBombs){
    x = Math.floor(Math.random() * area)
    if (bombs.indexOf(x) != -1 || x === 0){}
    else{
      bombs.push(x);
    }
  }
  console.log(bombs);
  bombs.forEach(function(x){
    $("#"+x).removeClass('blank');
    $('#'+x).addClass('bmb');

  });
  setNums();
  /*positions are different by 27.5px
  so check every square, if there's a bomb near it, add the number class'*/

}
function setNums(){
  if (numBombs == 10){
    y = 9;
    z = 9;
  }
  else if (numBombs == 40){
    y = 16;
    z = 16;
  }
  else {
    y = 16;
    z = 30;
  }
  bombs.forEach(function(boom){
    surrounding(boom);
    resetAndAddNums()});
  for (i = 1; i < y*z; i++){
    if (parseInt($("#"+i).attr('value')) > 0){
      $("#"+i).addClass('b'+$("#"+i).attr('value'));
      $("#"+i).removeClass('blank');
    }
  }
}
function clearBlanks(i){
  surrounding(i);
  clearBlanksReset();

}
function clearBlanksReset(){
  var squareNums = [ul,u,ur,r,l,lowl,low,lowr];
  for (i = 0; i < squareNums.length; i++){
    var b = squareNums[i];
    if (b != 0 && $("#"+b).hasClass('blank') && !$("#"+b).hasClass('clicked')) {
      $("#"+b).css(clickTile);
      $("#"+b).addClass('clicked');
      if (b % z !== 0){
        squareNums.push(b + 1);
      }
      if (b % z != 1 && b != 1){
        squareNums.push(b - 1)
      }
      if (b > z){
        squareNums.push(b - z);
      }
      if (b < ((z*y)-z)){
        squareNums.push(b+z);
      }
    }
    else if (b != 0 && $("#"+b).attr('value') != '0' ){
      $("#"+b).css(clickTile);
      $("#"+b).addClass('clicked');
      $("#"+b).text($("#"+b).attr('value'));
      $("#"+b).css('text-align', 'center');
    }
  };
  squareNums.pop(0);
  if (squareNums.length == 1){
    return;
  }
  ul,u,ur,r,l,lowl,low,lowr = 0;
}
function surrounding(boom){
    ul = boom - z - 1;
    u = boom - z;
    ur = boom - z + 1;
    l = boom - 1;
    r = boom + 1;
    lowl = boom + z - 1;
    low = boom + z;
    lowr = boom + z + 1;
    if (boom == 1){
      l = lowl = ul = u = ur = 0;
            }
    else if (boom == z){
      ul = u = ur = r = lowr = 0;
    }
    else if(boom == y * z){
      ur = r = lowr = low = lowl = 0;
    }
    else if(boom == ((y * z) - z) + 1){
     ul = l = lowl = low = lowr = 0;
    }
    else if(boom < z && boom > 1){
      u = ul = ur = 0;
    }
    else if (boom % z == 1){
      ul = l = lowl = 0;
    }
    else if (boom % z == 0){
      ur = r = lowr = 0;
    }
    else if(boom < z*y && boom > ((y * z)-z)+1){
      low = lowl = lowr = 0;
    }
  }
function youWon(){
  alert('Aww yeah you did it! \nClick the face to restart!');
  clearInterval(theTimer);
  $(".container").children().addClass('gameOver');
  $(".face").click(resetBoard);
}
function youLose(){
  $("#face").attr("class", 'fa fa-frown-o fa-2x');
  //make sure they can see the end screen and click something else to reset
  for (i =0; i<bombs.length;i++){
    $("#"+bombs[i]).html("<i class='fa-bomb fa fa-lg' aria-hidden='true'></i>");
      $("#"+bombs[i]).addClass('clicked');
      $("#"+bombs[i]).css(clickTile);
  }
  alert('Oh no, you lost!\nClick the face to try again!');
  clearInterval(theTimer);
  $(".container").children().addClass('gameOver');
  $(".face").click(resetBoard);
}
function resetBoard(){
  clearInterval(theTimer);
  flags = [];
  $(".timer").text('0');
  $('.container').children().remove();
  $('.board').hide();
  $('.selector').show();
  $("#face").attr("class", 'fa fa-smile-o fa-2x');
  $(".container").children().removeClass('gameOver');
}
function resetAndAddNums(){
  var squareNums = [ul,u,ur,r,l,lowl,low,lowr];
  squareNums.forEach(function(b){
    if (b != 0 && !$("#"+b).hasClass('bmb')) {
      var val = ($("#"+b).attr('value'));
      $("#"+b).attr("value", parseInt(val) + 1);
    }
  });
  ul,u,ur,r,l,lowl,low,lowr = 0;
}
