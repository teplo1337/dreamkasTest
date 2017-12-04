# dreamkasTest
Как все работает на данный момент: http://test.kekcheburek.ru/

Back-end на node.js + express "server.js"

Front-end на javascript "app/public/js/script.js"

База данных: PostgreSQL "db.elephantsql.com:5432/dlumhzyl"

Статик на NGINX

    server {
        listen       8080;
        server_name  test.kekcheburek.ru;
        location / {
            proxy_pass http://localhost:8090/;
        }
    }
    server {
        listen       8080;
        server_name  static.kekcheburek.ru;
        location ~ \.(gif|jpg|png|css|js)$ {
           root app/public;
       }
    }

# Задание

К тебе обратился знакомый фотограф с просьбой сделать одностраничный сайт-портфолио.

Задача: сделать простое портфолио фотографа.

Мокап тут: https://1drv.ms/i/s!AgKyCrqi_08vpIp-XiuyDbPEQ1l1Vw

Завести git-репозиторий на (github/bitbucket/тд).
Все дальнейшие пункты должны фиксироваться коммитами в этот репозиторий.

Сделать форму для загрузки изображения с двумя полями - "Название" и "Файл".
Изображение должно отправляться на сервер ajax запросом, без перезагрузки страницы.
Использование фреймов не допускается.

Изображения складываются в публичную папку, информация об изображениях складывается
в базу данных PostgreSQL. Схема базы на своё усмотрение.

Сверстать страницу простым гридом (пример на мокапе).

Реализовать бесконечную подгрузку изображений и добавление их в сетку при прокрутке страницы.

Реализовать функционал "Показать случайное изображение" (ajax запрос на сервер).

С помощью Nginx реализовать отдачу изображений с другого субдомена, например static.domain.com.

Прочее: жирными плюсами будут наличие таких вещей, как unit-тесты, использование линтера, комментарии, чистота кода.

Стек:

Бэк: Node.js (желательно, ES6/ES7)
Фронт: по желанию (желательно, angular или react)
Прокси-сервер: Nginx
БД: PostgreSQL
Желаем удачи!
