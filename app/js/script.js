        
        // Получаем кнопки спойлера для секции about-life-space-section и записываем в переменную
        let buttonSpoiler = document.querySelectorAll(".button-spoiler");

        // Перебираем кнопки секции about-life-space-section и вешаем на них обработчики событий
        for(let i = 0; i < buttonSpoiler.length; i++) {
            buttonSpoiler[i].addEventListener("click", function(event){
                // Вызов функции спойлера с передачей активных классов кнопок и контейнеров секции about-life-space-section
                spoilerFunction(event, "button-spoiler--active", "content-spoiler--active")
            }, false);
        }

        // Получаем кнопки спойлера для секции organization-life-space-section и записываем в переменную
        let buttonSpoilerOrganization = document.querySelectorAll(".button-organization-spoiler");

        // Перебираем кнопки секции organization-life-space-section и вешаем на них обработчики событий
        for(let i = 0; i < buttonSpoilerOrganization.length; i++) {
            buttonSpoilerOrganization[i].addEventListener("click", function(event){
                // Вызов функции спойлера с передачей активных классов кнопок и контейнеров секции organization-life-space-section
                spoilerFunction(event, "button-organization-spoiler--active", "content-organization-spoiler--active")
            }, false);
        }

        // Функция спойлера
        function spoilerFunction(e, buttonActiveClass, contentActiveClass) {
            // Получаем кнопку по которой на которую произошло нажатие и записываем её в переменную
            let button = e.target;
            // Если у кнопки нет активного класса, то производим следующие действия
            if(!button.classList.contains(buttonActiveClass)) {
                // Удаляем активные классы у предыдущих элементов
                document.querySelector("." + buttonActiveClass).classList.remove(buttonActiveClass);
                document.querySelector("." + contentActiveClass).classList.remove(contentActiveClass);
                // Получаем дата атрибут у кнопки по которой произошло нажатие
                let data = button.getAttribute("data-spoiler");
                // Добавляем активный класс кнопке на которой произошло нажатие
                button.classList.add(buttonActiveClass);
                // Добавляем активный класс контенту у которого id совпадает с дата атрибутом нажатой кнопки
                document.getElementById(data).classList.add(contentActiveClass);
            }
        }

        // Получаем кнопку открытия и закрытия модального окна и само модальное окно
        let buttonModalOpen = document.getElementById("buttonModal");
        let modal = document.getElementById("modalMenu");
        let buttonModalClose = document.getElementById("buttonModalClose");

        // Добавляем обработчик события для открытия модальгого окна путём добавления активного класса
        buttonModalOpen.addEventListener("click", () => modal.classList.add("modal-menu--active"));
        // Добавляем обработчик события для закрытия модальгого окна путём удаления активного класса
        buttonModalClose.addEventListener("click", () => modal.classList.remove("modal-menu--active"));

        // Получаем ссылки в модальном окне
        let linkModal = document.querySelectorAll(".modal-menu__link");

        // Перебираем ссылки в модальном окне и вешаем на них обработчик для закрытия модального окна по клику на ссылку
        for(let i = 0; i < linkModal.length; i++) { 
            linkModal[i].addEventListener("click", () => modal.classList.remove("modal-menu--active"));
        }
        
        // Получаем шапку сайта
        let header = document.querySelector(".header");

        // Получаем координату нажней точки шапки и делим её на 2 получая высоту на которую нужно проскроллить
        let heightScroll = header.getBoundingClientRect().bottom / 2;
        
        // Получаем все ссылки для перехода по якорям
        let linkNav = document.querySelectorAll('[href^="#"]');

        // Скорость скролла(чем меньше тем быстрее)
        let speedScroll = 0.5;
        
        // Проходим по всем ссылкам с якорями
        for (let i = 0; i < linkNav.length; i++) {
            // Вешаем на ссылки обработчик события
            linkNav[i].addEventListener('click', function(e) {
                // Отменяем стандартное поведение
                e.preventDefault();
                // Получаем текущую высоту прокрутки
                let widnowHeight = window.pageYOffset;
                // Получаем id секции к которой нужно перейти с ссылки по которой произошло нажатие
                let	idLink = this.href.replace(/[^#]*(.*)/, '$1');
                // Получаем отступ до необходимой секции
                let topMarginSection = document.querySelector(idLink).getBoundingClientRect().top;
                // Стартовая точка
                let	start = null;
                // Функция для анимации, подробнее https://learn.javascript.ru/js-animation
                requestAnimationFrame(step);
                // Функция шага анимации
                function step(time) {
                    // Если стартовая точна равна нулю
                    if (start === null) { 
                        // Присваиваем стартовому значению значение time
                        start = time; 
                    }
                    // Вычисляем прогрес
                    let progress = time - start;
                    // Вычисляем количество пикселей на которое необходимо прокрутить
                    let	result = (topMarginSection < 0 ? Math.max(widnowHeight - progress/speedScroll, widnowHeight + topMarginSection) : Math.min(widnowHeight + progress/speedScroll, widnowHeight + topMarginSection));
                    // Прокручиваем на полученное количество пикселей
                    window.scrollTo(0, result);
                    // Если результат не равен сумме высоты прокрутки и отступа до необходимой секции
                    if (result != widnowHeight + topMarginSection) {
                        // Повторяем шаг анимации
                        requestAnimationFrame(step)
                    } else {
                        // Добавляем id секции в URL
                        location.href = idLink
                    }
                }
            }, false);
        }