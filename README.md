# Angular CRUD + NestJS API

Repositorio de práctica para construir una aplicación Angular moderna contra una API real hecha con NestJS.

El objetivo de este proyecto es trabajar con un flujo cercano a un entorno profesional:

- arquitectura frontend y backend
- consumo real de APIs
- routing
- formularios reactivos
- validación
- autenticación JWT
- control de errores
- paginación, filtros y ordenación
- roles y autorización
- subida de archivos
- exportación de datos
- testing y calidad

El backend ya incorpora una base funcional amplia. El frontend se mantiene deliberadamente ligero para que la parte principal de la práctica esté en Angular y en la integración con la API.

## Estructura del repositorio

El repositorio está dividido en dos aplicaciones:

- `frontend/`: Angular 21
- `backend/`: NestJS 10

## Qué incluye el backend

Actualmente, el backend incluye:

- autenticación JWT
- bypass de autenticación para modo aprendizaje
- endpoint `POST /auth/login`
- endpoint `GET /auth/me`
- CRUD de coches
- listado paginado, filtrable y ordenable
- exportación Excel del listado filtrado
- subida de documentos con `multipart/form-data`
- catálogo de marcas y modelos
- roles `ADMIN` y `USER`
- guards de autenticación y autorización
- validaciones con `class-validator`
- Swagger en `/api-docs`
- datos en memoria
- generación automática de `imageUrl` para los coches
- endpoint de seed

Importante:

- no hay base de datos
- los datos viven en memoria
- si reinicias el backend, el estado vuelve a generarse

## Requisitos previos

- Node.js 22 o superior
- npm
- Angular CLI 21 o superior
- Visual Studio Code u otro editor

Instalación de Angular CLI:

```bash
npm install -g @angular/cli
```

## Puesta en marcha

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Disponible en:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

### Frontend

```bash
cd frontend
npm install
npm start
```

Disponible en:

- App: `http://localhost:4200`

## Autenticación y modos de trabajo

El backend soporta dos modos controlados desde `backend/.env`.

Configuración actual:

```env
AUTH_ENABLED=true
JWT_SECRET=super-secret-key-123
API_DELAY_ENABLED=true
API_DELAY_MIN_MS=200
API_DELAY_MAX_MS=900
```

### `AUTH_ENABLED=true`

Implica:

- login real mediante `POST /auth/login`
- uso de `Authorization: Bearer <token>`
- acceso a `GET /auth/me`
- restricciones por rol en operaciones protegidas
- token sin expiración automática en esta práctica

Credenciales de prueba:

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### `AUTH_ENABLED=false`

Implica:

- bypass de autenticación
- inyección de un usuario ficticio con rol `ADMIN`
- posibilidad de trabajar primero el CRUD sin implementar login

## UI y estilos

En esta práctica no se proporciona un diseño cerrado.

En el contexto habitual del equipo, los desarrollos frontend suelen trabajar sobre diseños definidos por perfiles especializados de UX/UI. En esta práctica se omite esa capa de forma intencionada para priorizar la resolución funcional de la interfaz, la claridad estructural y la toma de decisiones básicas de frontend.

No se busca evaluar diseño visual experto, sino una interfaz coherente, funcional y defendible.

Estado actual del frontend:

- Tailwind está instalado

Se puede utilizar:

- CSS plano
- SCSS
- Tailwind
- una combinación razonable de las opciones anteriores
- librerías de componentes, si se justifican con criterio

## Notas técnicas importantes

- el backend no está configurado con una política permisiva de CORS para `localhost`
- el contrato real debe tomarse desde Swagger y los DTOs
- `GET /cars` devuelve un objeto paginado con `items` y `meta`
- `imageUrl` la resuelve el backend
- el backend permite trabajar con subida de documentos y exportación

## Documentación de apoyo

Además de este README, el repositorio incluye documentación complementaria para dar soporte al uso del proyecto como producto formativo:

- índice de documentación: [docs/README.md](docs/README.md)

- guía principal de formación: [training-guide.md](docs/training-guide.md)
- itinerario de aprendizaje: [learning-path.md](docs/learning-path.md)
- guía del mentor: [mentor-guide.md](docs/mentor-guide.md)
- rúbrica de evaluación: [rubric.md](docs/rubric.md)
- guía de entrega: [submission-guide.md](docs/submission-guide.md)
- FAQ de la formación: [faq.md](docs/faq.md)
- modelo de soporte: [support-model.md](docs/support-model.md)
- guía de incidencias: [issues-guide.md](docs/issues-guide.md)
- política de IA y seguridad: [ai-and-security-policy.md](docs/ai-and-security-policy.md)
- decisiones del programa formativo: [training-decisions.md](docs/training-decisions.md)
- gobernanza del programa: [program-governance.md](docs/program-governance.md)
- política de solución de referencia: [reference-solution-policy.md](docs/reference-solution-policy.md)

## Referencias rápidas

- Swagger backend: `http://localhost:3000/api-docs`
- Frontend: `http://localhost:4200`
- Backend: `http://localhost:3000`
- Archivo de configuración auth: `backend/.env`

Si tienes dudas sobre cómo modelar una petición o una respuesta, revisa Swagger antes de escribir código. En este proyecto, el backend es la fuente de verdad.
