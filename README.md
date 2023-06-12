Для запуска необходимо
Установить зависомости для сервера
```cmd
cd server
npm i
```

Настроить окружение в файле ```.development.env```
| Название переменной окружения | Описание переменной окружения|
|---|---|
|PORT |	Порт работы сервера приложения|
|CLIENT_HOST |	Хост клиента приложения|
|POSTGRES_HOST |	Хост базы данных Postgres|
|POSTGRES_USER |	Имя пользователя Postgres|
|POSTGRES_DB |	Название базы данных Postgres|
|POSTGRES_PASSWORD |	Пароль пользователя Postgres|
|POSTGRES_PORT |	Порт Postgres|
|JWT_PRIVATE_KEY |	Случайный ключ для генерации JWT|
|COMMISSION_PERCENT |	Процент комиссии сервиса|
|YOOKASSA_SHOP_ID |	Идентификатор магазина Юкасса|
|YOOKASSA_SECRET |	Token магазина Юкасса|
|YOOKASSA_PAYOUTS_AGENT_ID |	Agent Id шлюза выплат Юкасса|
|YOOKASSA_PAYOUTS_SECRET |	Token шлюза выплат Юкасса|
|DOMAIN_NAME |	Имя домена сайта|
|MAX_PAYOUT_AMOUNT |	Максимальная сумма выплаты в копейках|
|MIN_PAYOUT_AMOUNT |	Минимальная сумма выплаты в копейках|

Собрать приложение
```cmd
npm run build
```
Установить зависимости для клиента
```cmd
cd ../client
npm i
```
Настроить окружение в файле ```.env.local```
| Название переменной окружения | Описание переменной окружения|
|---|---|
|NEXT_PUBLIC_DOMAIN|Навание домена|
|NEXT_PUBLIC_STATIC_HOST|Хост сервера статики|
|SERVER_HOST|Хост сервера|

Собрать приложение

```cmd
npm run build
```

Перемещаемся в корневую директорию и запускаем сборку
```cmd
cd ..
docker-compose up --build
```
Приложение готово к эксплуатации