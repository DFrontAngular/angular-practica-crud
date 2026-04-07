# Angular CRUD + NestJS API

Repositorio de práctica para construir una aplicación Angular moderna contra una API real hecha con NestJS.

El objetivo de este proyecto es trabajar con un flujo cercano a un entorno profesional:

- arquitectura frontend y backend
- consumo real de APIs
- routing
- formularios reactivos
- validación
- autenticación basada en cookies HttpOnly y refresh token
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

- autenticación con access token corto y refresh token en cookies HttpOnly
- bypass de autenticación para modo aprendizaje
- endpoint `POST /auth/login`
- endpoint `POST /auth/refresh`
- endpoint `POST /auth/logout`
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

## Requisitos técnicos previos

- Node.js 22 o superior
- npm
- Angular CLI 21 o superior
- Visual Studio Code u otro editor

Instalación de Angular CLI:

```bash
npm install -g @angular/cli
```

## Conocimientos previos recomendados

Este proyecto está pensado como práctica formativa, no como un ejercicio reservado a personas expertas en Angular. Aun así, para aprovecharlo bien conviene partir de una base mínima.

### Base recomendada de desarrollo web

Se recomienda contar con conocimientos funcionales de:

- HTML: estructura de páginas, formularios, inputs, tablas, navegación y semántica básica
- CSS: maquetación, selectores, estados visuales, responsive básico y organización sencilla de estilos
- JavaScript: variables, funciones, arrays, objetos, promesas, `fetch` o consumo de APIs y manejo básico de errores
- TypeScript: tipado básico de objetos, arrays, interfaces y nociones de clases

Con esta base ya es razonable abordar la práctica, especialmente si se sigue el itinerario propuesto en `docs/learning-path.md`.

### ¿Hace falta saber Angular antes de empezar?

No es imprescindible llegar con experiencia previa sólida en Angular para comenzar, especialmente en un contexto de formación guiada.

Sin embargo, sí ayuda haber visto al menos estos conceptos:

- componentes
- templates
- data binding
- servicios
- routing
- `HttpClient`
- formularios reactivos

Si no tienes conocimientos previos de Angular, todavía puedes empezar, pero la estimación de esfuerzo será mayor y es recomendable hacerlo con un enfoque progresivo:

- comenzar con `AUTH_ENABLED=false`
- centrarse primero en listado, detalle, navegación y CRUD base
- dejar login, guards, refresh de sesión y roles para una fase posterior

### Estimación orientativa según punto de partida

- Base web sólida y Angular básico: punto de partida adecuado para seguir la práctica completa con acompañamiento normal
- Base web sólida pero sin Angular: punto de partida viable, con curva de aprendizaje clara en los primeros bloques
- HTML y CSS básicos pero JavaScript todavía inseguro: punto de partida poco recomendable para esta práctica sin refuerzo previo
- Sin base previa de desarrollo web: no se recomienda usar este proyecto como primer contacto absoluto con frontend

En términos formativos, este repositorio encaja mejor en personas que ya tienen una base de desarrollo web y quieren aprender Angular en un caso realista, o en personas con Angular inicial que quieren consolidar integración con APIs, formularios, routing y autenticación.

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
- sesión autenticada mediante cookies `HttpOnly`
- renovación de sesión con `POST /auth/refresh`
- cierre de sesión con `POST /auth/logout`
- acceso a `GET /auth/me`
- restricciones por rol en operaciones protegidas
- `access token` corto y `refresh token` rotado

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
- el frontend debe integrarse mediante proxy si quiere trabajar en desarrollo con sesión autenticada
- el contrato real debe tomarse desde Swagger y los DTOs
- `GET /cars` devuelve un objeto paginado con `items` y `meta`
- `imageUrl` la resuelve el backend
- el backend permite trabajar con subida de documentos y exportación

## Documentación de apoyo

Además de este README, el repositorio incluye documentación complementaria para dar soporte al uso del proyecto como producto formativo:

- índice de documentación: [docs/README.md](docs/README.md)

- guía principal de formación: [training-guide.md](docs/training-guide.md)
- itinerario de aprendizaje: [learning-path.md](docs/learning-path.md)
- flujo de autenticación y sesión: [auth-session-flow.md](docs/auth-session-flow.md)
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
