const timing = document.querySelector('.timing');
timing.classList.add('void');
let timingEventForm = timing.querySelector('.timing-event__form');
timingEventForm.addEventListener('submit', function(e) {
  timing.classList.remove('add-item');
  e.preventDefault()
})

timing.addEventListener('click', function(e) {

  let timingAddItem = e.target.closest('.add-item');
  let timingEditItem = e.target.closest('.edit-item');
  let timingDeleteItem = e.target.closest('.delete-item');


  if (timingAddItem || timingEditItem) {
    timing.classList.add('add-item');
    timing.classList.remove('void');
  } else if (timingDeleteItem) {
    timing.classList.add('delete-item');
  }
  e.preventDefault()
})
