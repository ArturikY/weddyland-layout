const timing = document.querySelector('.timing');

const deletePopup = document.querySelector('.timing-delete');
const deletePopupClose = deletePopup.querySelector('.timing-delete__close');

deletePopupClose.addEventListener('click', function(e) {
  timing.classList.remove('delete-item')
})

const addPopup = document.querySelector('.timing-event');
const addPopupClose = addPopup.querySelector('.timing-event__close');

addPopupClose.addEventListener('click', function(e) {
  console.log(1)
  timing.classList.remove('add-item')
})

