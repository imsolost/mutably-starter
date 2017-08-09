console.log("Sanity Check: JS is working!");

$(document).ready(function(){

  getAllBooks()

  $(document).on('click', '.delete-btn', () => {
    let id = $(this).data('id')
    $.ajax({
      method: 'DELETE',
      url: 'http://mutably.herokuapp.com/books/'+id,
      success: handleBookDeleteResponse
    })
  })

});

function getAllBooks() {
  $('.list-group').html('')
  $.ajax({
    method: 'GET',
    url: 'http://mutably.herokuapp.com/books'
  }).done( (data) => {
    // console.log(data);
    for (let i=0; i<data.books.length; i++) {
      $('.list-group').append('<li class="list-group-item item-'+data.books[i]._id+'">'
      +'<button class="btn btn-primary edit-btn edit-'+data.books[i]._id+'" data-id="'+data.books[i]._id+'">Edit</button>'
      +'<button class="btn btn-success save-btn save-'+data.books[i]._id+'" data-id="'+data.books[i]._id+'">Save</button>'
      +'<span class="title-'+data.books[i]._id+'">&nbsp;'+data.books[i].title+'</span>'
      +'<span class="form-inline edit-form input-'+data.books[i]._id+'">&nbsp;<input class="form-control" value="'+data.books[i].title+'"/></span>'
      +'<button class="btn btn-danger delete-btn pull-right" data-id="'+data.books[i]._id+'">Delete</button>'
      +'</li>')
    }
  })
}

function handleBookDeleteResponse(data) {
  console.log('handleBookDeleteResponse got ', data);
  var bookId = data._id;
  var $row = $('.item-' + bookId);
  // remove that book row
  $row.remove();
}
