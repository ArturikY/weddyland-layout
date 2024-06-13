let inputsValue = document.querySelectorAll('.calculator-table__item-input');
let budgetsValue = document.querySelectorAll('.calculator__budget-value');

inputsValue.forEach(function(inputValue) {
  inputValue.readOnly = true;
})
budgetsValue.forEach(function(budgetValue) {
  budgetValue.readOnly = true;
})