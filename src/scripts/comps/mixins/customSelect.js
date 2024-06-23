function handlerSelectField(e) {
  let selectField = e.target.closest('.select-field');
  let selectFieldInput = selectField.querySelector('.select-field__input')
  let selectFieldWrapper = e.target.closest('.select-field__wrapper');
  let selectFieldOption = e.target.closest('.select-field__option')
  console.log
  if (selectFieldOption) {
    selectFieldInput.value = selectFieldOption.textContent.trim();
    console.log(selectFieldOption.textContent)
    selectField.querySelectorAll('.select-field__option').forEach((el) => {if (el.textContent === selectFieldOption.textContent) {el.classList.add('choosed')} else {el.classList.remove('choosed')}})
  }
  if (selectFieldWrapper) {
    if (selectField.classList.contains('selection')) {
      selectField.classList.remove('selection')
    } else {
      selectField.classList.add('selection')
    }
  }
}

document.querySelectorAll('.select-field').forEach(function(selectField) {
  selectField.addEventListener('click', handlerSelectField)
  selectField.querySelector('input').readOnly = true;
  selectField.querySelector('input').value = '';
})