(function(){
    document.body.addEventListener('click', _onMouseClick, true);

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
        var currentHref = href,
            messageClassName = 'message',
            messageText = 'Вы уверены, что хотите перейти на ',
            openButtonClassName = 'open',
            closeButtonClassName = 'close',
            hideClassName = 'hide',
            popupDomObject = {
                tagName : 'div', className : 'popup-wrap', childElement : [
                    { tagName: 'div', className : 'popup', childElement: [
                        { tagName: 'div', className : 'title', textContent : 'Переход на внешний ресурс' },
                        { tagName: 'div', className : messageClassName },
                        { tagName: 'div', className : 'buttons-wrap', childElement: [
                            { tagName: 'div', className : openButtonClassName, textContent : 'Да' },
                            { tagName: 'div', className : closeButtonClassName, textContent : 'Нет' }
                        ]
                        }
                    ]
                    }
                ]
            },
            popup = createDom (popupDomObject),
            messageNode = createDom.elements[messageClassName][0];
        messageNode.innerHTML = messageText + href;
        createDom.elements[closeButtonClassName][0].addEventListener('click',function(){
            popup.classList.add(hideClassName);
        });
        createDom.elements[openButtonClassName][0].addEventListener('click',function(){
            onOk(currentHref);
        });
        document.body.appendChild(popup);
        return function (href) {
            currentHref = href;
            messageNode.innerHTML = messageText + href;
            popup.classList.remove(hideClassName);
        }
    }

    // Стоит ли переместить функцию ниже в createPopup ?
    function createDom (domObject) {
        var element = document.createElement(domObject.tagName);
        element.className = domObject.className;
        if (domObject.textContent) {
            element.innerHTML = domObject.textContent;
        }
        if (domObject.childElement) {
              domObject.childElement.forEach(function (item) {
                  element.appendChild(createDom(item));
              });
        }
        if (!createDom.elements[domObject.className]) {
            createDom.elements[domObject.className] = [];
        }
        createDom.elements[domObject.className].push(element);
        return element;
    }
    createDom.elements = {};
})();
