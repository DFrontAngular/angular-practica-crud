# Vehicle Catalog API

Repositorio de la API NestJS utilizada en la práctica formativa de Angular.

Este repositorio contiene únicamente el backend. El frontend debe crearse como un proyecto Angular independiente, en otro repositorio Git, para practicar también la creación y configuración de una aplicación desde cero.

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
- Visual Studio Code u otro editor

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

## Puesta en marcha de la API

```bash
npm install
npm run start:dev
```

Disponible en:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- Especificación OpenAPI generada: `swagger.json`

Los comandos se ejecutan desde la raíz del repositorio. También están disponibles `npm run build`, `npm test` y `npm run test:e2e`.

## Crear el frontend en otro repositorio

Instala Angular CLI si todavía no lo tienes y crea el proyecto fuera de este repositorio:

```bash
npm install -g @angular/cli
ng new vehicle-catalog-frontend --routing --style=css
cd vehicle-catalog-frontend
npm start
```

El proyecto Angular deberá consumir esta API, revisar Swagger como fuente de verdad y resolver su integración local con proxy y cookies cuando se active la autenticación. No se debe crear una carpeta `frontend/` dentro de este repositorio.

## Autenticación y modos de trabajo

La API soporta dos modos controlados desde `.env`.

Configuración actual:

```env
AUTH_ENABLED=true
JWT_SECRET=change-me-in-real-environments
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

### `AUTH_ENABLED=true`

Implica:

- login real mediante `POST /auth/login`
- sesión autenticada mediante cookies `HttpOnly`
- renovación de sesión con `POST /auth/refresh`
- cierre de sesión con `POST /auth/logout`
- acceso a `GET /auth/me`
- restricciones por rol en operaciones protegidas
- `access token` corto y `refresh token` rotado

### Cookies de sesion y seguridad

La sesion usa cookies `HttpOnly`, asi que el frontend no debe leer ni guardar tokens manualmente.

- `AUTH_COOKIE_PATH`: limita en que rutas se envian las cookies. En este proyecto se recomienda `/` para desarrollo con proxy Angular porque la ruta publica que ve el navegador suele pasar por `/api/...`
- `AUTH_COOKIE_SAME_SITE`: controla cuando el navegador envia cookies en peticiones cross-site. `lax` es el valor recomendado para esta practica
- `AUTH_COOKIE_SECURE`: si esta en `true`, la cookie solo viaja por HTTPS. En local con `http://localhost` debe estar en `false`; en produccion HTTPS deberia estar en `true`

Regla practica:

- local con proxy Angular: `AUTH_COOKIE_PATH=/`, `AUTH_COOKIE_SAME_SITE=lax`, `AUTH_COOKIE_SECURE=false`
- produccion con HTTPS: `AUTH_COOKIE_PATH=/`, `AUTH_COOKIE_SAME_SITE=lax` o `strict`, `AUTH_COOKIE_SECURE=true`

Credenciales de prueba:

- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user123`

### `AUTH_ENABLED=false`

Implica:

- bypass de autenticación
- inyección de un usuario ficticio con rol `ADMIN`
- posibilidad de trabajar primero el CRUD sin implementar login

## Criterios para el frontend externo

El frontend no se proporciona en este repositorio ni tiene un diseño cerrado. La persona participante puede elegir CSS plano, SCSS, Tailwind o una librería de componentes, siempre que la elección esté justificada y la interfaz sea coherente, funcional y defendible.

## Notas técnicas importantes

- el backend no está configurado con una política permisiva de CORS para `localhost`
- el frontend debe integrarse mediante proxy si quiere trabajar en desarrollo con sesión autenticada
- si se usan cookies de sesion con proxy, el `Path` de la cookie debe alinearse con la ruta publica que ve el navegador; por eso el valor por defecto recomendado es `AUTH_COOKIE_PATH=/`
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

- Swagger de la API: `http://localhost:3000/api-docs`
- API: `http://localhost:3000`
- Archivo de configuración auth: `.env`
- Plantilla de entorno: `.env.example`

Si tienes dudas sobre cómo modelar una petición o una respuesta, revisa Swagger antes de escribir código. En este proyecto, la API es la fuente de verdad.
