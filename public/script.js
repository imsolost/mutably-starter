console.log("Sanity Check: JS is working!")

$(document).ready( () => {

  getAllBooks()

  $('#new-book-form').on('submit', function(event) {
    event.preventDefault()
    const newData = $(this).serialize()
    console.log('newData', newData)
    $(this).trigger('reset')
    $.ajax({
      method: 'POST',
      url: 'http://mutably.herokuapp.com/books/',
      data: newData,
      success: getAllBooks
    })
  })

  $(document).on('click', '.delete-btn', function() {
    const id = $(this).data('id')
    $.ajax({
      method: 'DELETE',
      url: `http://mutably.herokuapp.com/books/${id}`,
      success: handleDelete
    })
  })

  $(document).on('click', '.edit-btn', function() {
    const id = $(this).data('id')

    $(`.title-${id}`).hide()
    $(`.input-${id}`).show()
    $(`.edit-${id}`).hide()
    $(`.save-${id}`).show()

  })

  $(document).on('click', '.save-btn', function() {
    const id = $(this).data('id')

    const updatedTitle = $(`.input-${id} input`).val()
    $.ajax({
      method: 'PUT',
      url: `http://mutably.herokuapp.com/books/${id}`,
      data: {title: updatedTitle},
      success: handleUpdate
    })
  })
})

const getAllBooks = () => {
  $('.list-group').html('')
  $.ajax({
    method: 'GET',
    url: 'http://mutably.herokuapp.com/books',
    success: displayBooks
  })
}

const handleDelete = (data) => {
  const id = data._id
  const $row = $(`.item-${id}`)
  $row.remove()
}

const handleUpdate = (data) => {
  const id = data._id;

  $(`.title-${id}`).html(`&nbsp;${data.title}`)

  $(`.title-${id}`).show()
  $(`.input-${id}`).hide()
  $(`.edit-${id}`).show()
  $(`.save-${id}`).hide()
}

const displayBooks = (data) => {
  for (let i=0; i<data.books.length; i++) {
    $('.list-group').append(
      `<li class="list-group-item item-${data.books[i]._id}">
        <button class="btn btn-primary edit-btn edit-${data.books[i]._id}" data-id="${data.books[i]._id}">Edit</button>
        <button class="btn btn-success save-btn save-${data.books[i]._id}" data-id="${data.books[i]._id}">Save</button>
        <span class="title-${data.books[i]._id}">&nbsp;${data.books[i].title}</span>
        <span class="form-inline edit-form input-${data.books[i]._id}">&nbsp;<input class="form-control" value="${data.books[i].title}"/></span>
        <button class="btn btn-danger delete-btn pull-right" data-id="${data.books[i]._id}">Delete</button>
      </li>`)
  }
}
