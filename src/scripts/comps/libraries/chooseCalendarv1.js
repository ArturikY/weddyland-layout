"use strict";



function Calendar(htmlClass) {
  class CalendarError extends Error { // Класс для ошибок(при инициализации и для отладки)
    constructor(type, message) {
      super(message);
      this.type = type;
      this.typeDecoding = this.type === 1 ? "Некооректный html код" : this.type === 2 ? "Некорректное значние аргмуента" : "Неизвестная ошибка";
    }
  }

  function initCalendar(htmlClass) { //Установка свойств объекта
    try {
      if (htmlClass == undefined) {
        throw new CalendarError(1, "Вы не передали корректный html класс");
      };
      calendar.htmlClass = htmlClass;
      calendar.elementCalendar = document.querySelector(`.${calendar.htmlClass}`);
      if (!calendar.elementCalendar) {
        throw new CalendarError(1, "Html блока с таким классом не существует");
      }

      setHtmlElements: {
        calendar.elements = {}; //Здесь будут хранится все нужные html-узлы
        /*Достаём все html элементы календаря. Обратите внимания что я вытаскиваю элементы сразу из обох мини календарей, тобишь в данных переменных содержатся коллекции. У каждой переменной дописаны s на конце. */
        // Элементы быстрого поиска
        calendar.elements.dates = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__date`);
        calendar.elements.fastSearchs = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__fast-search`);
        calendar.elements.fastSearchTexts = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__text`);
        calendar.elements.fastSearchBriefEntries = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__brief-entry`);
        calendar.elements.mainBlockElements = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__fast-search ~ *, .${calendar.htmlClass}__buttons`)
        //Иконки календаря(открытие основого блока) и крестика(сброс данных поля)
        calendar.elements.fastSearchCalendars = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__icon`);
        calendar.elements.fastSearchCloses = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__close`);
        //Элементы быстрого поля ввода даты
        calendar.elements.fastSearchInputFields = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__input-field`);
        calendar.elements.inputFieldDays = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__field-day`);
        calendar.elements.inputFieldMonths = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__field-month`);
        calendar.elements.inputFieldYears = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__field-year`);
        //Элементы смены даты
        calendar.elements.changeYears = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-year`);
        calendar.elements.changeYearRightArrows = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-year > ion-icon:nth-child(2)`);
        calendar.elements.changeYearLeftArrows = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-year > ion-icon:nth-child(1)`);
        calendar.elements.chooseChangeYears = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-year-choose`);
        calendar.elements.chooseYears = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-year-choose-year`);
        calendar.elements.changeMonths = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-month`);
        calendar.elements.changeMonthRightArrows = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-month > ion-icon:nth-child(2)`);
        calendar.elements.changeMonthLeftArrows = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-month > ion-icon:nth-child(1)`);
        calendar.elements.chooseChangeMonths = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-month-choose`);
        calendar.elements.chooseMonths = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-month-choose-month`);
        calendar.elements.changeDays = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__change-day`);
        //Элементы мини-календаря
        calendar.elements.calendarAllDays = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__calendar-days`);
        calendar.elements.calendarOneDays = calendar.elementCalendar.querySelectorAll(`.${calendar.htmlClass}__calendar-day`);
      }
      setMainProperty: {
        //Здесь будут хранится основные данные о календаре
        calendar.data = {};
        calendar.data.startDate = null; //Дата начала
        calendar.data.endDate = new Date(); //Дата окончания
        calendar.data.changeDate = { // Промежуточные даты
          startDate: {
            "day": null,
            "month": null,
            "year": null,
            "object": null,
            createObject() {
              this.object = new Date(this.year, this.month, this.day);
              return this.object;
            },
          },
          endDate: {
            "day": null,
            "month": null,
            "year": null,
            "object": null,
            createObject() {
              this.object = new Date(this.year, this.month, this.day);
              return this.object;
            },
            fillNull() {
              if (this.day == null && this.month == null && this.year == null) {
                this.day = calendar.data.endDate.getDate();
                this.month = calendar.data.endDate.getMonth();
                this.year = calendar.data.endDate.getFullYear();
              }
            },
          }
        }
        calendar.data.allowedYear = { //Года которые можно выбрать(должен быть в промежутке между min и max(включительно))
          "min": 2000,
          "max": 2024,
        };

        // Здесь юудут хранится состояние элементов календаря
        calendar.condition = {};
        calendar.condition.isOpenMainBlock = false; //Развернуты ли основные блоки календаря
        calendar.condition.stage = { //На каком этапе сейчас находится пользовать(только одно значение может быть true): на выборе даты или он уже выбрал(она может быть неправильная и тогда будте ошибка или правильная тогда ничего нового не будет)
          "choose": true,
          "answer": false,
          "toggle": function() {
            if (this.choose === true) {
              this.choose = false;
              this.answer = true
            } else {
              this.choose = true;
              this.answer = false;
            }
          }
        }
        calendar.condition.isOpenChangeYear = {//Открыт ли блок с выбором года
          "start": false,
          "end" : false,
        }; 
        calendar.condition.isOpenChangeMonth = {//Открыт ли блок с выбором месяца
          "start": false,
          "end" : false,
        }; 
        calendar.condition.isVisibleReset = {//Виден ли крестик для сброса даты
          "start": false,
          "end": true,
        }

        //Установка методов
        Object.assign(calendar, {
          changeDataCalendar, // Изменение даты
          changeConditionCalendar, // Изменение состояния
          updateConditionHtmlElements, // Изменения html по новому состоянию
          updateDataHtmlElements, // Изменения html по новому data
        });
      }
      applyInitFunc: {
        //Вызов функций которые должны быть вызваны при инициализиции
        calendar.data.changeDate.endDate.fillNull();
        setListenerCalendar(calendar);
        calendar.updateDataHtmlElements(calendar);
        calendar.updateConditionHtmlElements(calendar);
      }
    } catch(err) {
      console.log(err.type, err.message)
      throw err
    }
  }
  
  function setListenerCalendar(calendar) { //Установка обработчиков событий на элементы календаря
    //Фукнции-обработчики событий
    function calendarIconHandler(event) {
      let updateObject = {
        "condition": {
          "isOpenMainBlock": "toggle"
        },
      };
      calendar.changeConditionCalendar(updateObject);
    }
    function closeIconHandler(event) {
      let updateObject = {data: {changeDate: {startDate: {}, endDate: {},}}};
      if (event.target.closest(`.${calendar.htmlClass}-sd`) != undefined) {
        updateObject.data.changeDate.startDate = {reset: true}
      } else {
        updateObject.data.changeDate.endDate = {reset: true}
      }
      changeDataCalendar(updateObject)
    }
    function changeYearClickHandler(event) {
      if (event.clickArrow) {
        return 
      }
      
      let updateObject = {"condition": {"isOpenChangeYear": {}}};
      updateObject.condition.isOpenChangeYear[event.target.closest(`.${calendar.htmlClass}-sd`) != null ? "start" : "end"] = "toggle";
      calendar.changeConditionCalendar(updateObject)
    }
    function changeYearChooseHandler(event) {
      let updateObject = {data: {changeDate: {startDate: {}, endDate: {},}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end" 
      if (typeDate === "start") {
        updateObject.data.changeDate.startDate.year = Number(event.target.closest(`.${calendar.htmlClass}__change-year-choose-year`).textContent)
      } else {
        updateObject.data.changeDate.endDate.year = Number(event.target.closest(`.${calendar.htmlClass}__change-year-choose-year`).textContent)
      }

      calendar.changeDataCalendar(updateObject)
    }
    function changeMonthClickHandler(event) {
      if (event.clickArrow) {
        return 
      }

      let updateObject = {"condition": {"isOpenChangeMonth": {}}};
      updateObject.condition.isOpenChangeMonth[event.target.closest(`.${calendar.htmlClass}-sd`) != null ? "start" : "end"] = "toggle";
      calendar.changeConditionCalendar(updateObject)
    }
    function changeMonthChooseHandler(event) {
      let updateObject = {data: {changeDate: {startDate: {}, endDate: {},}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end" 
      if (typeDate === "start") {
        updateObject.data.changeDate.startDate.month = Array.from(document.querySelectorAll(`.${calendar.htmlClass}__change-month-choose-wrapper.${calendar.htmlClass}-sd > *`)).indexOf(event.target);
      } else {
        updateObject.data.changeDate.endDate.month = Array.from(document.querySelectorAll(`.${calendar.htmlClass}__change-month-choose-wrapper.${calendar.htmlClass}-ed > *`)).indexOf(event.target);
      }
      calendar.changeDataCalendar(updateObject)
    }
    function changeDayClickHandler(event) {
      let updateObject = {data: {changeDate: {startDate: {}, endDate: {},}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end";
      if (typeDate === "start") {
        updateObject.data.changeDate.startDate.day = Number(event.target.closest(`.${calendar.htmlClass}__calendar-day`).textContent);
      } else {
        updateObject.data.changeDate.endDate.day = Number(event.target.closest(`.${calendar.htmlClass}__calendar-day`).textContent);
      }
      calendar.changeDataCalendar(updateObject)
    }
    //arrowHandlers (обработчики стрелок в блоке выбора года/месяца)
    function changeYearArrowRightHandler(event) {
      event.clickArrow = true;
      let updateObject = {data: {changeDate: {startDate: {}, endDate: {}}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end" 
      if (typeDate === "start") {
        if (calendar.data.changeDate.startDate.year == null) {
          return
        }
        updateObject.data.changeDate.startDate.year = calendar.data.changeDate.startDate.year + 1 <= calendar.data.allowedYear.max ? calendar.data.changeDate.startDate.year + 1 : undefined;
      } else {
        if (calendar.data.changeDate.endDate.year == null) {
          return
        }
        updateObject.data.changeDate.endDate.year = calendar.data.changeDate.endDate.year + 1 <= calendar.data.allowedYear.max ? calendar.data.changeDate.endDate.year + 1 : undefined;
      }
      calendar.changeDataCalendar(updateObject)
    }
    function changeYearArrowLeftHandler(event) {
      event.clickArrow = true;
      
      let updateObject = {data: {changeDate: {startDate: {}, endDate: {}}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end" 
      if (typeDate === "start") {
        if (calendar.data.changeDate.startDate.year == null) {
          return
        }
        updateObject.data.changeDate.startDate.year = calendar.data.changeDate.startDate.year - 1 >= calendar.data.allowedYear.min ? calendar.data.changeDate.startDate.year - 1 : undefined;
      } else {
        if (calendar.data.changeDate.endDate.year == null) {
          return
        }
        updateObject.data.changeDate.endDate.year = calendar.data.changeDate.endDate.year - 1 >= calendar.data.allowedYear.min ? calendar.data.changeDate.endDate.year - 1 : undefined;
      }
      calendar.changeDataCalendar(updateObject)
    }
    function changeMonthArrowRightHandler(event) {
      event.clickArrow = true;

      let updateObject = {data: {changeDate: {startDate: {}, endDate: {}}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end" 
      if (typeDate === "start") {
        if (calendar.data.changeDate.startDate.month == null) {
          return
        }
        updateObject.data.changeDate.startDate.month = calendar.data.changeDate.startDate.month + 1 <= 11 ? calendar.data.changeDate.startDate.month + 1 : undefined;
      } else {
        if (calendar.data.changeDate.endDate.month == null) {
          return
        }
        updateObject.data.changeDate.endDate.month = calendar.data.changeDate.endDate.month + 1 <= 11 ? calendar.data.changeDate.endDate.month + 1 : undefined;
      }
      calendar.changeDataCalendar(updateObject)
    }
    function changeMonthArrowLeftHandler(event) {
      event.clickArrow = true;

      let updateObject = {data: {changeDate: {startDate: {}, endDate: {}}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end" ;
      if (typeDate === "start") {
        if (calendar.data.changeDate.startDate.month == null) {
          return
        }
        updateObject.data.changeDate.startDate.month = calendar.data.changeDate.startDate.month - 1 >= 0 ? calendar.data.changeDate.startDate.month - 1 : undefined;
      } else {
        if (calendar.data.changeDate.endDate.month == null) {
          return
        }
        updateObject.data.changeDate.endDate.month = calendar.data.changeDate.endDate.month - 1 >= 0 ? calendar.data.changeDate.endDate.month - 1 : undefined;
      }
      calendar.changeDataCalendar(updateObject)
    }
    //Обработчики изменения значений в быстром вводе даты
    function changeInputFieldHandler(event) {
      let updateObject = {data: {inputChangeDate: {startDate: {}, endDate: {}}}};
      let typeDate = event.target.closest(`.${calendar.htmlClass}-sd`) ? "start" : "end";
      calendar.elements.fastSearchInputFields.forEach(function(inputField) {
        if (!(inputField.classList.contains(`${typeDate == "start" ? `${calendar.htmlClass}-sd` : `${calendar.htmlClass}-ed`}`))) {
          return
        }
        if (typeDate == "start") {
          updateObject.data.inputChangeDate.startDate = {
            "day": Number(inputField.querySelector("input:nth-child(1)").value),
            "month": Number(inputField.querySelector("input:nth-child(2)").value) - 1,
            "year": Number(inputField.querySelector("input:nth-child(3)").value),
          }
        } else {
          updateObject.data.inputChangeDate.endDate = {
            "day": Number(inputField.querySelector("input:nth-child(1)").value),
            "month": Number(inputField.querySelector("input:nth-child(2)").value) - 1,
            "year": Number(inputField.querySelector("input:nth-child(3)").value),
          }
        }
        calendar.changeDataCalendar(updateObject)
      })
    }
    function blurInputFieldHandler(event) {
      updateDataHtmlElements(calendar)
    }
    //Фукнция установщик обработчиков
    function setCalendarHandler() {
      //Иконка календаря открывающая основной блок календаря
      calendar.elements.fastSearchCalendars.forEach(function(fastSearchCalendar) {
        fastSearchCalendar.addEventListener("click", calendarIconHandler);
      });
      //Иконка кретика сбрасывающая данные в своем мини календаре
      calendar.elements.fastSearchCloses.forEach(function(fastSearchClose) {
        fastSearchClose.addEventListener("click", closeIconHandler);
      });
      //Поле смены года открывающее блок с годами которые можно выбрать
      calendar.elements.changeYears.forEach(function(changeYear) {
        changeYear.addEventListener("click", changeYearClickHandler);
      });
      //Клик на один из годов в меню октрывшемся в результате клика на текущий год 
      calendar.elements.chooseYears.forEach(function(chooseYear) {
        chooseYear.addEventListener("click", changeYearChooseHandler);
      });
      //Поле смены месяца открывающее блок с месяцами которые можно выбрать
      calendar.elements.changeMonths.forEach(function(changeMonth) {
        changeMonth.addEventListener("click", changeMonthClickHandler);
      });
      //Клик на один из месяцов в меню октрывшемся в результате клика на текущий месяц 
      calendar.elements.chooseMonths.forEach(function(chooseMonth) {
        chooseMonth.addEventListener("click", changeMonthChooseHandler);
      });
      setArrowHandler: {
        calendar.elements.changeMonthRightArrows.forEach(function(rightArrow) {
          rightArrow.addEventListener("click", changeMonthArrowRightHandler);
        })
        calendar.elements.changeMonthLeftArrows.forEach(function(leftArrow) {
          leftArrow.addEventListener("click", changeMonthArrowLeftHandler);
        })
        calendar.elements.changeYearRightArrows.forEach(function(rightArrow) {
          rightArrow.addEventListener("click", changeYearArrowRightHandler);
        })
        calendar.elements.changeYearLeftArrows.forEach(function(leftArrow) {
          leftArrow.addEventListener("click", changeYearArrowLeftHandler);
        })

      };
      calendar.elements.fastSearchInputFields.forEach(function(inputField) {
        inputField.querySelectorAll("*").forEach(function(inputFieldElem) {
          inputFieldElem.addEventListener("input", changeInputFieldHandler)
          inputFieldElem.addEventListener("blur", blurInputFieldHandler)
        }) 
      });
      
      //Клик на один из дней в мини календаре устанавливается при создании ячеек календаря
      console.log("Обработчики событий установлены успешно!!!")
    }
    function setObjectMethod() {
      Object.assign(calendar, {changeYearChooseHandler, changeDayClickHandler})
    }
    setObjectMethod()
    setCalendarHandler()
  }

  //Изменение даты
  let changeDataCalendar = function(updateObject) {
    //Обработчик изменения даты начального или конечного дня
    function updateChangeDate() {//Изменяет данные в changeDate(промежуточный день)
      if (dataObject.changeDate.startDate != null) {
        if (dataObject.changeDate.startDate.reset === true) {
          calendar.data.changeDate.startDate.day = null;
          calendar.data.changeDate.startDate.month = null;
          calendar.data.changeDate.startDate.year = null;
        } else {
          calendar.data.changeDate.startDate.day = dataObject.changeDate.startDate.day ?? calendar.data.changeDate.startDate.day;
          calendar.data.changeDate.startDate.month = dataObject.changeDate.startDate.month ?? calendar.data.changeDate.startDate.month;
          calendar.data.changeDate.startDate.year = dataObject.changeDate.startDate.year ?? calendar.data.changeDate.startDate.year;
          if (calendar.data.changeDate.startDate.day > (32 - new Date(calendar.data.changeDate.startDate.year, calendar.data.changeDate.startDate.month, 32).getDate())) {
            calendar.data.changeDate.startDate.day = 32 - new Date(calendar.data.changeDate.endDate.year, calendar.data.changeDate.startDate.month, 32).getDate()
          }
        }
      } 
      if (dataObject.changeDate.endDate != null) {
        if (dataObject.changeDate.endDate.reset === true) {
          calendar.data.changeDate.endDate.day = new Date().getDate();
          calendar.data.changeDate.endDate.month = new Date().getMonth();
          calendar.data.changeDate.endDate.year = new Date().getFullYear();
        } else {
          calendar.data.changeDate.endDate.day = dataObject.changeDate.endDate.day ?? calendar.data.changeDate.endDate.day;
          calendar.data.changeDate.endDate.month = dataObject.changeDate.endDate.month ?? calendar.data.changeDate.endDate.month;
          calendar.data.changeDate.endDate.year = dataObject.changeDate.endDate.year ?? calendar.data.changeDate.endDate.year;
          if (calendar.data.changeDate.endDate.day > (32 - new Date(calendar.data.changeDate.endDate.year, calendar.data.changeDate.endDate.month, 32).getDate())) {
            calendar.data.changeDate.endDate.day = 32 - new Date(calendar.data.changeDate.endDate.year, calendar.data.changeDate.endDate.month, 32).getDate()
          }
        }
      }
    }
    function updateInputChangeDate() {//Изменяет данные в inputChangeDate(промежуточный день из поля ввода)
      // какая то хуйня
      // написать чтобы изменялось значение changeDate динамично при вводе новых данных в inputField, чтобы при расфокусировке с поля и изначально(при открытии главного блока(только если дата ещё не введено value у поля бе значение должно быть пустым так как есть placeholder)) значение в inputField менялось на нынешнее
      // if (dataObject.inputChangeDate.endDate != null && typeof dataObject.inputChangeDate.endDate == "object") {
      //   console.log(10)
      //   if (!(dataObject.inputChangeDate.endDate.year == null || dataObject.inputChangeDate.endDate.month == null || dataObject.inputChangeDate.endDate.day == null)) {
      //     console.log(11)
      //     function checkValidDate() {
      //       if (!(dataObject.inputChangeDate.endDate.year < calendar.data.allowedYear.min && dataObject.inputChangeDate.endDate.year > calendar.data.allowedYear.max)) {
      //         return false
      //       }
      //       if (!(dataObject.inputChangeDate.endDate.month <= 11 && dataObject.inputChangeDate.endDate.month >= 0)) {
      //         return false
      //       }
      //       if (!(dataObject.inputChangeDate.endDate.day > 0 && dataObject.inputChangeDate.endDate.day < (32 - new Date(dataObject.inputChangeDate.endDate.year, dataObject.inputChangeDate.endDate.month, dataObject.inputChangeDate.endDate.day)).getDate())) {
      //         return false
      //       }
      //       return true
      //     }
          

      //     if (checkValidDate()) {
      //       console.log(12)
      //       dataObject.changeDate ??= {};
      //       dataObject.changeDate.endDate = dataObject.inputChangeDate.endDate;
      //       updateChangeDate();
      //     }
      //   }
      // } 
      if (dataObject.inputChangeDate.endDate != null && typeof dataObject.inputChangeDate.endDate == "object") {
        if (!(dataObject.inputChangeDate.endDate.year == null || dataObject.inputChangeDate.endDate.month == null || dataObject.inputChangeDate.endDate.day == null)) {
          function checkValidDate() {
            if (!(dataObject.inputChangeDate.endDate.year > calendar.data.allowedYear.min && dataObject.inputChangeDate.endDate.year < calendar.data.allowedYear.max + 1)) {
              return false
            }
            if (!(dataObject.inputChangeDate.endDate.month <= 11 && dataObject.inputChangeDate.endDate.month >= 0)) {
              return false
            }
            if (!(dataObject.inputChangeDate.endDate.day > 0 && dataObject.inputChangeDate.endDate.day < (32 - new Date(dataObject.inputChangeDate.endDate.year, dataObject.inputChangeDate.endDate.month, dataObject.inputChangeDate.endDate.day).getDate()))) {
              return false
            }
            return true
          }
          

          if (checkValidDate()) {
            dataObject.changeDate ??= {};
            dataObject.changeDate.endDate = dataObject.inputChangeDate.endDate;
            updateChangeDate();
          }
        }
      } 
    }
    //Проверка корректности переданного updateObject
    if (!("data" in updateObject)) {
      throw Error(2, "Вы передали в метод смены данных объект не содержащий свойство data");
    } else if (updateObject.data != null && typeof updateObject.data !== "object") {
      throw Error(2, "Вы передали в метод смены данных объект со свойством data не являющегося объектом");
    }

    let dataObject = updateObject.data; //Object
    if ("changeDate" in dataObject) {
      updateChangeDate()
    }
    if ("inputChangeDate" in dataObject) {
      updateInputChangeDate()
    }

    //Обновляем даты в html по новым данным
    updateDataHtmlElements(calendar)

    //После изменения даты надо вызвать изменение состояния(чтобы автоматически обновились состояния по новым датам)
    changeConditionCalendar({condition: {}})
  }
  let updateDataHtmlElements = function(calendar) {
    //Обновление Html по обновленным данным в data
    //Обновления в поле выбора месяца/года обновления показа текущего месяца/года 
    calendar.elements.changeMonths.forEach(function(changeMonth) {
      if (changeMonth.classList.contains(`${calendar.htmlClass}-sd`)) {
        if (calendar.data.changeDate.startDate.month == null) {
          return
        }
        changeMonth.firstElementChild.nextSibling.replaceWith(document.createTextNode(`${new Date(0, calendar.data.changeDate.startDate.month).toLocaleString("ru", {month: "long"})}`));
      } else if (changeMonth.classList.contains(`${calendar.htmlClass}-ed`)) {
        if (calendar.data.changeDate.endDate.month == null) {
          return
        }
        changeMonth.firstElementChild.nextSibling.replaceWith(document.createTextNode(`${new Date(0, calendar.data.changeDate.endDate.month).toLocaleString("ru", {month: "long"})}`));
      }
    })
    calendar.elements.changeYears.forEach(function(changeYear) {
      if (changeYear.classList.contains(`${calendar.htmlClass}-sd`)) {
        if (calendar.data.changeDate.startDate.year == null) {
          return
        }
        changeYear.firstElementChild.nextSibling.replaceWith(document.createTextNode(`${calendar.data.changeDate.startDate.year}`));
      } else if (changeYear.classList.contains(`${calendar.htmlClass}-ed`)) {
        if (calendar.data.changeDate.endDate.year == null) {
          return
        }
        changeYear.firstElementChild.nextSibling.replaceWith(document.createTextNode(`${calendar.data.changeDate.endDate.year}`));
      }
    })
    //Заполнения блока выбора лет разрешёнными годами
    calendar.elements.changeYears.forEach(function(changeYear) {
      changeYear.querySelector(`.${calendar.htmlClass}__change-year-choose-wrapper`).innerHTML = ''
      let typeDate = changeYear.classList.contains(`${calendar.htmlClass}-sd`) ? `${calendar.htmlClass}-sd` : `${calendar.htmlClass}-ed`;
      let copyHtmlBlock = document.createElement("div");
      copyHtmlBlock.classList.add(`${calendar.htmlClass}__change-year-choose-year`, typeDate);
      for (let currentYear = Number(calendar.data.allowedYear.min); currentYear <= Number(calendar.data.allowedYear.max); currentYear++) {
        let currentHtmlBlock = copyHtmlBlock.cloneNode(true);
        currentHtmlBlock.textContent = `${currentYear}`;
        changeYear.querySelector(`.${calendar.htmlClass}__change-year-choose-wrapper`).append(currentHtmlBlock);
        currentHtmlBlock.addEventListener("click", calendar.changeYearChooseHandler);
      }
    })
    //Заполенение блока выбора дня 
    calendar.elements.calendarAllDays.forEach(function(allDay) {
      allDay.innerHTML = ""; // очищаем блок если там есть какое либо содержимое

      let typeDate = allDay.classList.contains(`${calendar.htmlClass}-sd`) ? `${calendar.htmlClass}-sd` : `${calendar.htmlClass}-ed`;
      
      if ((typeDate === `${calendar.htmlClass}-sd` && (calendar.data.changeDate.startDate.year == null || calendar.data.changeDate.startDate.month == null)) || (typeDate === `${calendar.htmlClass}-ed` && (calendar.data.changeDate.endDate.year == null || calendar.data.changeDate.endDate.month == null))) {
        return 
      }

      let countDays; // колво дней в месяце
      let firstDayMonth; // каким днём неедли будет перое число месяца
      if (typeDate === `${calendar.htmlClass}-sd`) {
        countDays = 32 - new Date(calendar.data.changeDate.startDate.year, calendar.data.changeDate.startDate.month, 32).getDate();
        firstDayMonth = new Date(calendar.data.changeDate.startDate.year, calendar.data.changeDate.startDate.month, 1).getDay();
        firstDayMonth = firstDayMonth - 1 === -1 ? 6 : firstDayMonth - 1; // преобразование в систему где понедельник первый день недели
      } else {
        countDays = 32 - new Date(calendar.data.changeDate.endDate.year, calendar.data.changeDate.endDate.month, 32).getDate();
        firstDayMonth = new Date(calendar.data.changeDate.endDate.year, calendar.data.changeDate.endDate.month, 1).getDay();
        firstDayMonth = firstDayMonth - 1 === -1 ? 6 : firstDayMonth - 1; // преобразование в систему где понедельник первый день недели
      }
      let copyHtmlBlock = document.createElement("span");
      copyHtmlBlock.classList.add(`${calendar.htmlClass}__calendar-day`);
      copyHtmlBlock.classList.add(`${calendar.htmlClass}-${typeDate === `${calendar.htmlClass}-sd` ? "sd" : "ed"}`);
      for (let currentDay = 0; currentDay < 42; currentDay++) {
        let currentHtmlBlock = copyHtmlBlock.cloneNode(true);
        if (currentDay + 1 === firstDayMonth && currentDay < 6) {
          currentHtmlBlock.classList.add("last-zero-before")
        } else if (currentDay < firstDayMonth && currentDay < 6) {
          currentHtmlBlock.classList.add("zero-before")
        } else if (currentDay - firstDayMonth >= countDays) {
          currentHtmlBlock.classList.add("zero-after")
        } else {
          //Установака обработчика
          currentHtmlBlock.addEventListener("click", calendar.changeDayClickHandler)
          
          currentHtmlBlock.textContent = `${currentDay - firstDayMonth + 1}`
          if ((currentDay - firstDayMonth + 1 === (typeDate === `${calendar.htmlClass}-sd` ? calendar.data.changeDate.startDate.day : calendar.data.changeDate.endDate.day))) {
            currentHtmlBlock.classList.add("point")
          } else if(calendar.data.changeDate.endDate.year != null && calendar.data.changeDate.endDate.month != null && calendar.data.changeDate.endDate.day != null && calendar.data.changeDate.startDate.year != null && calendar.data.changeDate.startDate.month != null && calendar.data.changeDate.startDate.day) {
            if (calendar.data.changeDate.startDate.year < calendar.data.changeDate.endDate.year) {
              if ((currentDay - firstDayMonth + 1 < calendar.data.changeDate.endDate.day && typeDate === `${calendar.htmlClass}-ed`) || ((currentDay - firstDayMonth + 1 > calendar.data.changeDate.startDate.day && typeDate === `${calendar.htmlClass}-sd`))) {
                currentHtmlBlock.classList.add("inrange")
              }
            } else if (calendar.data.changeDate.startDate.year === calendar.data.changeDate.endDate.year) {
              if (calendar.data.changeDate.startDate.month < calendar.data.changeDate.endDate.month) {
                if ((currentDay - firstDayMonth + 1 < calendar.data.changeDate.endDate.day && typeDate === `${calendar.htmlClass}-ed`) || ((currentDay - firstDayMonth + 1 > calendar.data.changeDate.startDate.day && typeDate === `${calendar.htmlClass}-sd`))) {
                  currentHtmlBlock.classList.add("inrange")
                }
              } else if (calendar.data.changeDate.startDate.month === calendar.data.changeDate.endDate.month) {
                if (currentDay - firstDayMonth + 1 > calendar.data.changeDate.startDate.day && currentDay - firstDayMonth + 1 < calendar.data.changeDate.endDate.day) {
                  currentHtmlBlock.classList.add("inrange")
                }
              }
            }
          }
        }
        allDay.append(currentHtmlBlock)
      }
    })
    //Обновление содержимого в briefEntry
    calendar.elements.fastSearchBriefEntries.forEach(function(briefEntry) {
      let typeDate = briefEntry.classList.contains(`${calendar.htmlClass}-sd`) ? `${calendar.htmlClass}-sd` : `${calendar.htmlClass}-ed`;
      if (typeDate === `${calendar.htmlClass}-sd`) {
        if (calendar.data.changeDate.startDate.year != null && calendar.data.changeDate.startDate.month != null && calendar.data.changeDate.startDate.day != null) {
          briefEntry.textContent = calendar.data.changeDate.startDate.createObject().toLocaleString("ru", {year: 'numeric', month: 'long', day: 'numeric'}).slice(0, -2);
        } else {
          briefEntry.textContent = "ДД.ММ.ГГГГ"
        }
      } else {
        if (calendar.data.changeDate.endDate.year != null && calendar.data.changeDate.endDate.month != null && calendar.data.changeDate.endDate.day != null) {

          briefEntry.textContent = calendar.data.changeDate.endDate.createObject().toLocaleString("ru", {year: 'numeric', month: 'long', day: 'numeric'}).slice(0, -2);
        } else {
          briefEntry.textContent = "ДД.ММ.ГГГГ"
        }
      }
    })
    //Обновление содержимого в inputField
    calendar.elements.fastSearchInputFields.forEach(function(inputField) {
      let typeDate = inputField.classList.contains(`${calendar.htmlClass}-sd`) ? `${calendar.htmlClass}-sd` : `${calendar.htmlClass}-ed`;
      if (typeDate === `${calendar.htmlClass}-sd`) {
        if (inputField.querySelectorAll("input:focus").length != 0) {
          return
        }
        inputField.querySelector("*:nth-child(1)").value = calendar.data.changeDate.startDate.day == null ? "ДД" : String(calendar.data.changeDate.startDate.day).length === 1 ? "0" + String(calendar.data.changeDate.startDate.day) : String(calendar.data.changeDate.startDate.day);
        inputField.querySelector("*:nth-child(2)").value = calendar.data.changeDate.startDate.month == null ? "ММ" : String(calendar.data.changeDate.startDate.month).length === 1 ? "0" + String(calendar.data.changeDate.startDate.month) : String(calendar.data.changeDate.startDate.month);
        inputField.querySelector("*:nth-child(3)").value = calendar.data.changeDate.startDate.year == null ? "ГГГГ" : "0".repeat(4 - String(calendar.data.changeDate.startDate.year).length) + String(calendar.data.changeDate.startDate.year);
      } else {
        if (inputField.querySelectorAll("input:focus").length != 0) {
          return
        }
        inputField.querySelector("*:nth-child(1)").value = calendar.data.changeDate.endDate.day == null ? "ДД" : String(calendar.data.changeDate.endDate.day).length === 1 ? "0" + String(calendar.data.changeDate.endDate.day) : String(calendar.data.changeDate.endDate.day);
        inputField.querySelector("*:nth-child(2)").value = calendar.data.changeDate.endDate.month == null ? "ММ" : String(calendar.data.changeDate.endDate.month).length === 1 ? "0" + String(calendar.data.changeDate.endDate.month) : String(calendar.data.changeDate.endDate.month);
        inputField.querySelector("*:nth-child(3)").value = calendar.data.changeDate.endDate.year == null ? "ГГГГ" : "0".repeat(4 - String(calendar.data.changeDate.endDate.year).length) + String(calendar.data.changeDate.endDate.year);
      }
    })    
  }

  //Изменение состояния
  let changeConditionCalendar = function(updateObject) {
    //Обработчки смены состояний календаря(принимает объект который обязательно должен содержать свойсто condition являющееся объектом со свойствами которые надо заменить в объекте календаря), а также обнволяет свойства зависящие от других
    function isOpenMainBlockUpdate() {//Изменение видимости основного блока
      if (conditionObject.isOpenMainBlock === "toggle") {
        calendar.condition.isOpenMainBlock = calendar.condition.isOpenMainBlock === true ? false : true;
      } else if (conditionObject.isOpenMainBlock === true) {
        calendar.condition.isOpenMainBlock = true;
      } else if (conditionObject.isOpenMainBlock === false) {
        calendar.condition.isOpenMainBlock = false;
      } else {
        throw Error(2, "updateObject.isOpenMainBlock дожен принимать значения true или false или toggle")
      }
    }
    function isOpenChangeYearUpdate() {//Изменение состояния видимости блока года
      if (conditionObject.isOpenChangeYear.start === "true" && conditionObject.isOpenChangeYear.end === "true") {
        throw new CalendarError(2, "updateObject.condition.isOpenChangeYear может иметь только одно свойство со значением true");
      }
      if ("start" in conditionObject.isOpenChangeYear) {
        if (conditionObject.isOpenChangeYear.start === "toggle") {
          calendar.condition.isOpenChangeYear.start = calendar.condition.isOpenChangeYear.start ? false : true
        } else if (conditionObject.isOpenChangeYear.start === "false") {
          calendar.condition.isOpenChangeYear.start = false;
        } else if (conditionObject.isOpenChangeYear.start === "true") {
          calendar.condition.isOpenChangeYear.start = true;
        }
        if (calendar.condition.isOpenChangeYear.start) {
          calendar.condition.isOpenChangeYear.end = false,
          calendar.condition.isOpenChangeMonth.end = false,
          calendar.condition.isOpenChangeMonth.start = false;
        }
      } else if ("end" in conditionObject.isOpenChangeYear) {
        if (conditionObject.isOpenChangeYear.end === "toggle") {
          calendar.condition.isOpenChangeYear.end = calendar.condition.isOpenChangeYear.end ? false : true
        } else if (conditionObject.isOpenChangeYear.end === "false") {
          calendar.condition.isOpenChangeYear.end = false;
        } else if (conditionObject.isOpenChangeYear.end === "true") {
          calendar.condition.isOpenChangeYear.end = true;
        }
        if (calendar.condition.isOpenChangeYear.end) {
          calendar.condition.isOpenChangeYear.start = false,
           calendar.condition.isOpenChangeMonth.end = false,
            calendar.condition.isOpenChangeMonth.start = false;
        }   
      }
    } 
    function isOpenChangeMonthUpdate() {//Изменение состояния видимости блока месяца
      if (conditionObject.isOpenChangeMonth.start === "true" && conditionObject.isOpenChangeMonth.end === "true") {
        throw new CalendarError(2, "updateObject.condition.isOpenChangeMonth может иметь только одно свойство со значением true");
      }
      if ("start" in conditionObject.isOpenChangeMonth) {
        if (conditionObject.isOpenChangeMonth.start === "toggle") {
          calendar.condition.isOpenChangeMonth.start = calendar.condition.isOpenChangeMonth.start ? false : true
        } else if (conditionObject.isOpenChangeMonth.start === "false") {
          calendar.condition.isOpenChangeMonth.start = false;
        } else if (conditionObject.isOpenChangeMonth.start === "true") {
          calendar.condition.isOpenChangeMonth.start = true;
        }
        if (calendar.condition.isOpenChangeMonth.start) {
          calendar.condition.isOpenChangeYear.end = false,
          calendar.condition.isOpenChangeYear.start = false,
          calendar.condition.isOpenChangeMonth.end = false;
        }
      } else if ("end" in conditionObject.isOpenChangeMonth) {
        if (conditionObject.isOpenChangeMonth.end === "toggle") {
          calendar.condition.isOpenChangeMonth.end = calendar.condition.isOpenChangeMonth.end ? false : true
        } else if (conditionObject.isOpenChangeMonth.end === "false") {
          calendar.condition.isOpenChangeMonth.end = false;
        } else if (conditionObject.isOpenChangeMonth.end === "true") {
          calendar.condition.isOpenChangeMonth.end = true;
        }
        if (calendar.condition.isOpenChangeMonth.end) {
          calendar.condition.isOpenChangeYear.start = false,
          calendar.condition.isOpenChangeYear.end = false,
          calendar.condition.isOpenChangeMonth.start = false;
        }   
      }
    }
    function isVisibleResetUpdate() {//Изменение состояния видимости крестика
      calendar.condition.isVisibleReset.start = calendar.data.changeDate.startDate.day == null && calendar.data.changeDate.startDate.month == null && calendar.data.changeDate.startDate.year == null ? false : true
      calendar.condition.isVisibleReset.end = calendar.data.changeDate.endDate.day == null && calendar.data.changeDate.endDate.month == null && calendar.data.changeDate.endDate.year == null ? false : true
    }

    //Проверка корректности переданного updateObject
    if (!("condition" in updateObject)) {
      throw Error(2, "Вы передали в метод смены состояния объект не содержащий свойство condition");
    } else if (updateObject.condition != null && typeof updateObject.condition !== "object") {
      throw Error(2, "Вы передали в метод смены состояния объект со свойством condition не являющегося объектом");
    }

    let conditionObject = updateObject.condition; //Object
    if ("isOpenMainBlock" in conditionObject) {
      isOpenMainBlockUpdate()
    }
    if ("isOpenChangeYear" in conditionObject) {
      isOpenChangeYearUpdate()
    }
    if ("isOpenChangeMonth" in conditionObject) {
      isOpenChangeMonthUpdate()
    }
    isVisibleResetUpdate()

    //Обновляем html элементы новым данным
    updateConditionHtmlElements(calendar)

  }
  let updateConditionHtmlElements = function(calendar) {
    //Обновление Html по обновленным данным в condition
    calendar.elements.mainBlockElements.forEach(function(mainBlockElement) {
      mainBlockElement.style.display = calendar.condition.isOpenMainBlock ? "" : "none"
    })
    calendar.elements.chooseChangeYears.forEach(function(chooseChangeYear) {
      if (chooseChangeYear.classList.contains(`${calendar.htmlClass}-ed`) === true) {
        chooseChangeYear.style.display = calendar.condition.isOpenChangeYear.end ? "" : "none";
      } else if (chooseChangeYear.classList.contains(`${calendar.htmlClass}-sd`) === true) {
        chooseChangeYear.style.display = calendar.condition.isOpenChangeYear.start ? "" : "none";
      }
    })
    calendar.elements.chooseChangeMonths.forEach(function(chooseChangeMonth) {
      if (chooseChangeMonth.classList.contains(`${calendar.htmlClass}-ed`) === true) {
        chooseChangeMonth.style.display = calendar.condition.isOpenChangeMonth.end ? "" : "none";
      } else if (chooseChangeMonth.classList.contains(`${calendar.htmlClass}-sd`) === true) {
        chooseChangeMonth.style.display = calendar.condition.isOpenChangeMonth.start ? "" : "none";
      }
    })
    calendar.elements.fastSearchCloses.forEach(function(fastSearchClose) {
      if (fastSearchClose.closest(`.${calendar.htmlClass}-sd`)) {
        fastSearchClose.style.display = calendar.condition.isVisibleReset.start ? "" : "none"
      }
      if (fastSearchClose.closest(`.${calendar.htmlClass}-ed`)) {
        fastSearchClose.style.display = calendar.condition.isVisibleReset.end ? "" : "none"
      }
    })
    calendar.elements.fastSearchBriefEntries.forEach(function(briefEntry) {
      if (calendar.condition.isOpenMainBlock) {
        briefEntry.style.display = "none";
        calendar.elements.fastSearchInputFields.forEach(function(inputField) {
          inputField.style.display = ""
        })
      } else {
        briefEntry.style.display = "";
        calendar.elements.fastSearchInputFields.forEach(function(inputField) {
          inputField.style.display = "none"
        })
      }
    })
    
  }
  

  let manageStageBuild = function() { //Функция по управелнию создания основного объекта
    let initObject = initCalendar(htmlClass) ?? calendar;
    Object.assign(calendar, initObject);
  }

  let calendar = {}; // Основной объект 
  manageStageBuild(); // Вызываем функцию управляющую созданием основного объекта
  return calendar; // Вместо this конструктор возвратит основной объект  
}

function checkError(calendar) {
  if (calendar != undefined) {
    console.log(calendar)
    console.log("Календарь   успешно создан!!!");
  }
}
let htmlClass = "calendar";
let calendar = new Calendar(htmlClass)
checkError(calendar);


/* 
  состояния элементов: 
  - показ главного блока(показан или скрыт, по умл скрыт)
  - выбор года/месяца
  - состояние выбора даты(если выбрана то должен быть крестик на панеле быстрого просмотра)
  - состояние показа ошибки(при некорректном вводе должна вылезать ошибка которая будет исчезать при любом последующем действии)
*/
/*
  данные календаря:
  - объект дня начала и конца
  - 
*/