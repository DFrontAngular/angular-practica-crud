# Backend API - Angular CRUD Practice

Backend de práctica construido con NestJS para dar soporte a una aplicación Angular de gestión de coches.

Este backend ya incorpora autenticación basada en cookies `HttpOnly`, refresh token rotado, roles, validaciones, Swagger, carga de dataset, catálogo de marcas y modelos, y un CRUD completo de coches con paginación y filtros.

## Stack

- NestJS 10
- TypeScript
- `class-validator`
- `class-transformer`
- `@nestjs/swagger`
- JWT con `passport-jwt` usado dentro de un flujo de cookies `HttpOnly`

## Objetivo de este backend

Este backend está pensado para que el frontend practique contra una API realista sin tener que construir también toda la parte servidor desde cero.

Permite trabajar en dos niveles:

- nivel base: consumo de API, tablas, detalle, formularios, validaciones y CRUD
- nivel avanzado: login real, refresh de sesión, guards de Angular, control por roles, paginación y filtros

## Puesta en marcha

```bash
cd backend
npm install
npm run start:dev
```

Servidor disponible en:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Scripts disponibles

```bash
npm run start
npm run start:dev
npm run start:debug
npm run start:prod
npm run build
npm run lint
npm run test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## Configuración por entorno

El archivo actual es `backend/.env`.

```env
AUTH_ENABLED=true
JWT_SECRET=super-secret-key-123
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
ACCESS_TOKEN_COOKIE_MAX_AGE_MS=900000
REFRESH_TOKEN_COOKIE_MAX_AGE_MS=604800000
AUTH_COOKIE_PATH=/
AUTH_COOKIE_SAME_SITE=lax
AUTH_COOKIE_SECURE=false
API_DELAY_ENABLED=true
API_DELAY_MIN_MS=200
API_DELAY_MAX_MS=900
```

### `AUTH_ENABLED`

Controla si el backend exige autenticación real o si entra en modo bypass.

#### `AUTH_ENABLED=true`

Modo autenticado real:

- hay que hacer login contra `POST /auth/login`
- la sesión se apoya en cookies `HttpOnly`
- el frontend debe renovar sesión con `POST /auth/refresh` cuando corresponda
- el frontend debe cerrar sesión con `POST /auth/logout`
- `GET /auth/me` devuelve el usuario autenticado
- crear, editar y borrar coches requiere rol `ADMIN`

#### `AUTH_ENABLED=false`

Modo aprendizaje o bypass:

- el backend no exige token real
- el guard inyecta un usuario ficticio con rol `ADMIN`
- se puede trabajar primero el CRUD sin implementar login en Angular

Esto está pensado para que perfiles junior o en reciclaje puedan empezar por integración y formularios, y dejar autenticación para una segunda fase.

### `JWT_SECRET`

Se usa para firmar y validar tokens JWT.

### Duracion de sesion y cookies

La practica usa dos tiempos de sesion realistas por defecto:

- `access token`: `15m`
- `refresh token`: `7d`

Esto obliga a que el frontend entienda y gestione renovacion de sesion sin caer en el patron irreal de un token manual eterno en cliente.

Variables relacionadas:

- `ACCESS_TOKEN_EXPIRES_IN`: expiracion JWT del access token
- `REFRESH_TOKEN_EXPIRES_IN`: expiracion JWT del refresh token
- `ACCESS_TOKEN_COOKIE_MAX_AGE_MS`: vida de la cookie `access_token` en navegador
- `REFRESH_TOKEN_COOKIE_MAX_AGE_MS`: vida de la cookie `refresh_token` en navegador
- `AUTH_COOKIE_PATH`: rutas en las que el navegador enviara las cookies
- `AUTH_COOKIE_SAME_SITE`: politica anti-CSRF del navegador (`lax`, `strict`, `none`)
- `AUTH_COOKIE_SECURE`: si es `true`, la cookie solo viaja por HTTPS

Recomendacion de trabajo:

- local con proxy Angular: `AUTH_COOKIE_PATH=/`, `AUTH_COOKIE_SAME_SITE=lax`, `AUTH_COOKIE_SECURE=false`
- produccion con HTTPS: `AUTH_COOKIE_PATH=/`, `AUTH_COOKIE_SAME_SITE=lax` o `strict`, `AUTH_COOKIE_SECURE=true`

Nota importante sobre `AUTH_COOKIE_PATH`:

- el navegador decide si envia una cookie segun la ruta publica que ve
- si el frontend usa un proxy con prefijos como `/api`, una cookie demasiado restringida puede no viajar aunque el backend internamente trabaje en `/auth`
- por eso `/` es la opcion mas robusta para este proyecto

## Arquitectura actual

Módulos cargados en `AppModule`:

- `AuthModule`
- `CarsModule`
- `BrandsModule`
- `SeedModule`

## Comportamiento general de la API

### Datos en memoria

No hay base de datos. Los coches se almacenan en memoria dentro del servicio.

Esto implica:

- si reinicias el backend, se pierde el estado anterior
- al arrancar, se generan coches de ejemplo automáticamente
- el endpoint de seed puede sobrescribir el estado con un dataset fijo

### Swagger

El backend expone documentación interactiva en:

```txt
http://localhost:3000/api-docs
```

Además, al arrancar genera `swagger.json` en la carpeta `backend/`.

### CORS

Este backend no expone una whitelist permisiva para `localhost` en desarrollo.

Eso es intencional.

Objetivo:

- evitar una integración artificial basada en abrir CORS por comodidad
- forzar que el frontend se configure con un enfoque más cercano a un proyecto real

Consecuencia práctica:

- si el frontend intenta atacar la API como origen distinto sin preparar correctamente su integración, aparecerán problemas de CORS

El README no da una receta cerrada para resolverlo a propósito. Esa parte forma parte del trabajo de integración frontend.

En la solucion de referencia, la politica de cookies esta parametrizada para que el equipo pueda ajustar el comportamiento por entorno sin tocar codigo.

## Autenticación y autorización

### Login

Endpoint:

```http
POST /auth/login
```

Credenciales de prueba:

- `admin@example.com` / `admin123`
- `user@example.com` / `user123`

Comportamiento:

- valida credenciales
- devuelve el usuario autenticado
- emite `access_token` y `refresh_token` como cookies `HttpOnly`

Respuesta:

```json
{
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

### Perfil autenticado

Endpoint:

```http
GET /auth/me
```

Requiere token JWT válido si `AUTH_ENABLED=true`.

En la práctica actual, eso significa que debe existir una cookie `access_token` válida.

### Refresh de sesión

Endpoint:

```http
POST /auth/refresh
```

Comportamiento:

- usa la cookie `refresh_token`
- emite nuevas cookies de `access_token` y `refresh_token`
- invalida el refresh token anterior

### Logout

Endpoint:

```http
POST /auth/logout
```

Comportamiento:

- limpia ambas cookies
- invalida la sesión de refresh activa

### Roles

Roles disponibles:

- `ADMIN`
- `USER`

Permisos actuales:

- `ADMIN`: lectura, creación, edición y borrado
- `USER`: solo lectura

Endpoints restringidos a `ADMIN`:

- `POST /cars`
- `PUT /cars/:id`
- `DELETE /cars/:id`
- `POST /cars/:id/document`
- `DELETE /cars/:id/document`

## Endpoints disponibles

### Auth

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`

### Cars

- `GET /cars`
- `GET /cars/export/excel`
- `GET /cars/:id`
- `GET /cars/:id/document`
- `GET /cars/:id/document/download`
- `POST /cars`
- `POST /cars/:id/document`
- `DELETE /cars/:id/document`
- `PUT /cars/:id`
- `DELETE /cars/:id`

### Brands

- `GET /brands`
- `GET /brands/:brandId/models`

### Seed

- `POST /seed`

## Contrato de datos

### `GET /cars`

No devuelve un array plano. Devuelve un objeto paginado:

```json
{
  "items": [],
  "meta": {
    "totalItems": 50,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 5,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

Cada elemento de `items` es un `CarSummary`, es decir, una versión resumida del coche sin `carDetails` pero con `total`.

### `GET /cars/export/excel`

Exporta el contenido filtrado de la tabla a un fichero Excel-compatible.

Características:

- reutiliza los mismos filtros que `GET /cars`
- reutiliza la misma ordenación (`sortBy` y `sortOrder`)
- no aplica paginación al fichero exportado
- devuelve una descarga con nombre `cars-export-YYYY-MM-DD.xls`

Columnas incluidas:

- marca
- modelo
- matrícula
- año de fabricación
- fecha de matriculación
- precio
- moneda
- kilometraje
- disponible
- color
- descripción
- total de detalles

Ejemplo:

```http
GET /cars/export/excel?brandId=brand-1&modelId=model-1&sortBy=brand&sortOrder=asc
```

### `GET /cars/:id`

Devuelve el coche completo:

```json
{
  "id": "uuid",
  "brand": {
    "id": "brand-1",
    "name": "Toyota"
  },
  "model": {
    "id": "model-1",
    "name": "Corolla"
  },
  "carDetails": [
    {
      "registrationDate": "2024-10-30T10:01:35.288Z",
      "mileage": 15000,
      "currency": "EUR",
      "price": 20000,
      "manufactureYear": 2020,
      "availability": true,
      "color": "Midnight Blue",
      "description": "Excellent condition",
      "licensePlate": "1234 BBB",
      "imageUrl": "/images/car_images/model-1_toyota_corolla.webp"
    }
  ],
  "total": 1
}
```

### `POST /cars/:id/document`

Permite practicar subida de ficheros usando `multipart/form-data`.

El backend:

- recibe un fichero real como `blob/file`
- valida tipo y tamaño
- guarda el binario en disco local
- devuelve metadatos del upload
- permite un solo documento por vehículo
- si subes uno nuevo para el mismo coche, reemplaza el anterior

Tipos admitidos:

- `application/pdf`
- `text/plain`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `image/png`
- `image/jpeg`

Límite de tamaño:

- `5 MB`

Campos del formulario:

- `file` obligatorio
- `title` opcional
- `documentType` opcional: `invoice`, `inspection`, `insurance`, `registration`, `other`
- `description` opcional

Respuesta de ejemplo:

```json
{
  "id": "uuid",
  "carId": "uuid",
  "originalName": "itv.pdf",
  "mimeType": "application/pdf",
  "size": 184532,
  "documentType": "inspection",
  "title": "Ficha técnica ITV",
  "description": "Documento de prueba para practicar subida con FormData",
  "uploadedAt": "2026-03-27T10:15:00.000Z",
  "persisted": true,
  "downloadUrl": "/cars/uuid/document/download",
  "message": "The file was stored on disk and replaced any previous document linked to the vehicle."
}
```

### `GET /cars/:id/document`

Devuelve los metadatos del único documento asociado al coche.

### `GET /cars/:id/document/download`

Descarga el único documento asociado al coche usando el `id` del vehículo.

### `DELETE /cars/:id/document`

Elimina el único documento asociado al coche usando el `id` del vehículo.

### `GET /brands`

Respuesta:

```json
[
  { "id": "brand-1", "name": "Toyota" },
  { "id": "brand-2", "name": "Ford" }
]
```

### `GET /brands/:brandId/models`

Respuesta:

```json
[{ "id": "model-1", "name": "Corolla", "brandId": "brand-1" }]
```

## Filtros y paginación en coches

`GET /cars` soporta los siguientes query params:

- `page`
- `limit`
- `brandId`
- `modelId`
- `sortBy`
- `sortOrder`

Valores permitidos para `sortBy`:

- `brand`
- `model`
- `total`

En esta práctica, el contrato de lista solo expone filtros y ordenación sobre campos visibles del propio listado. Por eso `GET /cars` no acepta filtros por `licensePlate` o `available`, ni ordenación por campos de detalle que no forman parte de `CarSummary`.

Valores permitidos para `sortOrder`:

- `asc`
- `desc`

Ejemplo:

```http
GET /cars?page=1&limit=10&brandId=brand-1&modelId=model-1
```

Ejemplo con ordenación:

```http
GET /cars?page=1&limit=10&sortBy=brand&sortOrder=asc
```

Ejemplo de exportación con los mismos filtros:

```http
GET /cars/export/excel?brandId=brand-1&modelId=model-1&sortBy=model&sortOrder=desc
```

## Validaciones importantes

El backend usa `ValidationPipe` global con:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Eso significa:

- las propiedades no permitidas se rechazan
- los DTOs son la fuente de verdad
- el frontend debe enviar exactamente el shape esperado

### Reglas de `CreateCarDto`

- `brandId` es obligatorio
- `brandId` debe existir en el catálogo
- `modelId` es obligatorio
- `modelId` debe existir y pertenecer a la marca elegida
- `carDetails` es opcional, pero si existe debe ser un array válido

### Reglas de cada `carDetail`

- `registrationDate` obligatorio
- `registrationDate` debe estar en formato ISO UTC completo
- `mileage` obligatorio y `>= 0`
- `price` obligatorio y `> 0`
- `manufactureYear` obligatorio
- `manufactureYear >= 1900`
- `manufactureYear <= año actual`
- `manufactureYear <= año de registrationDate`
- `currency` opcional, pero si se manda debe ser un ISO 4217 permitido
- `availability` opcional y booleana
- `color` opcional
- `description` opcional
- `licensePlate` obligatoria
- `licensePlate` debe cumplir formato de matrícula española
- `licensePlate` debe ser única

### Formato de matrícula

Formato esperado:

```txt
1234 BBB
```

Patrón admitido:

```txt
4 dígitos + espacio opcional + 3 consonantes
```

### Moneda

La moneda debe pertenecer a la lista soportada de códigos ISO 4217 definida en el backend.

Recomendación: no hardcodear una lista inventada en el frontend. Revisar Swagger y modelar exactamente lo que expone la API.

## Comportamientos no obvios que el frontend debe conocer

### `imageUrl` no lo envía el cliente

El backend asigna `imageUrl` automáticamente a cada `carDetail`.

No hay subida de imágenes desde cliente. El backend resuelve `imageUrl` a partir de un catálogo local de imágenes estáticas servido desde `public/images`.

### `GET /cars` usa `items`, no `data`

La respuesta paginada actual devuelve:

- `items`
- `meta`

No devuelve `data`.

### Update usa el mismo contrato que create

Aunque existe `UpdateCarDto`, el controlador usa `CreateCarDto` en `PUT /cars/:id`.

Prácticamente, para frontend significa que crear y editar comparten la misma forma de payload.

### Seed

`POST /seed` rellena el almacenamiento en memoria con un dataset fijo definido en `src/seed/data/cars.seed.ts`. Requiere rol `ADMIN`.

## Flujo recomendado para el frontend

Si el equipo o la persona participante tiene un perfil junior:

1. poner `AUTH_ENABLED=false`
2. construir listado, detalle, crear, editar y borrar
3. consumir marcas y modelos
4. validar formularios
5. manejar errores y loaders
6. activar luego el login real

Si el equipo ya tiene más nivel:

1. trabajar directamente con `AUTH_ENABLED=true`
2. implementar login desde el inicio
3. diseñar gestión de sesión con `GET /auth/me`
4. resolver renovación con `POST /auth/refresh`
5. restringir UI según rol

## Ejemplos útiles

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Crear coche

```http
POST /cars
Content-Type: application/json

{
  "brandId": "brand-1",
  "modelId": "model-1",
  "carDetails": [
    {
      "registrationDate": "2024-10-30T10:01:35.288Z",
      "mileage": 15000,
      "currency": "EUR",
      "price": 20000,
      "manufactureYear": 2020,
      "availability": true,
      "color": "Blue",
      "description": "Excellent condition",
      "licensePlate": "4321 BCD"
    }
  ]
}
```

La petición debe realizarse con la sesión autenticada ya establecida en cookies.

### Subir documento de práctica

```http
POST /cars/:id/document
Content-Type: multipart/form-data
```

Ejemplo conceptual desde frontend:

- campo `file`: un `File` real seleccionado por el usuario
- campo `title`: `Ficha técnica ITV`
- campo `documentType`: `inspection`
- campo `description`: `Documento de prueba`

### Obtener perfil

```http
GET /auth/me
```

La petición debe viajar con las cookies de sesión.

## Limitaciones actuales

- no hay base de datos
- no hay persistencia entre reinicios
- no hay subida real de imágenes desde cliente
- los documentos sí se guardan en disco local, pero su metadata y asociación con cada coche viven en memoria
- no hay usuarios dinámicos ni registro
- las credenciales son fijas para práctica
- la revocación de refresh tokens vive en memoria y no en persistencia compartida

## Qué debería revisar siempre el frontend antes de integrar

- Swagger
- DTOs de `src/cars/dto`
- guards y roles
- shape real de paginación
- validaciones de formularios

## Resumen

Este backend ya cubre prácticamente todo lo necesario para una práctica seria de Angular conectada a una API:

- autenticación opcional
- autorización por roles
- CRUD realista
- validación fuerte
- paginación y filtros
- exportación Excel-compatible del listado filtrado
- catálogos dependientes
- documentación Swagger

Si vas a usarlo como base para la práctica, toma Swagger y los DTOs como fuente de verdad. No modeles el frontend por intuición.
