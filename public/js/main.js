console.log('Javascript ready to go...')



$('.remove').on('click', function(e) {
  var id = $(this).attr('data-id')

  $.ajax({
    url: '/task/' + id,
    method: 'DELETE'
  })
  .then( data => {
    console.log(data);
    window.location.reload()
  } )

})

$('.done').on('click', function(e) {
  var id = $(this).attr('data-id')

  $.ajax({
    url: '/completed/' + id,
    method: 'PUT'
  })
  .then( data => {
    console.log(data);
    window.location.reload()
  } )

})

$('.doneAll').on('click', function(e) {

  $.ajax({
    url: '/done-all',
    method: 'PUT'
  })
  .then( data => {
    window.location.reload()
  } )

})

$(document).ready(function(){
    var cambio = false;
    $('.nav li a').each(function(index) {
        if(this.href.trim() == window.location){
            $(this).parent().addClass("active");
            cambio = true;
        } else {
            $(this).parent().removeClass("active");
        }
    });
    if(!cambio){
        $('.nav li:first').addClass("active");
    }
});




$('.name').on( 'keydown', function(event) {
    if(event.which == 13) {
      var taskname = $(this).val()
      var id = $(this).siblings('.done').attr('data-id')

      $.ajax({
        url: '/edited/' + id + '/' + taskname,
        method: 'PUT'
      })
      .then( data => {
        console.log(data);
        window.location.reload()
      })
    }    
});