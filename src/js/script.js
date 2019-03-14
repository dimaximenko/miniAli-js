window.addEventListener('DOMContentLoaded', () => {
    const  loadContent = async (url, callback) => {
        await fetch(url) //обещание
            .then(response => response.json()) //обещание перевести в обычный объект
            .then(json => createElement(json.goods));
        
        callback();
    }
    
    function createElement(arr) {
        const goodsWrapper = document.querySelector('.goods__wrapper');
    
        arr.forEach(function(item) {
            let card = document.createElement('div');
            card.classList.add('goods__item');
            card.innerHTML = `
                    <img class="goods__img" src="${item.url}" alt="phone">
                    <div class="goods__colors">Доступно цветов: 4</div>
                    <div class="goods__title">
                        ${item.title}
                    </div>
                    <div class="goods__price">
                        <span>${item.price}</span> руб/шт
                    </div>
                    <button class="goods__btn">Добавить в корзину</button>
            `;
    
            goodsWrapper.appendChild(card);
        });
    }
    
    loadContent('js/db.json', () => {
        const  cartWrapper = document.querySelector('.cart__wrapper'),
            cart = document.querySelector('.cart'),
            close = document.querySelector('.cart__close'),
            open = document.querySelector('#cart'),
            goodsBtn = document.querySelectorAll('.goods__btn'),
            products = document.querySelectorAll('.goods__item'),
            confirm = document.querySelector('.confirm'),
            badge = document.querySelector('.nav__badge'),
            totalCost = document.querySelector('.cart__total > span'),
            titles = document.querySelectorAll('.goods__title');
    
        //создаем функцию на открытие корзины
        function openCart() {
            cart.style.display = 'block';
            document.body.style.overflow = 'hidden'; //обращаемся к значению overflow и меняем его
        }
    
        //создаем функцию на закрытие корзины
        function closeCart() {
            cart.style.display = 'none';
            document.body.style.overflow = ''; //так же меняем значение оверфлоу, для упрощения записи написали просто ''
        }
    
        //слушаем клик на корзину и вызываем функцию
        open.addEventListener('click', openCart);
        //слушаем клик на корзину и вызываем функцию
        close.addEventListener('click', closeCart);
    
        goodsBtn.forEach(function(btn, i) {
            btn.addEventListener('click', () => {
                let item = products[i].cloneNode(true), //клонируем продукт
                    trigger = item.querySelector('button'), //кликаем на кнопку продукта который копируем
                    removeBtn = document.createElement('div'), // создаём новую переменну для удаления продукта
                    empty = cartWrapper.querySelector('.empty'); //получаем сообщение, что корзина пуста
                
                trigger.remove();
    
                showConfirm();
                            
                removeBtn.classList.add('goods__item-remove');
                removeBtn.innerHTML = '&times';
                item.appendChild(removeBtn);    
    
                cartWrapper.appendChild(item); //добавляем в корзину продукт
                //убираем надпись ваша корзина пуста
                if (empty) {
                    empty.style.display = 'none';
                }
    
                calcGoods();
                calcTotal();
                removeFromCart();
    
            });
        });
    
    
        function sliceTitle() {
            titles.forEach(function(item) {
                if (item.textContent.length < 70) { //проверяем длину описания продукта
                    return;
                } else {
                    const str = item.textContent.slice(0, 70) + '...';
                    //const str = `${item.textContent.slice(0, 70)} ...`; ES6
                    item.textContent = str;
                }
            });
        }
        sliceTitle();
    
        function showConfirm() { //делаем загрузчик
            confirm.style.display = 'block';
            let counter = 100;
            const id = setInterval (frame, 10);

            function frame() {
                //логика анимации
                if (counter == 10) {
                    clearInterval(id);
                    confirm.style.display = 'none';
                } else {
                    counter--;  //counter = counter -1; 
                    confirm.style.transform = `translateY(-${counter}px)`; //блок confirm будет сдвгаться по оси У вверх (-); знак `` используется потому что только в них можно поставить $
                    confirm.style.opacity = '.' + counter; //анимация будет плавно становиться прозрачной (opacity)
                }
            }
        }
        //setInterval(sliceTitle, 30) - запускает скрипт каждый отрезок времени (каждые 30 сек, напримерs)
        //setTimeout(sliceTitle, 30) - запускает скрип через определенное время (30 сек, например)
    
        //Калькулятор количества товаров
        function calcGoods() {
            const items = cartWrapper.querySelectorAll('.goods__item');
            //алгоритм: изначально длина массива в корзине равняется нулю, при каждом добавлении товара мы делаем 1 + длина массива(изначально ноль)
            let empty = cartWrapper.querySelector('.empty'); //находим фразу нет товаров в корзине
            badge.textContent = items.length; //считает к-во элементов в корзине
            if (badge.textContent < 1) { //проверяем есть ли товары в корзине
                empty.style.display = 'block'; //если товаров в корзине нет, то меняем стиль у фразы нет товаров в корзине на блок т.к изначально он был none
            }
            
        }
    
        function calcTotal() {
            const prices = document.querySelectorAll('.cart__wrapper > .goods__item > .goods__price > span'); //находим span
            let total = 0;  //общее кол-во денег
            prices.forEach(function(item) {
                total += +item.textContent; //вытаскиваем значение цены
                //+= сокращенная форма записи чтобы добавлять значения, +item.textContent (+)  - делает из строчного элемента числовой
            });
            totalCost.textContent = total; //добавляем общую цену
            
        }
    
        function removeFromCart() { 
            const removeBtn = cartWrapper.querySelectorAll('.goods__item-remove'); //получаем кнопки-крестики
            removeBtn.forEach(function(btn) { //перебираем каждый крестик
                btn.addEventListener('click', () => { //вешаем слушатель на нажатие кнопки крестика
                    btn.parentElement.remove(); //удаляем родителя крестика
                    calcGoods(); //пересчитываем товары
                    calcTotal(); //пересчитываем сумму
                
                });
            });
        }
    });
});




















//const example = {username: "Ivan"};


//fetch('https://jsonplaceholder.typicode.com/posts',
//    {
//        method: "POST",
//        body: JSON.stringify(example)
//    }) //обещания - promise
//  .then(response => response.json()) //обещания из js в json превратить
//  .then(json => console.log(json)) //выводим в консоль


//переменные - var, let, const;

//var - переменную можно использовать только когда она объявлена
    //(hosting) -  
//    console.log(a); //переменная еще пустая (undefined), но переменная будет существовать до того как она объявлена. т.к. интерпретатор объявляет все переменные изначально
//    var a = 5; // в переменную помещено число 5
//    console.log(a); //выводит значение переменной - 5

//let - переменную можно использовать только когда она объявлена
//    console.log(a); //переменная не существует, тип данных (is not defined)
//    let a = 5; // в переменную помещено число 5
 //   console.log(a); //выводит значение переменной - 5

//const - желательно использовать, но переменная которая 100% будет меняться указывать через let
//    const a = 5; // в переменную помещено число 5
//    console.log(a); //выводит значение переменной - 5
//    a = 10; //невозможно перезаписать константу. (let и var можно перезаписать)
//    console.log(a); //


 //   const a = {
 //       name: 'Alex' 
 //   };
//    a.name = 'Ivan'; //const можно поменять. Мутирует объект (иммутабельность)
//    console.log(a); 