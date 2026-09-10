# Проектная работа "Веб-ларек"

Интернет-магазин с товарами для веб-разработчиков — Web-ларёк. В нём можно посмотреть каталог товаров, добавить товары в корзину и сделать заказ.

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/api/ — API-клиент магазина
- src/components/models/ — модели данных
- src/components/views/ — компоненты интерфейса

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/utils/product.ts — цена, адрес изображения и категория товара

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

Паттерн MVP:
- модели — данные каталога, корзины и заказа
- представления — DOM и действия пользователя
- презентер — src/index.ts, создаёт экземпляры и связывает слои

Связь идёт через EventEmitter. Представления не обращаются к моделям и API. Модели ничего не знают о DOM.

Базовые классы:
- Api — GET- и POST-запросы, обработка ответа сервера (get, post, handleResponse)
- EventEmitter — подписка, отписка и вызов слушателей (on, off, emit, trigger)
- Component — базовый класс представлений: корневой DOM-элемент, render, setText, setImage, toggleClass, setDisabled, setChildren. Узлы DOM кэшируются в полях класса

API:
- WebLarekApi — наследник Api getProducts() загружает каталог, createOrder(order) отправляет заказ

Модели:
- CatalogModel — каталог и выбранный товар. setProducts превращает данные API в данные для карточек. Методы: setProducts, getProducts, getProduct, select, getSelected
- BasketModel — товары в корзине без повторов, товар без цены добавить нельзя. Методы: add, remove, clear, has, getItems, getTotal
- OrderModel — оплата, адрес, почта и телефон. Методы: setField, getData, validate, clear

Представления. Карточки, корзина, формы и окно успеха создаются из шаблонов главной страницы. Page и Modal работают с уже существующими элементами.
- Page — каталог, счётчик корзины, блокировка прокрутки (setCatalog, setCounter, setLocked)
- Modal — модальное окно (setContent, open, close). Закрывается по крестику и по клику на оверлей, клик внутри окно не закрывает
- CatalogCard — карточка в каталоге
- PreviewCard — подробная информация, кнопки «Купить» и «Убрать»
- BasketItem — строка товара в корзине
- Basket — список выбранных товаров, сумма и кнопка оформления
- Form — общая работа форм: значения, ошибки, доступность кнопки
- OrderForm — способ оплаты и адрес
- ContactsForm — почта и телефон
- Success — сообщение об успешном заказе и списанная сумма

Типы данных (src/types/index.ts):
- IProduct — товар из API
- IProductView — товар для карточки
- IOrderRequest / IOrderResult — заказ на сервер и ответ сервера
- IBuyerDraft / FormErrors — данные форм и ошибки полей
- IShopApi — интерфейс API-клиента
- ICatalogModel, IBasketModel, IOrderModel — интерфейсы моделей
- IPageView, IModalView, IFormView — интерфейсы представлений
- AppEvents / IAppEventMap — имена событий и их данные

Как взаимодействуют части приложения:
презентер в src/index.ts подписывается на события View и моделей. Каталог приходит через API, CatalogModel сохраняет его и сообщает об изменении — презентер рисует CatalogCard. Клик по карточке открывает PreviewCard. Корзина меняется через BasketModel, после этого обновляются счётчик и список. Заказ из двух шагов: сначала оплата и адрес, затем почта и телефон; кнопка шага недоступна, пока поля не заполнены. После POST /order показывается Success, корзина и формы очищаются.


https://github.com/SayNyaOrDie/web-larek-frontend