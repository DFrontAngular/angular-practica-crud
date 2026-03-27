# Angular CRUD + NestJS API

Repositorio de practica para construir una aplicacion Angular moderna contra una API real hecha con NestJS.

La idea no es solo "hacer un CRUD", sino practicar un flujo mas parecido a proyecto real:

- arquitectura frontend y backend
- consumo real de APIs
- routing
- formularios reactivos
- validacion
- autenticacion JWT
- guards e interceptors
- control de errores
- paginacion, filtros y ordenacion
- roles y autorizacion
- subida de archivos
- exportacion de datos
- testing y calidad
- flujo de trabajo profesional con Git

El backend ya trae bastante trabajo resuelto. El frontend esta bastante vacio a proposito para que la practica fuerte este en Angular y no en maquetar una demo cerrada.

## 1. Estado actual del proyecto

El repo esta dividido en dos aplicaciones:

- `frontend/`: Angular 21
- `backend/`: NestJS 10

Hoy mismo, el backend ya incluye:

- autenticacion JWT
- bypass de autenticacion para modo aprendizaje
- endpoint `POST /auth/login`
- endpoint `GET /auth/me`
- CRUD de coches
- listado paginado, filtrable y ordenable
- exportacion Excel del listado filtrado
- subida de documentos de practica con `multipart/form-data`
- catalogo de marcas y modelos
- roles `ADMIN` y `USER`
- guards de autenticacion y autorizacion
- validaciones con `class-validator`
- Swagger en `/api-docs`
- datos en memoria
- generacion automatica de `imageUrl` para los coches
- endpoint de seed

Importante:

- no hay base de datos
- los datos viven en memoria
- si reinicias el backend, el estado vuelve a generarse

## 2. Perfil al que va dirigido

Este repositorio esta pensado para tres perfiles.

### Junior

Si estas empezando con Angular, puedes centrarte en:

- componentes
- rutas
- servicios HTTP
- tablas
- formularios reactivos
- validaciones de formulario
- detalle, creacion, edicion y borrado

Puedes trabajar sin login real usando el backend en modo bypass.

### Mid

Si ya dominas lo basico, deberias anadir:

- estructura de carpetas coherente
- reutilizacion de componentes
- gestion de estado local con signals
- interceptors
- manejo global de errores
- loaders
- paginacion, filtros y ordenacion
- testing

### Senior o preparacion real de proyecto

Si quieres llevar esto a un nivel mas profesional, deberias resolver ademas:

- login real
- persistencia del usuario autenticado
- control de roles en UI y rutas
- guards de Angular
- estrategia de autorizacion coherente
- componentes reutilizables y desacoplados
- subida de ficheros con UX cuidada
- exportacion de datos
- cobertura de tests
- calidad de codigo y documentacion

## 3. Requisitos previos

- Node.js 22 o superior
- npm
- Angular CLI 21 o superior
- Visual Studio Code u otro editor

Instalacion de Angular CLI:

```bash
npm install -g @angular/cli
```

## 4. Puesta en marcha

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend disponible en:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

Nota importante:

- el backend no esta configurado para permitir `localhost` arbitrarios por CORS
- si el frontend ataca directamente a otro origen durante desarrollo, ese choque forma parte de la practica
- la integracion entre frontend y backend debe plantearse con mentalidad de proyecto real, no de bypass local permisivo

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend disponible en:

- App: `http://localhost:4200`

## 4.1 Decisiones de UI y estilos

En esta practica no queremos imponer una solucion cerrada de frontend. Queremos que tomes decisiones tecnicas y seas capaz de defenderlas.

Estado actual del proyecto:

- Tailwind esta instalado en el frontend

Criterio:

- puedes usar CSS plano, SCSS, Tailwind o una combinacion razonable
- puedes usar librerias de componentes si encajan con tu propuesta
- tambien puedes construir tus propios componentes base

Lo importante no es "usar o no usar una libreria", sino justificar bien la decision:

- coste de mantenimiento
- consistencia visual
- velocidad de desarrollo
- flexibilidad
- accesibilidad
- tamano y complejidad de la solucion

## 5. Como activar o desactivar el login

El backend ya soporta dos modos de trabajo. Se controla desde `backend/.env`.

Contenido actual:

```env
AUTH_ENABLED=true
JWT_SECRET=super-secret-key-123
JWT_EXPIRES_IN=3600s
API_DELAY_ENABLED=true
API_DELAY_MIN_MS=200
API_DELAY_MAX_MS=900
```

### Modo 1: Login real activado

Usa:

```env
AUTH_ENABLED=true
```

Que implica:

- `POST /auth/login` devuelve un JWT real
- el frontend debe guardar el token
- el frontend debe enviar `Authorization: Bearer <token>`
- `GET /auth/me` devuelve el usuario autenticado
- `POST /cars`, `PUT /cars/:id`, `DELETE /cars/:id` y `POST /cars/:id/documents` requieren rol `ADMIN`
- si entras con rol `USER`, solo tendras lectura

Credenciales de prueba:

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### Modo 2: Login desactivado

Usa:

```env
AUTH_ENABLED=false
```

Que implica:

- el backend hace bypass de autenticacion
- no necesitas pantalla de login para avanzar
- el guard inyecta un usuario ficticio con rol `ADMIN`
- puedes centrarte primero en el CRUD y en la integracion Angular

### Recomendacion de trabajo

Para una persona junior o alguien que esta aprendiendo Angular desde cero:

1. empieza con `AUTH_ENABLED=false`
2. construye el CRUD completo
3. cuando la app funcione, activa `AUTH_ENABLED=true`
4. implementa login, interceptor y control de roles

Ese orden es mejor que intentar hacer todo a la vez.

## 5.1 Latencia simulada para desarrollo

El backend puede introducir una latencia artificial aleatoria para que el frontend se comporte como si hablara con una API real y no con respuestas instantaneas de `localhost`.

Se controla tambien desde `backend/.env`:

```env
API_DELAY_ENABLED=true
API_DELAY_MIN_MS=200
API_DELAY_MAX_MS=900
```

Que implica:

- todas las respuestas del backend pueden tardar entre `200` y `900` ms
- sirve para probar loaders, estados vacios, feedback visual y UX realista
- puedes desactivarlo poniendo `API_DELAY_ENABLED=false`
- puedes ajustar el rango si quieres una sensacion mas rapida o mas exigente

## 6. Backend revisado: que hay realmente

### Modulos

- `AuthModule`
- `CarsModule`
- `BrandsModule`
- `SeedModule`

### Autenticacion

El backend usa JWT y estrategia `passport-jwt`.

Endpoints:

- `POST /auth/login`
- `GET /auth/me`

Roles disponibles:

- `ADMIN`
- `USER`

### Coches

Endpoints:

- `GET /cars`
- `GET /cars/export/excel`
- `GET /cars/:id`
- `POST /cars`
- `POST /cars/:id/documents`
- `PUT /cars/:id`
- `DELETE /cars/:id`

Comportamiento importante:

- `GET /cars` devuelve paginacion real
- `GET /cars/:id` devuelve el coche con sus `carDetails`, incluyendo `imageUrl` ya resuelta por el backend
- `GET /cars/export/excel` reutiliza filtros y ordenacion y descarga un `.xls`
- `POST /cars/:id/documents` acepta documentos e imagenes de practica y los procesa en memoria
- `POST`, `PUT`, `DELETE` y upload de documentos estan protegidos por rol
- el backend anade `imageUrl` automaticamente a cada `carDetail`
- la informacion se guarda en memoria

### Marcas y modelos

Endpoints:

- `GET /brands`
- `GET /brands/:brandId/models`

### Seed

Endpoint:

- `GET /seed`

Sirve para cargar un dataset fijo de ejemplo.

## 7. Contrato actual de la API

### `GET /cars`

No devuelve un array plano. Devuelve un objeto paginado con esta estructura:

```ts
{
  items: CarSummary[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

Nota:

- cada item resumido contiene `total`, pero no incluye `carDetails`
- para obtener el detalle completo de un coche, el frontend debe consumir `GET /cars/:id`
- en ese detalle, cada `carDetail` ya incluye `imageUrl` resuelta por el backend y lista para mostrarse en UI

### Filtros soportados en `GET /cars`

- `page`
- `limit`
- `brandId`
- `modelId`
- `minPrice`
- `maxPrice`
- `minYear`
- `maxYear`
- `available`
- `licensePlate`
- `sortBy`
- `sortOrder`

Valores permitidos para `sortBy`:

- `brandId`
- `modelId`
- `total`
- `price`
- `manufactureYear`
- `registrationDate`
- `mileage`
- `licensePlate`
- `availability`

Valores permitidos para `sortOrder`:

- `asc`
- `desc`

### `GET /brands`

Devuelve marcas con forma:

```ts
{ id: string, name: string }
```

### `GET /brands/:brandId/models`

Devuelve modelos con forma:

```ts
{ id: string, name: string, brandId: string }
```

### `GET /cars/export/excel`

Devuelve una descarga Excel-compatible con el mismo conjunto filtrado y ordenado que `GET /cars`, pero sin paginacion.

### `GET /cars/:id`

Devuelve un coche completo con esta idea de estructura:

```ts
{
  id: string,
  brandId: string,
  modelId: string,
  carDetails: [
    {
      registrationDate: string,
      mileage: number,
      currency: string,
      price: number,
      manufactureYear: number,
      availability?: boolean,
      color?: string,
      description?: string,
      licensePlate: string,
      imageUrl: string
    }
  ],
  total: number
}
```

Importante:

- `imageUrl` no la envia el cliente en `POST` ni en `PUT`
- `imageUrl` la resuelve siempre el backend
- el frontend puede usar esa URL directamente para pintar la imagen del coche

### `POST /cars/:id/documents`

Acepta `multipart/form-data` para practicar subida de ficheros. El backend valida tipo y tamano, procesa el archivo en memoria y devuelve metadatos, pero no lo persiste.

Tipos admitidos:

- `application/pdf`
- `text/plain`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `image/png`
- `image/jpeg`

Tamano maximo:

- `5 MB`

Campos posibles:

- `file` obligatorio
- `title` opcional
- `documentType` opcional: `invoice`, `inspection`, `insurance`, `registration`, `other`
- `description` opcional

### `POST /auth/login`

Devuelve:

```ts
{
  access_token: string,
  user: {
    email: string,
    name: string,
    role: 'ADMIN' | 'USER'
  }
}
```

## 8. Validaciones que el frontend debe respetar

No construyas el formulario "a ojo". El backend valida de verdad. Swagger y los DTOs deben ser tu fuente de verdad.

### Validaciones clave de coche

- `brandId` debe existir
- `modelId` debe existir y pertenecer a la marca seleccionada
- `carDetails` es un array
- `registrationDate` debe ir en formato ISO UTC completo
- `mileage` debe ser `>= 0`
- `price` debe ser `> 0`
- `manufactureYear` debe ser un numero entero sin decimales
- `manufactureYear` debe estar entre `1900` y el ano actual
- `manufactureYear` no puede ser posterior al ano de `registrationDate`
- `currency` debe ser un codigo ISO 4217 permitido
- `availability` es booleano
- `licensePlate` debe cumplir formato de matricula espanola
- `licensePlate` debe ser unica

Formato de matricula aceptado:

```txt
1234 BBB
```

Expresion esperada:

```txt
4 digitos + espacio opcional + 3 consonantes
```

## 9. Que deberia construir el frontend

El frontend actual esta practicamente base. La practica consiste en levantar una aplicacion Angular completa apoyandote en la API existente.

Resultado minimo recomendable:

- pantalla inicial con listado
- tabla de coches
- detalle de coche
- formulario de creacion
- formulario de edicion
- borrado con confirmacion
- consumo real de marcas y modelos
- validaciones visibles en UI
- navegacion entre pantallas

Resultado avanzado recomendable:

- login
- interceptor JWT
- perfil autenticado
- guards de Angular
- ocultacion de acciones segun rol
- filtros, paginacion y ordenacion
- exportacion Excel
- subida de documentos con `FormData`
- manejo de errores
- notificaciones
- loaders

## 10. Ruta de aprendizaje propuesta

La siguiente secuencia esta pensada para que alguien salga del proyecto con base solida. No es una lista decorativa. Si haces esto bien, has tocado casi todo lo importante en Angular de aplicacion real.

### Bloque 0. Preparacion del entorno

Objetivo:

- entender la estructura del repo
- arrancar backend y frontend
- abrir Swagger
- revisar la forma real de las respuestas

Tareas:

1. haz fork del repositorio
2. arranca backend y frontend
3. visita `/api-docs`
4. prueba `GET /cars`, `GET /brands` y `GET /brands/:brandId/models`
5. decide si vas a empezar con login activado o desactivado

Que deberias aprender:

- como leer una API existente
- como validar requisitos antes de escribir Angular

### Bloque 1. Base Angular

Objetivo:

- crear una estructura limpia desde el principio

Tareas:

1. define el routing base
2. crea la pagina Home
3. crea layout general
4. organiza carpetas por `core`, `shared`, `features`
5. define modelos TypeScript para las respuestas del backend

Que deberias aprender:

- arquitectura basica de frontend
- separacion entre features y piezas compartidas

### Bloque 2. Tabla de listado

Objetivo:

- mostrar datos reales del backend

Tareas:

1. crea `CarsService`
2. conecta `GET /cars`
3. adapta la tabla a la respuesta paginada
4. muestra marca, modelo, total y acciones
5. anade navegacion a detalle, edicion y creacion

Que deberias aprender:

- `HttpClient`
- tipado de respuestas
- renderizado de listas
- estados de carga, vacios y de error

### Bloque 3. Catalogos y dependencias

Objetivo:

- trabajar con datos dependientes

Tareas:

1. crea `BrandsService`
2. consume `GET /brands`
3. consume `GET /brands/:brandId/models`
4. recarga modelos al cambiar la marca
5. usa `id` como valor y `name` como etiqueta

Que deberias aprender:

- selects dependientes
- composicion de formularios con datos remotos

### Bloque 4. Formularios reactivos

Objetivo:

- crear y editar coches respetando el backend

Tareas:

1. crea formulario reactivo de coche
2. usa `FormArray` para `carDetails`
3. anade validaciones equivalentes a las del backend
4. trata `manufactureYear` como entero y relacionelo con `registrationDate`
5. implementa `POST /cars`
6. implementa `PUT /cars/:id`
7. reutiliza el formulario para crear y editar

Que deberias aprender:

- `FormGroup`
- `FormControl`
- `FormArray`
- validacion custom
- reutilizacion de formularios

### Bloque 4.1. Upload de documentos

Objetivo:

- practicar `multipart/form-data` y subida real de archivos desde Angular

Tareas:

1. crea un formulario o accion secundaria para adjuntar documento a un coche
2. construye `FormData` con `file` y metadatos opcionales
3. conecta `POST /cars/:id/documents`
4. muestra errores de tamano o tipo no permitido
5. presenta la respuesta de metadatos devuelta por el backend

Que deberias aprender:

- `FormData`
- manejo de archivos en Angular
- validacion de uploads

### Bloque 5. Detalle y experiencia de usuario

Objetivo:

- trabajar con rutas dinamicas y presentacion de datos

Tareas:

1. crea detalle `cars/:id`
2. consume `GET /cars/:id`
3. muestra estados de kilometraje con un pipe o helper presentacional
4. aplica `currency` y formateos utiles
5. facilita la vuelta al listado

Que deberias aprender:

- rutas con parametros
- composicion de vistas
- pipes

### Bloque 6. Eliminacion y feedback

Objetivo:

- cerrar el CRUD real

Tareas:

1. crea modal de confirmacion
2. conecta `DELETE /cars/:id`
3. muestra notificaciones de exito y error
4. refresca el listado sin romper la UX

Que deberias aprender:

- confirmaciones
- side effects de operaciones mutables
- feedback al usuario

### Bloque 7. Manejo de errores y loaders

Objetivo:

- evitar una app fragil

Tareas:

1. centraliza errores HTTP
2. normaliza mensajes para el usuario
3. crea loader o overlay
4. decide si el loader vive por componente o por interceptor

Que deberias aprender:

- interceptors
- manejo global vs local de errores
- diseno de estados de carga

### Bloque 8. Login real

Objetivo:

- integrar autenticacion completa

Precondicion:

- cambia `AUTH_ENABLED=true`

Tareas:

1. crea pantalla de login
2. llama a `POST /auth/login`
3. persiste el token
4. crea interceptor para enviar el bearer token
5. consulta `GET /auth/me`
6. reconstruye sesion al recargar la app

Que deberias aprender:

- autenticacion real
- persistencia de sesion
- seguridad de frontend

### Bloque 9. Roles y autorizacion

Objetivo:

- adaptar la interfaz al perfil autenticado

Tareas:

1. oculta botones de editar y eliminar para `USER`
2. deja visibles esas acciones para `ADMIN`
3. protege rutas con guards de Angular
4. bloquea navegacion no autorizada

Que deberias aprender:

- diferencia entre autenticacion y autorizacion
- guards
- control de permisos en UI

### Bloque 10. Paginacion, filtros y ordenacion

Objetivo:

- trabajar como en una app profesional

Tareas:

1. conecta `page` y `limit`
2. pinta metadatos de paginacion
3. anade filtros por marca, modelo, disponibilidad, ano, precio y matricula
4. anade ordenacion por columnas o controles de sort
5. implementa exportacion con `GET /cars/export/excel`
6. sincroniza filtros con la URL si quieres subir el nivel

Que deberias aprender:

- query params
- tablas con estado
- UX de filtrado

### Bloque 11. Calidad profesional

Objetivo:

- salir del modo "solo funciona en mi maquina"

Tareas:

1. configura ESLint y Prettier si no lo has hecho ya
2. anade hooks con Husky
3. documenta decisiones de arquitectura
4. escribe tests unitarios y de componentes
5. define criterio minimo de cobertura
6. crea plantilla de Pull Request
7. usa ramas con naming consistente

Que deberias aprender:

- calidad de codigo
- revision de cambios
- disciplina de equipo

## 11. Propuesta de roadmap por ramas

Si quieres trabajar como si esto fuera un proyecto real, una secuencia razonable seria:

1. `feat/project-setup`
2. `feat/app-routing-layout`
3. `feat/cars-list`
4. `feat/car-details`
5. `feat/car-form-create`
6. `feat/car-form-edit`
7. `feat/car-delete-modal`
8. `feat/brands-models-integration`
9. `feat/error-handling-and-loader`
10. `feat/auth-login`
11. `feat/auth-interceptor-and-session`
12. `feat/roles-and-route-guards`
13. `feat/pagination-and-filters`
14. `feat/document-upload`
15. `docs/project-documentation`

## 12. Recomendaciones tecnicas

- usa nombres en ingles para componentes, servicios, metodos, variables y tipos
- no copies validaciones del backend sin entenderlas
- revisa Swagger antes de modelar el frontend
- no hardcodees marcas, modelos ni monedas en la UI
- reutiliza el formulario de crear y editar
- tipa todas las respuestas HTTP
- evita logica de negocio compleja en templates
- si usas Angular 21, aprovecha standalone components y senales cuando tengan sentido
- si usas una libreria de componentes o Tailwind, que sea una decision arquitectonica consciente y no solo una forma rapida de salir del paso

## 13. Que no deberias asumir

- que `GET /cars` devuelve un array simple
- que siempre puedes editar o borrar
- que `manufactureYear` admite decimales
- que el login es obligatorio desde el minuto 1
- que el backend guarda imagenes subidas realmente
- que los documentos subidos se persisten
- que existe base de datos
- que reiniciar backend conserva cambios
- que el backend va a resolverte CORS de desarrollo con una whitelist permisiva a `localhost`

## 14. Criterio de exito

Se puede considerar que la practica esta bien resuelta cuando:

- la aplicacion arranca sin friccion
- el listado consume el backend real
- crear, editar, ver y borrar funcionan
- el formulario respeta las validaciones del backend
- la UX maneja carga, errores y confirmaciones
- la aplicacion soporta trabajar con login desactivado y activado
- el rol del usuario afecta a la interfaz y a la navegacion
- la subida de documentos funciona con `FormData`
- la exportacion refleja filtros y ordenacion
- el codigo esta ordenado, tipado y defendible en una revision

## 15. Referencias rapidas

- Swagger backend: `http://localhost:3000/api-docs`
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Archivo de configuracion auth: `backend/.env`

Si tienes dudas sobre como modelar una peticion o una respuesta, abre Swagger antes de escribir codigo. En este proyecto, el backend es la fuente de verdad.
