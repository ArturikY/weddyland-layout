"use strict";
//Пока что ошибки будут реализованы только для неполадок при создании
function SliderError(code) {
  this.objectType = "Error" //Имитация классов
  this.code = code; // Строка с числом
  function getSliderErrorDescription(thisError, code) {
    switch(code) {
      case "10":
        thisError.description = "Ошибка при получении базовых элементов слайдера";
        break;
      case "11":
        thisError.description = "Ошибка при получении дополнительныx элементов слайдера";
        break;
      case "12":
        thisError.description = "Ошибка при получении параметров слайдера";
        break;
      default:
        thisError.description = "Ошибка(неизвестный тип)"
        break;
    }
  }
  getSliderErrorDescription(this, code)
}
function Slider(htmlClass) { //Создания объекта слайдера
  function setBaseElementsSlider(thisSlider) {
    let checkMark = (thisSlider.elementSlider = document.querySelector(`.${thisSlider.htmlClass}`)) &&
    (thisSlider.elementSliderWrapper = document.querySelector(`.${thisSlider.htmlClass}__wrapper`)) &&
    (thisSlider.elementSliderRow = thisSlider.elementSliderWrapper.querySelector(`.${thisSlider.htmlClass}__row`) )&&
    (thisSlider.elementSliderSlides = thisSlider.elementSliderRow.querySelectorAll(`.${thisSlider.htmlClass}__slide`));
    if (checkMark) {
      if (thisSlider.elementSliderSlides.length < 3) {
        return false
      }
      return true
    } else {
      return false
    }
  } // Установка базовых элементов слайдера
  function setOtherElementsSlider(thisSlider) {
    thisSlider.isTab = (thisSlider.elementSlider.dataset.tab === "true") ? true : false; //boolean
    if (thisSlider.isTab) {
      thisSlider.elementSliderTabs = document.querySelectorAll(`.${thisSlider.htmlClass}-tab`); // Колллекция всех блоков табов данного слайдера
      if (thisSlider.elementSliderTabs.length === 0) {
        return false
      }
      let tabPointsCountMark = true;
      thisSlider.elementSliderTabs.forEach(function(tabs) {
        if (tabs.querySelectorAll(`.${thisSlider.htmlClass}-tab__point`).length > thisSlider.elementSliderSlides.length) {tabPointsCountMark = false}
      })
      if (!tabPointsCountMark) {
        return false
      }
    }
    thisSlider.isArrow = (thisSlider.elementSlider.dataset.arrow === "true") ? true : false; //boolean
    if (thisSlider.isArrow) {
      thisSlider.elementSliderArrows = document.querySelectorAll(`.${thisSlider.htmlClass}-arrow`); // Колллекция всех блоков стрелок данного слайдера
      if (thisSlider.elementSliderArrows.length === 0) {
        return false
      }
      for (let arrow of thisSlider.elementSliderArrows) {
        if ((arrow.querySelectorAll(`.${thisSlider.htmlClass}-arrow__prev`).length !== 1) || (arrow.querySelectorAll(`.${thisSlider.htmlClass}-arrow__next`).length !== 1)) {
          return false
        }
      }
    }
    return true
  } // Установка дополнительных элементов слайдера
  function setTypeSlider(thisSlider) {
    thisSlider.typeSlider = thisSlider.elementSlider.dataset.type;
    if (!(["default", "carousel", "tabs"].includes(thisSlider.typeSlider))) {
      return false;
    }
    if ((thisSlider.typeSlider === "carousel") && (thisSlider.elementSliderSlides.length < 3)) {
      return false
    }
    let initSlideNumber = (thisSlider.elementSlider.dataset.initSlide && Number(thisSlider.elementSlider.dataset.initSlide) < thisSlider.elementSliderSlides.length && Number(thisSlider.elementSlider.dataset.initSlide) > 0) ? Number(thisSlider.elementSlider.dataset.initSlide) : null; // Объект первого слайда
    if (initSlideNumber != null) {
      let initSlideNode = thisSlider.elementSliderRow.firstElementChild;
      while (initSlideNumber != 0) {
        initSlideNode = initSlideNode.nextElementSibling;
        initSlideNumber--;
      }
      thisSlider.initSlide = Array.from(thisSlider.elementSliderSlides).find(function(val) {return initSlideNode == val.node})
    }


    thisSlider.isLoop = thisSlider.elementSlider.dataset.loop === "true" ? true : false; // будет ли слайдер зацикленным
    thisSlider.isBring = false; // boolean
    thisSlider.align = "center" // string
    if (thisSlider.typeSlider == "carousel") {
      thisSlider.isBring = true; 
      if (thisSlider.initSlide == null) {
        thisSlider.initSlide = thisSlider.elementSliderSlides.find(function(val) {return thisSlider.elementSliderRow.firstElementChild === val.node});
      }
    }
    if (thisSlider.typeSlider == "tabs") {
      if (thisSlider.initSlide == null) {
        thisSlider.initSlide = thisSlider.elementSliderSlides.find(function(val) {return thisSlider.elementSliderRow.firstElementChild === val.node});
      }
    }
    if (thisSlider.typeSlider == "default") {
      thisSlider.isBring = (thisSlider.elementSlider.dataset.bring === "true") ? true : false;
      thisSlider.align = (["left", "center", "right"].includes(thisSlider.elementSlider.dataset.align)) ? thisSlider.elementSlider.dataset.align : "left";
      }
    return true
  }
  function getSlideObjectSlider(thisSlider) {
    thisSlider.elementSliderSlides = Array.from(thisSlider.elementSliderSlides).map(function(slideNode, index, slides) {
      let slide = {
        "node": slideNode, // node
        "uniqNumber": index, //numb
        "isInit": (thisSlider.initSlide === index) ? true : false, //boolean
        //У первого слайда coordStart всегда должен быть 0
        "coordStart": slideNode.offsetLeft, //number
      }
      return slide
    })
    return true
  }
  function getOtherObjectSlider(thisSlider) {
    if (thisSlider.isTab) {
      thisSlider.elementSliderTabs = Array.from(thisSlider.elementSliderTabs).map(function(tabNode, index, tabs) {
        let tab = {
          "tabNode": tabNode,
        }
        tab["points"] = Array.from(tabNode.querySelectorAll(`.${thisSlider.htmlClass}-tab__point`)).map(function(pointNode, index, points) {
          let point = {
            "pointNode": pointNode,
            "number": index,
          }
          return point
        })
        return tab
      })
    }
    if (thisSlider.isArrow) {
      thisSlider.elementSliderArrows = Array.from(thisSlider.elementSliderArrows).map(function(arrowNode, index, arrows) {
        let arrow = {
          "arrowNode": arrowNode,
          "prevNode": arrowNode.querySelector(`.${thisSlider.htmlClass}-arrow__prev`),
          "nextNode": arrowNode.querySelector(`.${thisSlider.htmlClass}-arrow__next`),
        }
        return arrow
      })
      return true
    }  
    return true
  }
  function checkFullness(slider) {
    function filterSlidesByNumber(a, b) {
      return a - b
    }
    if (!(slider.loop)) {
      let nowSlide = 0;
      let initLength = this.elementSliderSlides.length; //Изначальное колво слайдов
      while (this.elementSliderRow.offsetWidth < this.elementSliderWrapper.clientWidth) {
        let slideNode = this.elementSliderSlides.at(nowSlide).node.cloneNode(true);
        this.elementSliderRow.append(slideNode)
        this.elementSliderSlides.push({
          "node": slideNode, // node
          "uniqNumber": (this.elementSliderSlides.length + 1) % initLength - 1, //numb
          "isInit": false, //boolean
          "coordStart": slideNode.offsetLeft, //number
        })
        nowSlide += 1; // тупая проверка тк я всегда увеличваю колво слайдов на один и следовательно длину массива слайдов тоже, значит я никогда не дойду до его конца
      }
    } else {
      uploadSlide(slider)
    }
    if (!(slider.initSlide == null && slider.typeSlider === "default")) {
      return
    }
    if (this.align === "left") {
      slider.initSlide = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild === val.node});
    } else if (this.align === "right") {
      slider.initSlide = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild === val.node});
    } else {
      let initSlideCount = ((slider.elementSliderSlides.length - 1) / 2).toFixed(0);
      let initSlideNode = slider.elementSliderRow.firstElementChild;
      while (initSlideCount != 0) {
        initSlideNode = initSlideNode.nextElementSibling;
        initSlideCount--;
      }
      slider.initSlide = slider.elementSliderSlides.find(function(val) {return initSlideNode == val.node})
    }

  }
  function setAlign(slider) { // дубликат функции setNowSlider из setSliderListener
    let nearSlide = null;
    let minDistanceArr = [];
    if (slider.align === "left") {
      minDistanceArr = slider.elementSliderSlides.map(function(slide) {return Math.abs(slide.coordStart + slider.coords.transformX)})
      nearSlide = slider.elementSliderSlides.find(function(slide) {return Math.abs(slide.coordStart + slider.coords.transformX) === Math.min(...minDistanceArr)})
      slider.nearSlide = nearSlide
    } else if (slider.align === "center") {
      minDistanceArr = slider.elementSliderSlides.map(function(slide) {return Math.abs((slider.elementSliderWrapper.clientWidth - slide.node.offsetWidth) / 2 - (slide.coordStart + slider.coords.transformX))})
      nearSlide = slider.elementSliderSlides.find(function(slide) {return Math.abs((slider.elementSliderWrapper.clientWidth - slide.node.offsetWidth) / 2 - (slide.coordStart + slider.coords.transformX)) === Math.min(...minDistanceArr)})
      slider.nearSlide = nearSlide
    } else if (slider.align === "right") {
      minDistanceArr = slider.elementSliderSlides.map(function(slide) {return Math.abs(slider.elementSliderWrapper.clientWidth - (slide.coordStart + slider.coords.transformX))})
      nearSlide = slider.elementSliderSlides.find(function(slide) {return Math.abs(slider.elementSliderWrapper.clientWidth - (slide.coordStart + slider.coords.transformX)) === Math.min(...minDistanceArr)})
      slider.nearSlide = nearSlide
    }
  }
  function setBring(slider) {
    if (slider.align === "left") {
      slider.coords.transformX = -slider.nearSlide.coordStart
    } else if (slider.align === "center") {
      slider.coords.transformX = (slider.elementSliderWrapper.clientWidth - slider.nearSlide.node.offsetWidth) / 2 - slider.nearSlide.coordStart
    } else if (slider.align === "right") {
      slider.coords.transformX = (slider.elementSliderWrapper.clientWidth - slider.nearSlide.node.offsetWidth) - slider.nearSlide.coordStart
    } 
  }
  function stickingSlide(slider) {
    let mark = null;
    let firstSlide = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild === val.node});
    let lastSlide = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild === val.node});
    if (firstSlide.coordStart + slider.coords.transformX > 0) {
      mark = "prev";
      slider.coords.transformX = 0
    } else if (lastSlide.coordStart + lastSlide.node.offsetWidth + slider.coords.transformX < slider.elementSliderWrapper.clientWidth) {
      mark = "next";
      slider.coords.transformX = -(lastSlide.coordStart + lastSlide.node.offsetWidth - slider.elementSliderWrapper.clientWidth);
    }

    return mark
  } 
  function uploadSlide(slider) {
    let secondSlideStart = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild.nextElementSibling === val.node});
    let secondSlideEnd = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild.previousElementSibling === val.node});
    let slideGap = slider.elementSliderSlides.at(1).coordStart - slider.elementSliderSlides.at(0).node.offsetWidth;
    let newSlide = {};
    if (0 < (secondSlideStart.coordStart + secondSlideStart.node.offsetWidth) + slider.coords.transformX) {
      //add slider to start and change value coordStart of all slides, and change value transformX
      newSlide = {}

      let firstSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild === val.node});
      newSlide["uniqNumber"] = firstSlideInRow.uniqNumber - 1 >= 0 ? firstSlideInRow.uniqNumber - 1 : 
        Math.max(...slider.elementSliderSlides.map(function(val) {return val.uniqNumber}));
      newSlide["node"] = slider.elementSliderSlides.find(function(val) {return val.uniqNumber === newSlide.uniqNumber}).node.cloneNode(true);
      newSlide["coordStart"] = 0;
      newSlide["isInit"] = false;
      
      slider.coords.transformX -= slideGap + slider.elementSliderSlides.at(0).node.offsetWidth;
      for (let slide of slider.elementSliderSlides) {
        slide.coordStart = slide.coordStart + slideGap + slide.node.offsetWidth
      }
      slider.elementSliderSlides.unshift(newSlide) // Добавление нового слайда в спиок слайдов
      slider.elementSliderRow.prepend(newSlide.node);
    } 
    if ((secondSlideEnd.coordStart + slider.coords.transformX) < slider.elementSliderWrapper.clientWidth) {
      //add slider to end, and change value transformX 
      newSlide = {}
      let lastSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild === val.node});
      newSlide["uniqNumber"] = lastSlideInRow.uniqNumber + 1 > Math.max(...slider.elementSliderSlides.map(function(val) {return val.uniqNumber})) ? 0 : 
      lastSlideInRow.uniqNumber + 1;
      newSlide["node"] = slider.elementSliderSlides.find(function(val) {return val.uniqNumber === newSlide.uniqNumber}).node.cloneNode(true);
      newSlide["coordStart"] = lastSlideInRow.coordStart + lastSlideInRow.node.offsetWidth + slideGap;
      newSlide["isInit"] = false;

      slider.elementSliderSlides.push(newSlide) // Добавление нового слайда в спиок слайдов
      slider.elementSliderRow.append(newSlide.node);

    }
  }
  function clearSlide(slider) {
    let lastSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild === val.node});
    let firstSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild === val.node});
    let slideGap = lastSlideInRow.coordStart - (slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild.previousElementSibling === val.node}).coordStart + slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild.previousElementSibling === val.node}).node.offsetWidth);
    if ((lastSlideInRow.coordStart + slider.coords.transformX) > slider.elementSliderWrapper.clientWidth + lastSlideInRow.node.offsetWidth * 4 + slideGap * 4) {
      slider.elementSliderRow.removeChild(lastSlideInRow.node);
      slider.elementSliderSlides.splice(slider.elementSliderSlides.indexOf(lastSlideInRow), 1)
    }
    if ((firstSlideInRow.coordStart + slider.coords.transformX) + firstSlideInRow.node.offsetWidth * 4 + slideGap * 4 < 0) {
      slider.elementSliderSlides.splice(slider.elementSliderSlides.indexOf(firstSlideInRow), 1)
      slider.coords.transformX += firstSlideInRow.node.offsetWidth + slideGap;
      slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`
      for (let slide of slider.elementSliderSlides) {
        slide.coordStart -= firstSlideInRow.node.offsetWidth + slideGap
      }
      slider.elementSliderRow.removeChild(firstSlideInRow.node);

    }
  } 
  
  function setPrevNextArrowSlide(slider) {//Учитывая объект arrowFrozen у slider добаваляет или убирает класс frozen со стрелок слайдера
    if (slider.arrowFrozen["prev"] === 0) {
      //add special class for frozen arrow prev
      slider.elementSliderArrows.forEach(function(arrowsNode) {
        arrowsNode.arrowNode.querySelector(`.${slider.htmlClass}-arrow__prev`).classList.add("frozen");
      })
    } else {
      slider.elementSliderArrows.forEach(function(arrowsNode) {
        arrowsNode.arrowNode.querySelector(`.${slider.htmlClass}-arrow__prev`).classList.remove("frozen");
      })
    }
    if (slider.arrowFrozen["next"] === 0) {
      //add special class for frozen arrow next
      slider.elementSliderArrows.forEach(function(arrowsNode) {
        arrowsNode.arrowNode.querySelector(`.${slider.htmlClass}-arrow__next`).classList.add("frozen");
      })
    } else {
      slider.elementSliderArrows.forEach(function(arrowsNode) {
        arrowsNode.arrowNode.querySelector(`.${slider.htmlClass}-arrow__next`).classList.remove("frozen");
      })
    }
  }
  function checkPrevNextArrowSlide(slider) {//Обновлеят объект arrowFrozen у slider
    let checkArrowFrozen = {"prev": 1, "next": 1};
    let subObjectForBrining = Object.assign({}, slider, {coords : {transformX: slider.coords.transformX}}); 
    let nextSlide = slider.elementSliderSlides.at(Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) + 1 > slider.elementSliderSlides.length - 1 ? Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) : Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) + 1);
    let prevSlide = slider.elementSliderSlides.at(Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) - 1 < 0 ? Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) : Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) - 1);
    if ((Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) === 0) && !(slider.coords.transformX < 0)) {
      checkArrowFrozen["prev"] = 0;
    } else if (subObjectForBrining["nearSlide"] = prevSlide, subObjectForBrining.coords.transformX = slider.coords.transformX, slider.briningFunc(subObjectForBrining), slider.stickingFunc(subObjectForBrining) === "prev" && !(slider.coords.transformX < 0)) {
      checkArrowFrozen["prev"] = 0;
    }
    if ((Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) === slider.elementSliderSlides.length - 1)  && !(slider.coords.transformX + slider.elementSliderRow.offsetWidth > slider.elementSliderWrapper.offsetWidth)) {
      checkArrowFrozen["next"] = 0;
    } else if (subObjectForBrining["nearSlide"] = nextSlide, subObjectForBrining.coords.transformX = slider.coords.transformX, slider.briningFunc(subObjectForBrining), slider.stickingFunc(subObjectForBrining) === "next" && !(slider.coords.transformX + slider.elementSliderRow.offsetWidth > slider.elementSliderWrapper.offsetWidth)) {
      slider.nearSlide
      checkArrowFrozen["next"] = 0;
    }
    slider.arrowFrozen = checkArrowFrozen;
  }
  this.objectType = "Slider" //Имитация классов
  // Класс основого блока слайдера из html которой здесь будет использовать в качестве названия
  this.htmlClass = htmlClass; //string
  if (htmlClass) {
    let checkMark = setBaseElementsSlider(this);
    if (!checkMark) {
      return new SliderError("10")
    }
    checkMark = setOtherElementsSlider(this);
    if (!checkMark) {
      return new SliderError("11")
    }
    checkMark = setTypeSlider(this);
    if (!checkMark) {
      return new SliderError("12")
    }
    checkMark = getSlideObjectSlider(this);
    if (!checkMark) {
      return new SliderError("13")
    }
    checkMark = getOtherObjectSlider(this);
    if (!checkMark) {
      return new SliderError("13")
    }
    this.checkFullness = checkFullness
    this.checkFullness(this)
    this.coords = {
      coordY: 0, 
      coordX: 0, 
      transformX: 0, 
      transformY: 0, 
      isPress: false, //Определяет прожата кнопка или нет
    }
    this.nearSlide = this.initSlide; // object
    this.briningFunc = setBring;
    this.stickingFunc = stickingSlide;
    this.briningFunc(this);
    
    if (!this.isLoop) {
      stickingSlide(this)
    } else {
      this.uploadFunc = uploadSlide;
      this.clearFunc = clearSlide;
      uploadSlide(this)
      clearSlide(this)
    }
    this.elementSliderRow.style.transform = `translateX(${this.coords.transformX}px)`

    //Arrows
    if (this.isArrow) {
      this.arrowFrozen = {};
      this.checkArrowFrozenFunc = checkPrevNextArrowSlide;
      this.setArrowFrozenFunc = setPrevNextArrowSlide;
      if (this.isArrow) {
        this.checkArrowFrozenFunc(this);
        this.setArrowFrozenFunc(this);
      }
    } 
    return this;
  }

  return new SliderError("13")
}
function setSliderListener(slider) {//Установка прослушки событий на слайдер
  function setMouseListener() {
    function getMouseCoord(event) {
      return {"clientX": event.clientX ?? event.touched.at(0).clientX, "clientY": event.clientY ?? event.touched.at(0).clientY} 
    }
    function uploadSlide(slider) {
      let secondSlideStart = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild.nextElementSibling.nextElementSibling === val.node});
      let secondSlideEnd = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild.previousElementSibling.previousElementSibling === val.node});
      let slideGap = slider.elementSliderSlides.at(1).coordStart - slider.elementSliderSlides.at(0).node.offsetWidth;
      let newSlide = {};
      if (0 < (secondSlideStart.coordStart + secondSlideStart.node.offsetWidth) + slider.coords.transformX) {
        //add slider to start and change value coordStart of all slides, and change value transformX
        newSlide = {}

        let firstSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild === val.node});
        newSlide["uniqNumber"] = firstSlideInRow.uniqNumber - 1 >= 0 ? firstSlideInRow.uniqNumber - 1 : 
          Math.max(...slider.elementSliderSlides.map(function(val) {return val.uniqNumber}));
        newSlide["node"] = slider.elementSliderSlides.find(function(val) {return val.uniqNumber === newSlide.uniqNumber}).node.cloneNode(true);
        newSlide["coordStart"] = 0;
        newSlide["isInit"] = false;
        
        slider.coords.transformX -= slideGap + slider.elementSliderSlides.at(0).node.offsetWidth;
        for (let slide of slider.elementSliderSlides) {
          slide.coordStart = slide.coordStart + slideGap + slide.node.offsetWidth
        }
        slider.elementSliderSlides.unshift(newSlide) // Добавление нового слайда в спиок слайдов
        slider.elementSliderRow.prepend(newSlide.node);
      } 
      if ((secondSlideEnd.coordStart + slider.coords.transformX) < slider.elementSliderWrapper.clientWidth) {
        //add slider to end, and change value transformX 
        newSlide = {}
        let lastSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild === val.node});
        newSlide["uniqNumber"] = lastSlideInRow.uniqNumber + 1 > Math.max(...slider.elementSliderSlides.map(function(val) {return val.uniqNumber})) ? 0 : lastSlideInRow.uniqNumber + 1;
        lastSlideInRow.uniqNumber + 1;
        newSlide["node"] = slider.elementSliderSlides.find(function(val) {return val.uniqNumber === newSlide.uniqNumber}).node.cloneNode(true);
        newSlide["coordStart"] = lastSlideInRow.coordStart + lastSlideInRow.node.offsetWidth + slideGap;
        newSlide["isInit"] = false;

        slider.elementSliderSlides.push(newSlide) // Добавление нового слайда в спиок слайдов
        slider.elementSliderRow.append(newSlide.node);

      }
    }
    function clearSlide(slider) {
      let lastSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild === val.node});
      let firstSlideInRow = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild === val.node});
      let slideGap = lastSlideInRow.coordStart - (slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild.previousElementSibling === val.node}).coordStart + slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild.previousElementSibling === val.node}).node.offsetWidth);
      if ((lastSlideInRow.coordStart + slider.coords.transformX) > slider.elementSliderWrapper.clientWidth + lastSlideInRow.node.offsetWidth * 4 + slideGap * 4) {
        slider.elementSliderRow.removeChild(lastSlideInRow.node);
        slider.elementSliderSlides.splice(slider.elementSliderSlides.indexOf(lastSlideInRow), 1)
      }
      if ((firstSlideInRow.coordStart + slider.coords.transformX) + firstSlideInRow.node.offsetWidth * 4 + slideGap * 4 < 0) {
        slider.elementSliderSlides.splice(slider.elementSliderSlides.indexOf(firstSlideInRow), 1)
        slider.coords.transformX += firstSlideInRow.node.offsetWidth + slideGap;
        slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`
        for (let slide of slider.elementSliderSlides) {
          slide.coordStart -= firstSlideInRow.node.offsetWidth + slideGap
        }
        slider.elementSliderRow.removeChild(firstSlideInRow.node);

      }
    }
    function stickingSlide(slider) {
      let firstSlide = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.firstElementChild === val.node});
      let lastSlide = slider.elementSliderSlides.find(function(val) {return slider.elementSliderRow.lastElementChild === val.node});
      if (firstSlide.coordStart + slider.coords.transformX > 0) {
        slider.coords.transformX = 0
      } else if (lastSlide.coordStart + lastSlide.node.offsetWidth + slider.coords.transformX < slider.elementSliderWrapper.clientWidth) {
        slider.coords.transformX = -(lastSlide.coordStart + lastSlide.node.offsetWidth - slider.elementSliderWrapper.clientWidth);
      }
      
    }
    function setNowSlider(slider) {
      let nearSlide = null;
      let minDistanceArr = [];
      if (slider.align === "left") {
        minDistanceArr = slider.elementSliderSlides.map(function(slide) {return Math.abs(slide.coordStart + slider.coords.transformX)})
        nearSlide = slider.elementSliderSlides.find(function(slide) {return Math.abs(slide.coordStart + slider.coords.transformX) === Math.min(...minDistanceArr)})
        slider.nearSlide = nearSlide
      } else if (slider.align === "center") {
        minDistanceArr = slider.elementSliderSlides.map(function(slide) {return Math.abs((slider.elementSliderWrapper.clientWidth - slide.node.offsetWidth) / 2 - (slide.coordStart + slider.coords.transformX))})
        nearSlide = slider.elementSliderSlides.find(function(slide) {return Math.abs((slider.elementSliderWrapper.clientWidth - slide.node.offsetWidth) / 2 - (slide.coordStart + slider.coords.transformX)) === Math.min(...minDistanceArr)})
        slider.nearSlide = nearSlide
      } else if (slider.align === "right") {
        minDistanceArr = slider.elementSliderSlides.map(function(slide) {return Math.abs(slider.elementSliderWrapper.clientWidth - (slide.coordStart + slider.coords.transformX))})
        nearSlide = slider.elementSliderSlides.find(function(slide) {return Math.abs(slider.elementSliderWrapper.clientWidth - (slide.coordStart + slider.coords.transformX)) === Math.min(...minDistanceArr)})
        slider.nearSlide = nearSlide
      }
    }


    function handleMouseDown(event) {
      let otherElementsMark = false;
      if (slider.isArrow) {
        slider.elementSliderArrows.forEach(function(arr) {
          if (arr.prevNode.contains(event.target)) {
            otherElementsMark = true
          } 
          if (arr.nextNode.contains(event.target)) {
            otherElementsMark = true
          }
        })
        slider.elementSliderTabs.forEach(function(tab) {
          tab.points.forEach(function(point) {
            if (point.pointNode.contains(event.target)) {
              otherElementsMark = true
            } 
          })     
        })
      }
      if (otherElementsMark) {
        return
      }
      let clientCoord = getMouseCoord(event);
      slider.coords.isPress = true;
      slider.coords.coordX = clientCoord.clientX;
      slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`
    }
    function handleMouseMove(event) {
      if (!slider.coords.isPress) {
        return
      }
      let clientCoord = getMouseCoord(event);
      slider.coords.transformX += clientCoord.clientX - slider.coords.coordX;
      slider.coords.coordX = clientCoord.clientX;
      if (slider.isLoop) {
        uploadSlide(slider)
        clearSlide(slider)
      }
      if (slider.isArrow === true) {
        slider.checkArrowFrozenFunc(slider);
        slider.setArrowFrozenFunc(slider);
      }
      slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`
    }
    function handleMouseUp(event) {
      if (!slider.coords.isPress) {
        return
      }
      let clientCoord = getMouseCoord(event);
      slider.coords.isPress = false;
      slider.coords.coordLast += slider.coords.coordX - clientCoord.clientX;
      slider.coords.coordX = clientCoord.clientX;
      setNowSlider(slider)
      if (slider.isLoop) {
        uploadSlide(slider)
        clearSlide(slider)
        slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`;
      }
      if (slider.isBring) {
        slider.briningFunc(slider)
      }
      if (!slider.isLoop) {
        stickingSlide(slider)
      }
      slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`;
    }
  
    slider.elementSliderWrapper.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
  }
  function setArrowListener() {
    function handleNextArrowSlider(event) {
      //Если вы скролили и потом отпустили клавишу на элементе стрелки то не надо чтобы она выполнялась
      if (slider.coords.isPress) {
        return
      }
      if (slider.arrowFrozen["next"] === 1) {
        if (slider.isLoop) {
          slider.uploadFunc(slider)
          slider.clearFunc(slider)
        }
        let nextSlide = slider.elementSliderSlides.at(Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) + 1 > slider.elementSliderSlides.length - 1 ? Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) : Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) + 1);

        slider.nearSlide = nextSlide;
        slider.briningFunc(slider);
        if (!slider.isLoop) {
          slider.stickingFunc(slider)
        }
        slider.checkArrowFrozenFunc(slider);
        slider.setArrowFrozenFunc(slider);
        slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`
      }
    }
    function handlePrevArrowSlider(event) {
      if (slider.coords.isPress) {
        return
      }
      if (slider.arrowFrozen["prev"] === 1) {
        if (slider.isLoop) {
          slider.uploadFunc(slider)
          slider.clearFunc(slider)
        }
        let prevSlide = slider.elementSliderSlides.at(Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) - 1 < 0 ? Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) : Array.from(slider.elementSliderSlides).indexOf(slider.nearSlide) - 1);

        slider.nearSlide = prevSlide;
        slider.briningFunc(slider);
        if (!slider.isLoop) {
          slider.stickingFunc(slider)
        }
        slider.checkArrowFrozenFunc(slider);
        slider.setArrowFrozenFunc(slider);
        slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`
      }
      
    }
    //Set listener for arrow
    if (slider.isArrow) {
      slider.elementSliderArrows.forEach(function(nodeArrows) {
        nodeArrows.arrowNode.querySelector(`.${slider.htmlClass}-arrow__prev`).addEventListener("click", handlePrevArrowSlider);
        nodeArrows.arrowNode.querySelector(`.${slider.htmlClass}-arrow__next`).addEventListener("click", handleNextArrowSlider);
      })
    }


  }
  function setTabListener() {
    function handleTabSlider(event) {
      if (slider.coords.isPress) {
        return
      }
      let targetTab;

      slider.elementSliderTabs.forEach(function(tabs) {
        if (targetTab === undefined) {
          targetTab = tabs.points.find(function(point) {return point.pointNode === (event.target.closest(`.${slider.htmlClass}-tab__point`))})
        }
      })
      if (targetTab == null) {
        throw Error;
      }
      slider.nearSlide = slider.elementSliderSlides.find(function(slide) {return slide.uniqNumber === targetTab.number})
      slider.briningFunc(slider)
      if (slider.isLoop) {
        slider.uploadFunc(slider)
        slider.clearFunc(slider)
        slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`;
      }
      if (!slider.isLoop) {
        slider.stickingFunc(slider)
      }
      slider.elementSliderRow.style.transform = `translateX(${slider.coords.transformX}px)`;
    }

    slider.elementSliderTabs.forEach(function(tabs) {
      tabs.points.forEach(function(point) {
        point.pointNode.addEventListener("click", handleTabSlider)
      })
    })
  }
  if (slider.type != "tabs") {
    setMouseListener()
  }
  setArrowListener()
  setTabListener()
}
function checkSliderInit(slider) {
  if (slider.objectType === "Error") {
    console.log(slider.code, slider.description)
  } else {
    console.log(`${slider.htmlClass} успешно создан!`)
  }  
}
let slider = new Slider('slider');
console.log(slider)
checkSliderInit(slider);
setSliderListener(slider);
