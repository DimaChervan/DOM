(function(){
    document.body.addEventListener('click', _onMouseClick, false);

    /**
     * Обработчик клика по ссылке с классом 'popup-link'
     * @param {Event} e событие клика
     * @private
     */
    function _onMouseClick (e) {
        e.preventDefault();
        if (e.target.classList.contains('popup-link')) {
            openPopupFromLink(e.target);
        }
    }

    /**
     * Получает данные из ссылки
     * на основе этих данных создаёт попап или изменяет его содержимое (через createPopup)
     * @param {HTMLElement} link Ссылка с data-аттрибутами
     */
    function openPopupFromLink (link) {
        var href = link.href,
            newCreatePopup;
        function onOk (href) {
            window.location = href;
        }
        newCreatePopup = createPopup(href, onOk);
        openPopupFromLink = function(link) {
            href = link.href;
            newCreatePopup(href);
        }
    }

    /**
     * Создаёт DOM-узел с сообщением и добавляет его в DOM, после возвращает функцию для изменения попапа
     * @param {String} href адрес внешенго ресурса
     * @param {Function} onOk Обработчик клика по кнопке 'Да'
     * @returns {Function} возвращает функцию для изменения динамических данных
     */
    function createPopup (href, onOk) {
        var popupWrap = document.createElement('div'),
            currentHref = href,
            message, openButton, closeButton,
            options = {
                popupWrapClassName : 'popup-wrap',
                popupClassName : 'popup',
                titleClassName : 'title',
                messageClassName : 'message',
                messageText : 'Вы уверены, что хотите перейти на ',
                buttonsWrapClassName : 'buttons-wrap',
                openButtonClassName : 'open',
                closeButtonClassName : 'close',
                hideClassName : 'hide'
            };

        popupWrap.className = options.popupWrapClassName;
        popupWrap.innerHTML = '<div class=' + options.popupClassName + '>' +
                                    '<div class=' + options.titleClassName + '>Переход на внешний ресурс</div>' +
                                    '<div class=' + options.messageClassName + '>' + options.messageText + href + '</div>' +
                                    '<div class=' + options.buttonsWrapClassName + '>' +
                                    '<div class=' + options.openButtonClassName + '>Да</div>' +
                                    '<div class=' + options.closeButtonClassName + '>Нет</div>' +
                                    '</div>' +
                               '</div>';
        openButton = popupWrap.getElementsByClassName(options.openButtonClassName)[0];
        openButton.addEventListener('click', function () {
            onOk(currentHref);
        }, false);
        openButton = undefined;
        closeButton = popupWrap.getElementsByClassName(options.closeButtonClassName)[0];
        closeButton.addEventListener('click', function () {
            popupWrap.classList.add(options.hideClassName);
        }, false);
        closeButton = undefined;
        message = popupWrap.getElementsByClassName(options.messageClassName)[0];
        document.body.appendChild(popupWrap);
        return function (href) {
            currentHref = href;
            message.innerHTML = options.messageText + href;
            popupWrap.classList.remove(options.hideClassName);
        }
    }
})();
