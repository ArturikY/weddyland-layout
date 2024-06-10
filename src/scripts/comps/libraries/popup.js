'use strict'
/*---Popup---*/
//Ссылка открывающая popup должна иметь также класс popup__link а также атрибут data-popup-link значение которого должно быть равно значению артибута data-popup-name у popup'а, у элемента при нажатии которого popup должен закрываться должен быть класс popup__close, также можно указать у одного элемента сразу 2 класса: popup__Link и popup__close(+ атрибут data-popup-toggle со значением link) использовать для burger-menu
const popups = document.querySelectorAll('.popup');
if (popups.length > 0) {
    const popupLinks = document.querySelectorAll('.popup__link');
    popupLinks.forEach(function(link) {
        link.addEventListener('click', popupLinkClick)
    })
    popups.forEach(function(popup) {
        document.querySelectorAll('.popup__close').forEach(function(c) {
            c.addEventListener('click', popupClose)
        })
    })
    function popupLinkClick(event) {
        let link = event.target.classList.contains('popup__link') == true ? event.target : event.target.closest('.popup__link')
        if (link.classList.contains('popup__close') && link.classList.contains('popup__link')) {
            if (link.getAttribute('data-popup-toggle') != 'link') {
                event.preventDefault()
                return  
            }
        }
        popups.forEach(function(popup) {
            if (popup.getAttribute('data-popup-name') == link.getAttribute('data-popup-link')) {
                document.querySelector('body').classList.add('_popup-active')
                popup.classList.add('_active')
                event.preventDefault()
                if (link.classList.contains('popup__close') && link.classList.contains('popup__link')) {
                    setTimeout(popupLinkClose, 10, link, 'close')
                }
                return
            }
        })
    }
    function popupClose(event) {
        let close = event.target.closest('.popup__close') != undefined ? event.target.closest('.popup__close') : event.target
        if (close.classList.contains('popup__close') && close.classList.contains('popup__link')) {
            if (close.getAttribute('data-popup-toggle') != 'close') {
                event.preventDefault()
                return  
            }
        }
        if (close.getAttribute('data-popup-close') != undefined) {
            document.querySelector(`.${event.target.closest('.popup__close').getAttribute('data-popup-close')}`).classList.remove('_active')
        } else {
            close.closest('.popup').classList.remove('_active')
        }
        document.querySelector('body').classList.remove('_popup-active')
        if (close.classList.contains('popup__close') && close.classList.contains('popup__link')) {
            setTimeout(popupLinkClose, 10, close, 'link')
        }
        event.preventDefault()
    }
    function popupLinkClose(obj, val) {
        obj.setAttribute('data-popup-toggle', val)
    }
}
/*!---Popup---!*/