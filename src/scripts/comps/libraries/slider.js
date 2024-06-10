'use strict'
/*
Сниппет html кода слайдера - slider. Дописать документацию...
*/

/*!---Slider---!*/
const events = ['click', 'mousedown', 'mouseup', 'mousemove', 'touchstart', 'touchmove', 'touchend', 'DOMContentLoaded']
const sliders = document.querySelectorAll('.slider');
if (sliders.length > 0) {
    let sliderStart = {}, sliderTrans = {}, sliderActive = {};
    let sliderColumns = {}, sliderColumnsCoord = {};
    let sliderTabs = {};
    let sliderNowColumn = {};
    for (let sliderNum = 0; sliderNum < sliders.length; sliderNum++) {
        const slider = sliders[sliderNum];
        let dataSliderWidth = slider.getAttribute('data-slider-width'), dataSliderBring = slider.getAttribute('data-slider-bring') == 'true' ? true : false;
        if (dataSliderWidth < window.innerWidth) {
            continue
        }
        const sliderRow = slider.querySelector('.slider__row');
        sliderColumns[`${sliderNum}`] = slider.querySelectorAll('.slider__column');
        sliderColumnsCoord[`${sliderNum}`] = []
        sliderColumns[`${sliderNum}`].forEach(function (col, ind) {
            sliderColumnsCoord[`${sliderNum}`].push(-col.offsetLeft);
        })
        if (slider.querySelectorAll('.slider__nav').length > 0) {
            slider.querySelectorAll('.slider__nav').forEach(function(obj, ind) {
                var sliderPrev = obj.querySelector('.slider__prev');
                if (sliderPrev) {
                    sliderPrev.addEventListener('click', sliderNavPrev)
                }
                var sliderNext = obj.querySelector('.slider__next');
                if (sliderNext) {
                    sliderNext.addEventListener('click', sliderNavNext)
                }
            })
        }
        sliderNowColumn[`${sliderNum}`] = 0
        if (slider.querySelectorAll('.slider__tabs').length > 0) {
            sliderTabs[`${sliderNum}`] = []
            slider.querySelectorAll('.slider__tabs').forEach(function(tabs, ind) {
                if (tabs.querySelectorAll('.slider__tab').length == sliderColumns[`${sliderNum}`].length) {
                    if (tabs.getAttribute('data-slider-click') == 'true') {
                        let sub = []
                        tabs.querySelectorAll('.slider__tab').forEach(function(tab) {
                            tab.addEventListener('click', sliderTab)
                            sub.push(tab)
                        })
                        sliderTabs[`${sliderNum}`][tabs] = sub;
                    } else {
                        sliderTabs[`${sliderNum}`][tabs] = tabs.querySelectorAll('.slider__tab');
                    }
                }
            })
            for (let e of events) {
                window.addEventListener(e, sliderTabEvent)
            }
        }
        sliderStart[`${sliderNum}`] = null;
        sliderTrans[`${sliderNum}`] = 0;
        sliderActive[`${sliderNum}`] = false;
        sliderRow.addEventListener('mousedown', sliderMouseDown);
        sliderRow.addEventListener('touchstart', sliderTouchMouseDown);
        window.addEventListener('mousemove', sliderMouseMove);
        window.addEventListener('touchmove', sliderTouchMouseMove);
        window.addEventListener('mouseup', sliderMouseUp);
        window.addEventListener('touchend', sliderTouchMouseUp);
        /*--Tab function--*/
        function sliderTabEvent(event) {
            for (let t in sliderTabs[`${sliderNum}`]) {
                t = sliderTabs[`${sliderNum}`][t]
                t.forEach(function(tab) {
                    tab.classList.remove('_active')
                })
                t[sliderNowColumn[`${sliderNum}`]].classList.add('_active')
            }
        }
        function sliderTab(event) {
            sliderNowColumn[`${sliderNum}`] = sliderTabs[`${sliderNum}`][`${event.target.parentNode}`].indexOf(event.target);
            let nowCoord = sliderColumnsCoord[`${sliderNum}`][(sliderNowColumn[`${sliderNum}`])];
            sliderNowColumn[`${sliderNum}`] = sliderColumnsCoord[`${sliderNum}`].indexOf(nowCoord);
            if (true) {
                if (sliderRow.clientWidth + nowCoord < slider.getBoundingClientRect().right) {
                    sliderRow.style.transform = `translateX(${-(sliderRow.clientWidth - sliderRow.parentNode.clientWidth)}px)`;
                    sliderRow.classList.add('_slider-return-column');
                    setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                    sliderTrans[`${sliderNum}`] = -(sliderRow.clientWidth - sliderRow.parentNode.clientWidth);
                    return;
                }
                sliderRow.style.transform = `translateX(${nowCoord}px)`;
                sliderRow.classList.add('_slider-return-column');
                setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                sliderTrans[`${sliderNum}`] = nowCoord;
            }
        }
        /*--Nav function--*/
        function sliderNavPrev(event) {
            let nowCoord = searchMinDiff(sliderTrans[`${sliderNum}`], sliderColumnsCoord[`${sliderNum}`]);
            let indexCoord = sliderColumnsCoord[`${sliderNum}`].indexOf(nowCoord);
            if (indexCoord > 0) {
                sliderNowColumn[`${sliderNum}`] = indexCoord-1;
                sliderRow.style.transform = `translateX(${sliderColumnsCoord[`${sliderNum}`][indexCoord-1]}px)`;
                sliderRow.classList.add('_slider-return-column');
                setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                sliderTrans[`${sliderNum}`] = sliderColumnsCoord[`${sliderNum}`][indexCoord-1];
            }
        }
        function sliderNavNext(event) {
            let nowCoord = searchMinDiff(sliderTrans[`${sliderNum}`], sliderColumnsCoord[`${sliderNum}`]);
            let indexCoord = sliderColumnsCoord[`${sliderNum}`].indexOf(nowCoord);
            if (indexCoord < sliderColumnsCoord[`${sliderNum}`].length-1) {
                sliderNowColumn[`${sliderNum}`] = indexCoord+1;
                if (sliderRow.clientWidth + sliderColumnsCoord[`${sliderNum}`][indexCoord+1] - slider.getBoundingClientRect().right < 0) {
                    sliderRow.style.transform = `translateX(${-(sliderRow.clientWidth - sliderRow.parentNode.clientWidth)}px)`;
                    sliderRow.classList.add('_slider-return-column');
                    setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                    sliderTrans[`${sliderNum}`] = -(sliderRow.clientWidth - sliderRow.parentNode.clientWidth);
                } else {
                    sliderRow.style.transform = `translateX(${sliderColumnsCoord[`${sliderNum}`][indexCoord+1]}px)`;
                    sliderRow.classList.add('_slider-return-column');
                    setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                    sliderTrans[`${sliderNum}`] = sliderColumnsCoord[`${sliderNum}`][indexCoord+1];
                }
            }
        }
        /*--Mouse function--*/
        function sliderMouseDown(event) {
            if (sliderRow.classList.contains('_slider-return-right') || sliderRow.classList.contains('_slider-return-left') || sliderRow.classList.contains('_slider-return-column')) {
                return
            }
            sliderRow.classList.add('_grabbing');
            sliderStart[`${sliderNum}`] = event.clientX;
            sliderActive[`${sliderNum}`] = true;
        }
        function sliderTouchMouseDown(event) {
            if (sliderRow.classList.contains('_slider-return-right') || sliderRow.classList.contains('_slider-return-left') || sliderRow.classList.contains('_slider-return-column')) {
                return
            }
            sliderRow.classList.add('_grabbing');
            sliderStart[`${sliderNum}`] = event.changedTouches[0].clientX;
            sliderActive[`${sliderNum}`] = true;
        }
        function sliderMouseMove(event) {
            if (sliderActive[`${sliderNum}`] === true) {
                sliderRow.style.transform = `translateX(${sliderTrans[`${sliderNum}`] + event.clientX - sliderStart[`${sliderNum}`]}px)`
            }
        }
        function sliderTouchMouseMove(event) {
            if (sliderActive[`${sliderNum}`] === true) {
                sliderRow.style.transform = `translateX(${sliderTrans[`${sliderNum}`] + event.changedTouches[0].clientX - sliderStart[`${sliderNum}`]}px)`
            }
        }
        function sliderMouseUp(event) {
            sliderRow.classList.remove('_grabbing')
            if (sliderRow.classList.contains('_slider-return-left') || sliderRow.classList.contains('_slider-return-right') || sliderRow.classList.contains('_slider-return-column') || (sliderActive[`${sliderNum}`] !== true)) {
                return
            }
            sliderActive[`${sliderNum}`] = false;
            sliderTrans[`${sliderNum}`] += event.clientX - sliderStart[`${sliderNum}`];
            if (sliderRow.getBoundingClientRect().left - sliderRow.parentNode.getBoundingClientRect().left > 0) {
                sliderNowColumn[`${sliderNum}`] = 0;
                sliderRow.style.transform = `translateX(0px)`;
                sliderRow.classList.add('_slider-return-left');
                setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-left');
                sliderTrans[`${sliderNum}`] = 0;
            } else if (sliderRow.getBoundingClientRect().right - slider.getBoundingClientRect().right < 0) {
                sliderNowColumn[`${sliderNum}`] = (sliderColumns[`${sliderNum}`].length) - 1;
                sliderRow.style.transform = `translateX(${-(sliderRow.clientWidth - sliderRow.parentNode.clientWidth)}px)`;
                sliderRow.classList.add('_slider-return-right');
                setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-right');
                sliderTrans[`${sliderNum}`] = -(sliderRow.clientWidth - sliderRow.parentNode.clientWidth);
            } else {
                let nowCoord = searchMinDiff(sliderTrans[`${sliderNum}`], sliderColumnsCoord[`${sliderNum}`]);
                sliderNowColumn[`${sliderNum}`] = sliderColumnsCoord[`${sliderNum}`].indexOf(nowCoord);
                if (dataSliderBring == true) {
                    if (sliderRow.clientWidth + nowCoord < slider.getBoundingClientRect().right) {
                        sliderRow.style.transform = `translateX(${-(sliderRow.clientWidth - sliderRow.parentNode.clientWidth)}px)`;
                        sliderRow.classList.add('_slider-return-column');
                        setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                        sliderTrans[`${sliderNum}`] = -(sliderRow.clientWidth - sliderRow.parentNode.clientWidth);
                        return;
                    }
                    sliderRow.style.transform = `translateX(${nowCoord}px)`;
                    sliderRow.classList.add('_slider-return-column');
                    setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                    sliderTrans[`${sliderNum}`] = nowCoord;
                }
            }
        }
        function sliderTouchMouseUp(event) {
            sliderRow.classList.remove('_grabbing')
            if (sliderRow.classList.contains('_slider-return-left') || sliderRow.classList.contains('_slider-return-right') || sliderRow.classList.contains('_slider-return-column') || (sliderActive[`${sliderNum}`] !== true)) {
                return
            }
            sliderActive[`${sliderNum}`] = false;
            sliderTrans[`${sliderNum}`] += event.changedTouches[0].clientX - sliderStart[`${sliderNum}`];
            if (sliderRow.getBoundingClientRect().left - sliderRow.parentNode.getBoundingClientRect().left > 0) {
                sliderNowColumn[`${sliderNum}`] = 0;
                sliderRow.style.transform = `translateX(0px)`;
                sliderRow.classList.add('_slider-return-left');
                setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-left');
                sliderTrans[`${sliderNum}`] = 0;
            } else if (sliderRow.getBoundingClientRect().right - slider.getBoundingClientRect().right < 0) {
                sliderNowColumn[`${sliderNum}`] = (sliderColumns[`${sliderNum}`].length) - 1;
                sliderRow.style.transform = `translateX(${-(sliderRow.clientWidth - sliderRow.parentNode.clientWidth)}px)`;
                sliderRow.classList.add('_slider-return-right');
                setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-right');
                sliderTrans[`${sliderNum}`] = -(sliderRow.clientWidth - sliderRow.parentNode.clientWidth);
            } else {
                let nowCoord = searchMinDiff(sliderTrans[`${sliderNum}`], sliderColumnsCoord[`${sliderNum}`]);
                sliderNowColumn[`${sliderNum}`] = sliderColumnsCoord[`${sliderNum}`].indexOf(nowCoord);
                if (dataSliderBring == true) {
                    if (sliderRow.clientWidth + nowCoord < slider.getBoundingClientRect().right) {
                        sliderRow.style.transform = `translateX(${-(sliderRow.clientWidth - sliderRow.parentNode.clientWidth)}px)`;
                        sliderRow.classList.add('_slider-return-column');
                        setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                        sliderTrans[`${sliderNum}`] = -(sliderRow.clientWidth - sliderRow.parentNode.clientWidth);
                        return;
                    }
                    sliderRow.style.transform = `translateX(${nowCoord}px)`;
                    sliderRow.classList.add('_slider-return-column');
                    setTimeout(objDeleteClass, 1000, sliderRow, '_slider-return-column');
                    sliderTrans[`${sliderNum}`] = nowCoord;
                }
            }
        }
    }
}
/*--Service function--*/
function objDeleteClass(obj, className) {
    obj.classList.remove(`${className}`);
}
function searchMinDiff(num, list) {
    let diffs = [];
    list.forEach(function(obj, index) {
        diffs.push(Math.abs(num - obj));
    })
    return list[diffs.indexOf(Math.min(...diffs))];
}
/*!---Slider---!*/
