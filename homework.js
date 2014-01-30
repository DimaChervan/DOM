(function(){
    document.addEventListener('DOMContentLoaded', init, false);
    var options = {
            popupWrapClassName : 'popup-wrap',
            popupClassName : 'popup',
            titleClassName : 'title',
            titleText : 'Переход на внешний ресурс',
            messageClassName : 'message',
            messageText : 'Вы уверены, что хотите перейти на ',
            buttonsWrapClassName : 'buttons-wrap',
            openButtonClassName : 'open',
            openButtonText : 'Да',
            closeButtonClassName : 'close',
            closeButtonText : 'Нет',
            linkClassName : 'popup-link',
            hideClassName : 'hide'
        },
        newCreatePopup;

    /**
     * Поиск элемента и установка на него события click
     * удаление эвента с документа
     */
    function init () {
        document.body.addEventListener('click', _onMouseClick, false);
        document.removeEventListener('DOMContentLoaded', init, false);
    }

    /**
     * Обработчик клика по ссылке с классом 'popup-link'
     * @param {Event} e событие клика
     * @private
     */
    function _onMouseClick (e) {
        e.preventDefault();
        if (e.target.classList.contains(options.linkClassName)) {
            openPopupFromLink(e.target);
        }
    }

    /**
     * Получает данные из ссылки
     * на основе этих данных создаёт попап или изменяет его содержимое (через createPopup)
     * @param {HTMLElement} link Ссылка с data-аттрибутами
     */
    function openPopupFromLink (link) {
        var href = link.href;
        if (newCreatePopup == undefined) {
            newCreatePopup = createPopup(href, onOk);
        }
        else {
            newCreatePopup(href, onOk);
        }
    }

    function onOk (href) {
        window.location = href;
    }



    /**
     * Скрывает попа с помощью добавления класса
     * @param {HTMLElement} popup попап :)
     */
    function onCancel (popup) {
        popup.classList.add(options.hideClassName);
    }

    /**
     * Создаёт DOM-узел с сообщением и добавляет его в DOM, после возвращает функцию для изменения попапа
     * @param {String} href адрес внешенго ресурса
     * @param {Function} onOk Обработчик клика по кнопке 'Да'
     * @returns {Function} возвращает функцию для изменения динамических данных
     */
    function createPopup (href, onOk) {
        var popupWrap = document.createElement('div'),
            popup = document.createElement('div'),
            title = document.createElement('div'),
            message = document.createElement('div'),
            buttonsWrap = document.createElement('div'),
            openButton = document.createElement('div'),
            closeButton = document.createElement('div'),
            onOpen = onOk,
            currentHref = href;

        popupWrap.className = options.popupWrapClassName;
        popup.className = options.popupClassName;
        title.className = options.titleClassName;
        title.textContent = options.titleText;
        message.className = options.messageClassName;
        message.textContent = options.messageText + href;
        buttonsWrap.className = options.buttonsWrapClassName;
        openButton.className = options.openButtonClassName;
        openButton.textContent = options.openButtonText;
        openButton.addEventListener('click', function () {
            onOpen(currentHref);
        }, false);
        closeButton.className = options.closeButtonClassName;
        closeButton.textContent = options.closeButtonText;
        closeButton.addEventListener('click', function () {
            onCancel(popupWrap);
        }, false);
        buttonsWrap.appendChild(openButton);
        buttonsWrap.appendChild(closeButton);
        popup.appendChild(title);
        popup.appendChild(message);
        popup.appendChild(buttonsWrap);
        popupWrap.appendChild(popup);
        document.body.appendChild(popupWrap);
        return function (href,onOk) {
            currentHref = href;
            onOpen = onOk;
            message.textContent = options.messageText + href;
            if (popupWrap.classList.contains(options.hideClassName)) {
                popupWrap.classList.remove(options.hideClassName);
            }
        }
    }
})();
