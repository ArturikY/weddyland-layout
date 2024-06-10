'use strict'
/*
Не испытано
*/

/*---Drop list---*/

const dropList = document.querySelector('.drop-list')
const dropListInputs = document.querySelectorAll('.drop-list__input');
const dropListChoice = document.querySelector('.drop-list__choice');
const dropListWrap = document.querySelector('.drop-list__wrap');
if (dropListWrap != null) {
    dropListWrap.addEventListener('click', function(event) {
        dropList.classList.toggle('wrap')
    })
}
if (dropListInputs.length > 0) {
    dropListInputs.forEach(function (dropListInput) {
        dropListInput.addEventListener('change', function (event) {
            console.log(dropListChoice.textContent)
            dropListChoice.textContent = dropListInput.nextElementSibling.textContent;
            dropList.classList.remove('wrap')
        })
    })
}

/*!---Drop list---!*/