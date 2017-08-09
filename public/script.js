console.log("Sanity Check: JS is working!");

$(document).ready( () => {

  // get all the data on load of the page
  getAllBooks();

  $('#new-book-form').on('submit', function(event) {
    event.preventDefault()
    const newBookData = $(this).serialize();
    console.log('newBookData',newBookData);
    $(this).trigger("reset");
    $.ajax({
      method: 'POST',
      url: 'http://mutably.herokuapp.com/books/',
      data: newBookData,
      success: getAllBooks()
    })
  })

  // becasue the delete-btn is added dynamically, the click handler needs to be written like such, bound to the document
  $(document).on('click', '.delete-btn', function() {
    const id = $(this).data('id')
    $.ajax({
      method: 'DELETE',
      url: 'http://mutably.herokuapp.com/books/'+id,
      success: handleBookDeleteResponse
    })
  })

  $(document).on('click', '.edit-btn', function() {
    const id = $(this).data('id')

    // hide the static title, show the input field
    $('.title-'+id).hide()
    $('.input-'+id).show()

    // hide the edit button, show the save button
    $('.edit-'+id).hide()
    $('.save-'+id).show()

  })

  $(document).on('click', '.save-btn', function() {
    const id = $(this).data('id')

    // grab the user's inputted data
    const updatedTitle = $('.input-'+id+' input').val()
    $.ajax({
      method: 'PUT',
      url: 'http://mutably.herokuapp.com/books/'+id,
      data: {title: updatedTitle},
      success: handleBookUpdateResponse
    })
  })
});

function getAllBooks() {
  $('.list-group').html('')
  $.ajax({
    method: 'GET',
    url: 'http://mutably.herokuapp.com/books'
  }).done(function(data) {
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
  const bookId = data._id;
  const $row = $('.item-' + bookId);
  // remove that book row
  $row.remove();
}

function handleBookUpdateResponse(data) {
  const id = data._id;

  // replace the old title with the new title
  $('.title-'+id).html('&nbsp;'+data.title)

  $('.title-'+id).show()
  $('.input-'+id).hide()
  $('.edit-'+id).show()
  $('.save-'+id).hide()
}
