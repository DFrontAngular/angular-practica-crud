# Angular CRUD + NestJS API

Repositorio de práctica para construir una aplicación Angular moderna contra una API real hecha con NestJS.

La intención de este proyecto no es solo "hacer un CRUD". Está planteado para que una persona junior, mid o alguien que viene de reciclaje técnico termine habiendo tocado:

- arquitectura frontend y backend
- consumo real de APIs
- routing
- formularios reactivos
- validación
- autenticación JWT
- guards e interceptors
- control de errores
- paginación y filtros
- roles y autorización
- testing y calidad
- flujo de trabajo profesional con Git

El backend ya trae bastante trabajo resuelto. El frontend está muy vacío a propósito para que la práctica esté en Angular y no en maquetar una demo cerrada.

## 1. Estado actual del proyecto

El repo está dividido en dos aplicaciones:

- `frontend/`: Angular 21
- `backend/`: NestJS 10

Hoy mismo, el backend ya incluye:

- autenticación JWT
- bypass de autenticación para modo aprendizaje
- endpoint `POST /auth/login`
- endpoint `GET /auth/me`
- CRUD de coches
- listado paginado y filtrable
- catálogo de marcas y modelos
- roles `ADMIN` y `USER`
- guards de autenticación y autorización
- validaciones con `class-validator`
- Swagger en `/api-docs`
- datos en memoria
- generación de imágenes automáticas para los coches
- endpoint de seed

Importante: los datos del backend no se guardan en base de datos. Se mantienen en memoria. Si reinicias el backend, el estado vuelve a generarse.

## 2. Perfil al que va dirigido

Este repositorio está pensado para tres perfiles:

### Junior

Si estás empezando con Angular, puedes centrarte en:

- componentes
- rutas
- servicios HTTP
- tablas
- formularios reactivos
- validaciones de formulario
- detalle, creación, edición y borrado

Puedes trabajar sin login real usando el backend en modo bypass.

### Mid

Si ya dominas lo básico, deberías añadir:

- estructura de carpetas coherente
- reutilización de componentes
- gestión de estado local con signals
- interceptors
- manejo global de errores
- loaders
- paginación y filtros
- testing

### Senior o preparación real de proyecto

Si quieres llevar esto a un nivel más profesional, deberías resolver además:

- login real
- persistencia del usuario autenticado
- control de roles en UI y rutas
- guards de Angular
- estrategia de autorización coherente
- componentes reutilizables y desacoplados
- cobertura de tests
- calidad de código y documentación

## 3. Requisitos previos

- Node.js 22 o superior
- npm
- Angular CLI 21 o superior
- Visual Studio Code u otro editor

Instalación de Angular CLI:

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

- el backend no está configurado para permitir `localhost` arbitrarios por CORS
- si el frontend ataca directamente a otro origen durante desarrollo, ese choque forma parte de la práctica
- la integración entre frontend y backend debe plantearse con mentalidad de proyecto real, no de bypass local permisivo

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend disponible en:

- App: `http://localhost:4200`

## 4.1 Decisiones de UI y estilos

En esta práctica no queremos imponer una solución cerrada de frontend. Queremos que tomes decisiones técnicas y seas capaz de defenderlas.

Estado actual del proyecto:

- Tailwind está instalado en el frontend

Criterio:

- puedes usar CSS plano, SCSS, Tailwind o una combinación razonable
- puedes usar librerías de componentes si encajan con tu propuesta
- también puedes construir tus propios componentes base

Lo importante no es “usar o no usar una librería”, sino justificar bien la decisión:

- coste de mantenimiento
- consistencia visual
- velocidad de desarrollo
- flexibilidad
- accesibilidad
- tamaño y complejidad de la solución

## 5. Cómo activar o desactivar el login

El backend ya soporta dos modos de trabajo. Se controla desde `backend/.env`.

Contenido actual:

```env
AUTH_ENABLED=true
JWT_SECRET=super-secret-key-123
JWT_EXPIRES_IN=3600s
```

### Modo 1: Login real activado

Usa:

```env
AUTH_ENABLED=true
```

Qué implica:

- `POST /auth/login` devuelve un JWT real
- el frontend debe guardar el token
- el frontend debe enviar `Authorization: Bearer <token>`
- `GET /auth/me` devuelve el usuario autenticado
- `POST /cars`, `PUT /cars/:id` y `DELETE /cars/:id` requieren rol `ADMIN`
- si entras con rol `USER`, solo tendrás lectura

Credenciales de prueba:

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### Modo 2: Login desactivado

Usa:

```env
AUTH_ENABLED=false
```

Qué implica:

- el backend hace bypass de autenticación
- no necesitas pantalla de login para avanzar
- el guard inyecta un usuario ficticio con rol `ADMIN`
- puedes centrarte primero en el CRUD y en la integración Angular

### Recomendación de trabajo

Para una persona junior o alguien que está aprendiendo Angular desde cero:

1. empieza con `AUTH_ENABLED=false`
2. construye el CRUD completo
3. cuando la app funcione, activa `AUTH_ENABLED=true`
4. implementa login, interceptor y control de roles

Ese orden es mejor que intentar hacer todo a la vez.

## 6. Backend revisado: qué hay realmente

### Módulos

- `AuthModule`
- `CarsModule`
- `BrandsModule`
- `SeedModule`

### Autenticación

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
- `GET /cars/:id`
- `POST /cars`
- `PUT /cars/:id`
- `DELETE /cars/:id`

Comportamiento importante:

- `GET /cars` devuelve paginación real
- `POST`, `PUT` y `DELETE` están protegidos por rol
- el backend añade `imageUrl` automáticamente a cada `carDetail`
- la información se guarda en memoria

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
- `manufactureYear` debe estar entre `1900` y el año actual
- `manufactureYear` no puede ser posterior al año de `registrationDate`
- `currency` debe ser un código ISO 4217 permitido
- `availability` es booleano
- `licensePlate` debe cumplir formato de matrícula española
- `licensePlate` debe ser única

Formato de matrícula aceptado:

```txt
1234 BBB
```

Expresión esperada:

```txt
4 dígitos + espacio opcional + 3 consonantes
```

## 9. Qué debería construir el frontend

El frontend actual está prácticamente base. La práctica consiste en levantar una aplicación Angular completa apoyándote en la API existente.

Resultado mínimo recomendable:

- pantalla inicial con listado
- tabla de coches
- detalle de coche
- formulario de creación
- formulario de edición
- borrado con confirmación
- consumo real de marcas y modelos
- validaciones visibles en UI
- navegación entre pantallas

Resultado avanzado recomendable:

- login
- interceptor JWT
- perfil autenticado
- guards de Angular
- ocultación de acciones según rol
- filtros y paginación
- manejo de errores
- notificaciones
- loaders

## 10. Ruta de aprendizaje propuesta

La siguiente secuencia está pensada para que alguien salga del proyecto con base sólida. No es una lista decorativa. Si haces esto bien, has tocado casi todo lo importante en Angular de aplicación real.

### Bloque 0. Preparación del entorno

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

Qué deberías aprender:

- cómo leer una API existente
- cómo validar requisitos antes de escribir Angular

### Bloque 1. Base Angular

Objetivo:

- crear una estructura limpia desde el principio

Tareas:

1. define el routing base
2. crea la página Home
3. crea layout general
4. organiza carpetas por `core`, `shared`, `features`
5. define modelos TypeScript para las respuestas del backend

Qué deberías aprender:

- arquitectura básica de frontend
- separación entre features y piezas compartidas

### Bloque 2. Tabla de listado

Objetivo:

- mostrar datos reales del backend

Tareas:

1. crea `CarsService`
2. conecta `GET /cars`
3. adapta la tabla a la respuesta paginada
4. muestra marca, modelo, total y acciones
5. añade navegación a detalle, edición y creación

Qué deberías aprender:

- HttpClient
- tipado de respuestas
- renderizado de listas
- estados de carga vacíos y de error

### Bloque 3. Catálogos y dependencias

Objetivo:

- trabajar con datos dependientes

Tareas:

1. crea `BrandsService`
2. consume `GET /brands`
3. consume `GET /brands/:brandId/models`
4. recarga modelos al cambiar la marca
5. usa `id` como valor y `name` como etiqueta

Qué deberías aprender:

- selects dependientes
- composición de formularios con datos remotos

### Bloque 4. Formularios reactivos

Objetivo:

- crear y editar coches respetando el backend

Tareas:

1. crea formulario reactivo de coche
2. usa `FormArray` para `carDetails`
3. añade validaciones equivalentes a las del backend
4. implementa `POST /cars`
5. implementa `PUT /cars/:id`
6. reutiliza el formulario para crear y editar

Qué deberías aprender:

- `FormGroup`
- `FormControl`
- `FormArray`
- validación custom
- reutilización de formularios

### Bloque 5. Detalle y experiencia de usuario

Objetivo:

- trabajar con rutas dinámicas y presentación de datos

Tareas:

1. crea detalle `cars/:id`
2. consume `GET /cars/:id`
3. muestra estados de kilometraje con un pipe o helper presentacional
4. aplica `currency` y formateos útiles
5. facilita la vuelta al listado

Qué deberías aprender:

- rutas con parámetros
- composición de vistas
- pipes

### Bloque 6. Eliminación y feedback

Objetivo:

- cerrar el CRUD real

Tareas:

1. crea modal de confirmación
2. conecta `DELETE /cars/:id`
3. muestra notificaciones de éxito y error
4. refresca el listado sin romper la UX

Qué deberías aprender:

- confirmaciones
- side effects de operaciones mutables
- feedback al usuario

### Bloque 7. Manejo de errores y loaders

Objetivo:

- evitar una app frágil

Tareas:

1. centraliza errores HTTP
2. normaliza mensajes para el usuario
3. crea loader o overlay
4. decide si el loader vive por componente o por interceptor

Qué deberías aprender:

- interceptors
- manejo global vs local de errores
- diseño de estados de carga

### Bloque 8. Login real

Objetivo:

- integrar autenticación completa

Precondición:

- cambia `AUTH_ENABLED=true`

Tareas:

1. crea pantalla de login
2. llama a `POST /auth/login`
3. persiste el token
4. crea interceptor para enviar el bearer token
5. consulta `GET /auth/me`
6. reconstruye sesión al recargar la app

Qué deberías aprender:

- autenticación real
- persistencia de sesión
- seguridad de frontend

### Bloque 9. Roles y autorización

Objetivo:

- adaptar la interfaz al perfil autenticado

Tareas:

1. oculta botones de editar y eliminar para `USER`
2. deja visibles esas acciones para `ADMIN`
3. protege rutas con guards de Angular
4. bloquea navegación no autorizada

Qué deberías aprender:

- diferencia entre autenticación y autorización
- guards
- control de permisos en UI

### Bloque 10. Paginación y filtros

Objetivo:

- trabajar como en una app profesional

Tareas:

1. conecta `page` y `limit`
2. pinta metadatos de paginación
3. añade filtros por marca, modelo, disponibilidad, año, precio y matrícula
4. sincroniza filtros con la URL si quieres subir el nivel

Qué deberías aprender:

- query params
- tablas con estado
- UX de filtrado

### Bloque 11. Calidad profesional

Objetivo:

- salir del modo "solo funciona en mi máquina"

Tareas:

1. configura ESLint y Prettier si no lo has hecho ya
2. añade hooks con Husky
3. documenta decisiones de arquitectura
4. escribe tests unitarios y de componentes
5. define criterio mínimo de cobertura
6. crea plantilla de Pull Request
7. usa ramas con naming consistente

Qué deberías aprender:

- calidad de código
- revisión de cambios
- disciplina de equipo

## 11. Propuesta de roadmap por ramas

Si quieres trabajar como si esto fuera un proyecto real, una secuencia razonable sería:

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
14. `docs/project-documentation`

## 12. Recomendaciones técnicas

- usa nombres en inglés para componentes, servicios, métodos, variables y tipos
- no copies validaciones del backend sin entenderlas
- revisa Swagger antes de modelar el frontend
- no hardcodees marcas, modelos ni monedas en la UI
- reutiliza el formulario de crear y editar
- tipa todas las respuestas HTTP
- evita lógica de negocio compleja en templates
- si usas Angular 21, aprovecha standalone components y señales cuando tengan sentido
- si usas una librería de componentes o Tailwind, que sea una decisión arquitectónica consciente y no solo una forma rápida de salir del paso

## 13. Qué no deberías asumir

- que `GET /cars` devuelve un array simple
- que siempre puedes editar o borrar
- que el login es obligatorio desde el minuto 1
- que el backend guarda imágenes subidas realmente
- que existe base de datos
- que reiniciar backend conserva cambios
- que el backend va a resolverte CORS de desarrollo con una whitelist permisiva a `localhost`

## 14. Criterio de éxito

Se puede considerar que la práctica está bien resuelta cuando:

- la aplicación arranca sin fricción
- el listado consume el backend real
- crear, editar, ver y borrar funcionan
- el formulario respeta las validaciones del backend
- la UX maneja carga, errores y confirmaciones
- la aplicación soporta trabajar con login desactivado y activado
- el rol del usuario afecta a la interfaz y a la navegación
- el código está ordenado, tipado y defendible en una revisión

## 15. Referencias rápidas

- Swagger backend: `http://localhost:3000/api-docs`
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Archivo de configuración auth: `backend/.env`

Si tienes dudas sobre cómo modelar una petición o una respuesta, abre Swagger antes de escribir código. En este proyecto, el backend es la fuente de verdad.
