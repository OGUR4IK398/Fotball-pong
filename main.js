/// Функция рандома
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Состояние счёта
score = {
    left: 0,
    right: 0,
    date: 0,
    time: 0,
};

// Обработчик события клик по мячу
$('.ball').on('click', function () {
    // Получение рандомного числа для высоты
    var random = getRandomInt(84);


    // Проверка на позицию мяча
    // Получение значения свойства css
    var left = parseInt($('.ball').css("left"));

    if (left === 0) {

        // Анимация удара
        $('.ball').animate({
            left: '90%',
            top: random + '%',
        }, 1000);
    } else {

        // Анимация удара
        $('.ball').animate({
            left: '0%',
            top: random + '%',
        }, 1000);
    }


    /// Проверка на гол
    // Функция гола и записи счета
    function goal() {
        // Получение значений свойств css
        var top = parseInt($('.ball').css("top"));
        var left = parseInt($('.ball').css("left"));

        /// Получение процентов для определения положения мяча
        // Получение высоты поля
        let fieldHeight = $('.football').height();

        // Получение процента top от fieldHeight
        let topPersent = Math.floor(top / fieldHeight * 100);

        // Проверка на мяч в воротах
        if (topPersent >= 30 && topPersent <= 52) { // Значения в процентах от размера поля
            alert('ГОЛ!');

            // В каких воротах
            if (left === 0) {
                score.right += 1;
            } else {
                score.left += 1;
            }

            // Вывод счёта
            console.log('Счёт: ' + score.left + " : " + score.right);
            $('.score').text(score.left + " : " + score.right);
        }
    }

    // Запуск функции через время
    setTimeout(goal, 1000);


});




/// Сохранение значений в localStorage игры
// Получение кнопок меню
let saveScore = $('.saveScore');
let newGame = $('.newGame');
let saveList = $('.saveList');
let saves = $('.saves');



// Назначение новых методов для Storage 
Storage.prototype.setObj = function (key, obj) {
    return this.setItem(key, JSON.stringify(obj));
};

Storage.prototype.getObj = function (key) {
    return JSON.parse(this.getItem(key));
};

// Обработчик нажатия на Saves
saves.on('click', function(){
    localStorage.setItem('games', JSON.stringify([{},{},{},{},{}]));
});

// Обработчик нажатия на Save Score
saveScore.on('click', function () {

    // Добавление даты и времени для сохранения 
    let now = new Date();

    // Получние месяца
    let month = now.getMonth() + 1;
    if (month < 10) {
        month = '0' + month;
    }

    // Получение дня месяца
    let day = now.getDate();
    if (day < 10) {
        day = '0' + day;
    }

    // Сборка даты
    let date = day + '.' + month;

    // Получение минут
    let minutes = now.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Получение часов
    let hours = now.getHours();
    if (hours < 10) {
        hours = '0' + hours;
    }

    // Сборка времени 
    let time = hours + ':' + minutes;



    // Добавление свойств объекта
    score['date'] = date;
    score['time'] = time;

    // Выбор позиции сохранения
    let savePlace = 1;
    let list = $('.list');
    let position = 0;

    // Использование промис, чтобы после открытия окна
    // Выводилось сообщение о выборе ячейки
    let promise = new Promise(function (resolve, reject) {
        // получение массива
        let games = localStorage.getObj('games');
        
        modalShow(modal, games);
        setTimeout(() => resolve('done'), 500);
    });

    promise.then(function () {
            savePlace = prompt('В какую ячейку сохранить?')
        })
        .then(function () {
            let games = localStorage.getObj('games');
            //    console.log(games);

            // Добавляем значение счета для этой партии в массив "игры"
            games[savePlace - 1] = score;

            // Отправляем новый массив в localStorage
            localStorage.setItem('games', JSON.stringify(games));
            
            // Прописываем значения в Saved Games
            // Получение класса нужного элемента
            let savePoint = '.' + 's' + savePlace;
            
            // Запись значений в элемента
            $(savePoint).text(score.left + ":" + score.right  + " Date: " + score.date + " " + score.time);
        });
});



// Обработчик нажатия на New Game
newGame.on('click', function () {

    // Обнуления счета
    score['right'] = 0;
    score['left'] = 0;

    // Обнуление положения мяча
    $('.ball').css({
        'left': '410px',
        'top': '255px'
    });

    // Вывод нового счета
    console.log('Счёт: ' + score.left + " : " + score.right);
    $('.score').text(score.left + " : " + score.right);
});



/// Всплывающее окно

// Флажок открытия окна
let mStatus = false;
// Получение элемента затемнения
const overlay = document.querySelector('.overlay');
// Получение кнопки закрытия
let mClose = document.querySelector('.closer');
// Получение элемента всплывающего окна
let modal = document.querySelector('.dlg-modal');


// Функция modalShow
function modalShow(modal, games) {
    
    // Парсинг сохраненных игр из localSotarge в окошко
    
    for (let i = 0; i < 5; i++){
        // Собираем класс эелмента
        let savePoint = '.' + 's' + (i + 1);
        if ($.isEmptyObject(games[i])){
            // Пишем стандартную фразу если нет сохранения
            $(savePoint).text('Сохранение ' + (i + 1));
        } else {
        
            // Прописываем согласно localStorage значения
            $(savePoint).text(games[i].left + ":" + games[i].right  + " Date: " + games[i].date + " " + games[i].time);
        };
    };
    
    // Показываем подложку всплывающего окна
    overlay.classList.remove('fadeOut');
    overlay.classList.add('fadeIn');

    // Запускаем анимацию окна
    modal.classList.remove('fadeOut');
    modal.classList.add('fadeIn');

    mStatus = true;
};

function modalClose(modal){
    // Закрываем подложку
    overlay.classList.remove('fadeIn');
    overlay.classList.add('fadeOut');

    // Закрываем окно
    modal.classList.remove('fadeIn');
    modal.classList.add('fadeOut');

    mStatus = true;
};


// Обработчик нажатия на кнопки Save List
saveList.on('click', function () {
    
    // Получаем массив данных из localStorage
    let games = localStorage.getObj('games');
    
    // Запуск функции показа окна
    modalShow(modal, games);

});


// Закрытие
mClose.addEventListener('click', function () {

    // Функция закрытия
    modalClose(modal);

});





/// Кнопки load - загрузка прошлых игр
// Получение кнопок
let load1 = $('.load1');
let load2 = $('.load2');
let load3 = $('.load3');
let load4 = $('.load4');
let load5 = $('.load5');

// Добавление обработчика нажатия на каждую из кнопок

// load1
load1.on('click', function(){
    // Получение массива games из localStorage
    let games = localStorage.getObj('games');
    // Загрузка сохранения
    score = games[0];
    console.log('Счёт: ' + score.left + " : " + score.right);
    $('.score').text(score.left + " : " + score.right);
    
    // Закрытие окна
    modalClose(modal);

});

// load2
load2.on('click', function(){
    // Получение массива games из localStorage
    let games = localStorage.getObj('games');
    // Загрузка сохранения
    score = games[1];
    console.log('Счёт: ' + score.left + " : " + score.right);
    $('.score').text(score.left + " : " + score.right);
    // Закрытие окна
    modalClose(modal);

});

// load3
load3.on('click', function(){
    // Получение массива games из localStorage
    let games = localStorage.getObj('games');
    // Загрузка сохранения
    score = games[2];
    console.log('Счёт: ' + score.left + " : " + score.right);
    $('.score').text(score.left + " : " + score.right);
    // Закрытие окна
    modalClose(modal);

});

// load4
load4.on('click', function(){
    // Получение массива games из localStorage
    let games = localStorage.getObj('games');
    // Загрузка сохранения
    score = games[3];
    console.log('Счёт: ' + score.left + " : " + score.right);
    $('.score').text(score.left + " : " + score.right);
    // Закрытие окна
    modalClose(modal);

});

// load5
load5.on('click', function(){
    // Получение массива games из localStorage
    let games = localStorage.getObj('games');
    // Загрузка сохранения
    score = games[4];
    console.log('Счёт: ' + score.left + " : " + score.right);
    $('.score').text(score.left + " : " + score.right);
    // Закрытие окна
    modalClose(modal);

});
//              # МБ разнести функции обработка кнопок по разным файлам
